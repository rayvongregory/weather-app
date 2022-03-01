import mysql.connector
import pycountry_convert as pc
from bs4 import BeautifulSoup
import requests
import re

mydb = mysql.connector.connect(
    host="localhost",
    user="Rayvon",
    password="@iLoveMyPillow1",
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


TABLES = {}
TABLES['antigua_and_barbuda_parishes_and_dependencies'] = (
    "  CREATE TABLE IF NOT EXISTS `antigua_and_barbuda`.`antigua_and_barbuda_parishes_and_dependencies` ("
    "  `country_code` VARCHAR(2),"
    "  `pd_id` INT NOT NULL AUTO_INCREMENT,"
    "  `pd_name` VARCHAR(100),"
    "  `lat` VARCHAR(10),"
    "  `lon` VARCHAR(10),"
    "  PRIMARY KEY (`pd_id`),"
    "  FOREIGN KEY (`country_code`) REFERENCES `countries`.`country_names`(country_code)"
    ") ENGINE=InnoDB"
)

TABLES['antigua_and_barbuda_level_one_subdivision_type'] = (
    "  CREATE TABLE IF NOT EXISTS `antigua_and_barbuda`.`antigua_and_barbuda_level_one_subdivision_type` ("
    "  `country_code` VARCHAR(2),"
    "  `type` VARCHAR(45),"
    "  PRIMARY KEY (`country_code`),"
    "  FOREIGN KEY (`country_code`) REFERENCES `countries`.`country_names`(country_code)"
    ") ENGINE=InnoDB"
)

mycursor.execute(TABLES['antigua_and_barbuda_parishes_and_dependencies'])
mycursor.execute(TABLES['antigua_and_barbuda_level_one_subdivision_type'])

mydb.commit()

sql = "INSERT IGNORE INTO `antigua_and_barbuda`.`antigua_and_barbuda_level_one_subdivision_type` (`country_code`, `type`)  VALUES (%s, %s)"
vals = ("AG", "Parish or subdivision")
mycursor.execute(sql, vals)
mydb.commit()

url = "https://en.wikipedia.org/wiki/Category:Dependencies_of_Antigua_and_Barbuda"
# selector = ".sortable tr td:not(td[rowspan]):not(td:nth-last-of-type(1)):not(td[data-sort-value])"
selector = "#mw-pages .mw-category-group"
wiki_contents = requests.get(url).text
soup = BeautifulSoup(wiki_contents, "html.parser")
pds_groups = soup.select(selector)
for pdg in pds_groups:
    soup = BeautifulSoup(str(pdg), "html.parser")
    pds = soup.select("li")
    for pd in pds:
        pd_name = pd.text.split(" Parish,")[0]
        url = f"https://en.wikipedia.org{pd.a['href']}"
        wiki_content = requests.get(url).text
        soup = BeautifulSoup(wiki_content, "html.parser")
        lat = soup.select(".latitude")
        lon = soup.select(".longitude")
        if len(lat) == 0:
            continue
        lat = str(dms2dec(lat[0].text))[0:10]
        lon = str(dms2dec(lon[0].text))[0:10]
        sql = f"INSERT INTO `antigua_and_barbuda`.`antigua_and_barbuda_parishes_and_dependencies` (country_code, pd_name, lat, lon) VALUES (%s, %s, %s, %s);"
        vals = ("AG", pd_name, lat, lon)
        mycursor.execute(sql, vals)
        mydb.commit()
