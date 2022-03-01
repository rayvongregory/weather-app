import mysql.connector
import pycountry_convert as pc
from bs4 import BeautifulSoup
import requests
rename_list = []

mydb = mysql.connector.connect(
    host="localhost",
    user="Rayvon",
    password="@iLoveMyPillow1",
)
mycursor = mydb.cursor()

TABLES = {}
TABLES['second_level_subdivisions'] = (
    "  CREATE TABLE IF NOT EXISTS `afghanistan`.`second_level_subdivisions` ("
    "  `first_level_subdivision_id` INT,"
    "  `second_level_subdivision_type_id` INT,"
    "  `second_level_subdivision_id` INT NOT NULL AUTO_INCREMENT,"
    "  `second_level_subdivision_name` VARCHAR(255),"
    "  `lat` VARCHAR(10),"
    "  `lon` VARCHAR(10),"
    "  PRIMARY KEY (`second_level_subdivision_id`),"
    "  FOREIGN KEY (first_level_subdivision_id) REFERENCES `afghanistan`.`first_level_subdivisions`(first_level_subdivision_id),"
    "  FOREIGN KEY (second_level_subdivision_type_id) REFERENCES `afghanistan`.`second_level_subdivision_types`(second_level_subdivision_type_id)"
    ") ENGINE=InnoDB"
)

TABLES['second_level_subdivision_types'] = (
    "  CREATE TABLE IF NOT EXISTS `afghanistan`.`second_level_subdivision_types` ("
    "  `first_level_subdivision_type_id` INT"
    "  `second_level_subdivision_type_id` INT NOT NULL AUTO_INCREMENT,"
    "  `second_level_subdivision_type_name` VARCHAR(45),"
    "  PRIMARY KEY (`second_level_subdivision_type_id`),"
    "  FOREIGN KEY (second_level_subdivision_type_id) REFERENCES `afghanistan`.`second_level_subdivision_types`(second_level_subdivision_type_id)"
    ") ENGINE=InnoDB"
)

mycursor.execute(TABLES['second_level_subdivision_types'])
mycursor.execute(TABLES['second_level_subdivisions'])
mydb.commit()

# url = 'https://en.wikipedia.org/wiki/Badakhshan_Province#Districts'
# wiki_content = requests.get(url).text
# soup = BeautifulSoup(wiki_content, "html.parser")
# districts = soup.select("table.wikitable.sortable tbody tr td:first-of-type")
# for district in districts:
#     sql = "INSERT INTO lat_lon.districts_of_badakhshan_province  (province_id, district_name) VALUES (%s, %s);"
#     vals = (1, district.text)
#     mycursor.execute(sql, vals)
#     mydb.commit()
