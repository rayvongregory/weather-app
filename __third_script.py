import mysql.connector
from bs4 import BeautifulSoup
import requests
import re

mydb = mysql.connector.connect(
    host="localhost",
    user="Rayvon",
    password="@iLoveMyPillow1",
    database="lat_lon"
)
mycursor = mydb.cursor()


def dms2dec(dms_str):
    dms_str = re.sub(r'\s', '', dms_str)
    sign = -1 if re.search('[swSW]', dms_str) else 1
    numbers = [*filter(len, re.split('\D+', dms_str, maxsplit=4))]
    degree = numbers[0]
    minute = numbers[1] if len(numbers) >= 2 else '0'
    second = numbers[2] if len(numbers) >= 3 else '0'
    frac_seconds = numbers[3] if len(numbers) >= 4 else '0'
    second += "." + frac_seconds
    return sign * (int(degree) + float(minute) / 60 + float(second) / 3600)


sql = "SELECT province_id, province_name FROM `angola`.`angola_provinces`"
mycursor.execute(sql)
provinces = mycursor.fetchall()

for province in provinces:
    TABLES = {}
    p = province[1].replace(" ", "_")
    TABLES['angola_provinces'] = (
        f"  CREATE TABLE IF NOT EXISTS `angola`.`communes_of_{p}_province` ("
        "  `province_id` INT,"
        "  `commune_id` INT NOT NULL AUTO_INCREMENT,"
        "  `commune_name` VARCHAR(100),"
        "  `lat` VARCHAR(10),"
        "  `lon` VARCHAR(10),"
        "  PRIMARY KEY (`commune_id`),"
        "  FOREIGN KEY (province_id) REFERENCES `angola`.`angola_provinces`(province_id)"
        ") ENGINE=InnoDB"
    )
    mycursor.execute(TABLES['angola_provinces'])
    mydb.commit()
    url = f'https://en.wikipedia.org/wiki/Category:Populated_places_in_{p}_Province'
    wiki_content = requests.get(url).text
    soup = BeautifulSoup(wiki_content, "html.parser")
    commune_groups = soup.select("#mw-pages .mw-category-group")
    for vg in commune_groups[:]:
        if not vg.h3.text.isalpha():
            commune_groups.remove(vg)
    for vg in commune_groups:
        soup = BeautifulSoup(str(vg), "html.parser")
        commune_names = soup.select("li")
        for commune in commune_names:
            commune_name = commune.text.replace(
                ", Angola", "").replace(f", {province[1]}", "").replace(" (region)", "")
            url = f"https://en.wikipedia.org{commune.a['href']}"
            wiki_content = requests.get(url).text
            soup = BeautifulSoup(wiki_content, "html.parser")
            lat = soup.select(".latitude")
            lon = soup.select(".longitude")
            if len(lat) == 0:
                continue
            lat = str(dms2dec(lat[0].text))[0:10]
            lon = str(dms2dec(lon[0].text))[0:10]
            sql = f"INSERT IGNORE INTO `angola`.`communes_of_{p}_province` (province_id, commune_name, lat, lon) VALUES (%s, %s, %s, %s);"
            vals = (province[0], commune_name, lat, lon)
            mycursor.execute(sql, vals)
            mydb.commit()
