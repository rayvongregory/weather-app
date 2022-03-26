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
TABLES['first_level_subdivisions'] = (
    "  CREATE TABLE IF NOT EXISTS `latvia`.`first_level_subdivisions` ("
    "  `first_level_subdivision_type_id` INT,"
    "  `first_level_subdivision_id` INT NOT NULL AUTO_INCREMENT,"
    "  `first_level_subdivision_name` VARCHAR(255),"
    "  `lat` VARCHAR(10),"
    "  `lon` VARCHAR(10),"
    "  PRIMARY KEY (`first_level_subdivision_id`),"
    "  FOREIGN KEY (first_level_subdivision_type_id) REFERENCES `latvia`.`first_level_subdivision_types`(first_level_subdivision_type_id)"
    ") ENGINE=InnoDB"
)

TABLES['first_level_subdivision_types'] = (
    "  CREATE TABLE IF NOT EXISTS `latvia`.`first_level_subdivision_types` ("
    "  `first_level_subdivision_type_id` INT NOT NULL AUTO_INCREMENT,"
    "  `first_level_subdivision_type_name` VARCHAR(45),"
    "  PRIMARY KEY (`first_level_subdivision_type_id`)"
    ") ENGINE=InnoDB"
)

mycursor.execute(TABLES['first_level_subdivision_types'])
mycursor.execute(TABLES['first_level_subdivisions'])
mydb.commit()
# exit()

url = 'https://en.wikipedia.org/wiki/Administrative_divisions_of_Latvia'
wiki_content = requests.get(url).text
soup = BeautifulSoup(wiki_content, "html.parser")
# provinces = soup.select("#mw-pages .mw-category-group")
provinces = soup.select(
    "table.wikitable:nth-of-type(2) tr td:nth-of-type(4) > a")
# print(provinces)
# exit()
# for province in provinces[:]:
#     if not province.h3.text.isalpha():
#         provinces.remove(province)
# soup = BeautifulSoup(str(provinces), "html.parser")
# list_items = soup.select("li")

for item in provinces:
    # parish_name = item.text.split(" Municipality")[0]
    num = 2
    parish_name = item.text
    if parish_name.endswith("Parish"):
        num = 3
    # print(parish_name)
    url = f"https://en.wikipedia.org{item['href']}"
    # print(url)
    wiki_content = requests.get(url).text
    soup = BeautifulSoup(wiki_content, "html.parser")
    lat_lon = soup.select_one(".geo-dms").text.split(" ")
    lat = str(dms2dec(lat_lon[0]))[:10]
    lon = str(dms2dec(lat_lon[1]))[:10]
    sql = "INSERT INTO `latvia`.`first_level_subdivisions` (first_level_subdivision_type_id, first_level_subdivision_name, lat, lon) VALUES (%s, %s, %s, %s);"
    vals = (num, parish_name, lat, lon)
    # print(sql, vals)
    # exit()
    mycursor.execute(sql, vals)
    mydb.commit()
