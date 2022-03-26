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
TABLES['first_level_subdivisions'] = (
    "  CREATE TABLE IF NOT EXISTS `australia`.`first_level_subdivisions` ("
    "  `first_level_subdivision_type_id` INT,"
    "  `first_level_subdivision_id` INT NOT NULL AUTO_INCREMENT,"
    "  `first_level_subdivision_name` VARCHAR(255),"
    "  PRIMARY KEY (`first_level_subdivision_id`),"
    "  FOREIGN KEY (first_level_subdivision_type_id) REFERENCES `australia`.`first_level_subdivision_types`(first_level_subdivision_type_id)"
    ") ENGINE=InnoDB"
)

TABLES['first_level_subdivision_types'] = (
    "  CREATE TABLE IF NOT EXISTS `australia`.`first_level_subdivision_types` ("
    "  `first_level_subdivision_type_id` INT NOT NULL AUTO_INCREMENT,"
    "  `first_level_subdivision_type_name` VARCHAR(45),"
    "  PRIMARY KEY (`first_level_subdivision_type_id`)"
    ") ENGINE=InnoDB"
)

TABLES['second_level_subdivision_types'] = (
    "  CREATE TABLE IF NOT EXISTS `australia`.`second_level_subdivision_types` ("
    "  `second_level_subdivision_type_id` INT NOT NULL AUTO_INCREMENT,"
    "  `second_level_subdivision_type_name` VARCHAR(45),"
    "  PRIMARY KEY (`second_level_subdivision_type_id`)"
    ") ENGINE=InnoDB"
)

TABLES['second_level_subdivisions'] = (
    "  CREATE TABLE IF NOT EXISTS `australia`.`second_level_subdivisions` ("
    "  `first_level_subdivision_id` INT NOT NULL,"
    "  `second_level_subdivision_type_id` INT,"
    "  `second_level_subdivision_id` INT NOT NULL AUTO_INCREMENT,"
    "  `second_level_subdivision_name` VARCHAR(45),"
    "  `lat` VARCHAR(10),"
    "  `lon` VARCHAR(10),"
    "  PRIMARY KEY (`second_level_subdivision_id`),"
    "  FOREIGN KEY (`first_level_subdivision_id`) REFERENCES `australia`.`first_level_subdivisions`(first_level_subdivision_id),"
    "  FOREIGN KEY (`second_level_subdivision_type_id`) REFERENCES `australia`.`second_level_subdivision_types`(second_level_subdivision_type_id)"
    ") ENGINE=InnoDB"
)
mycursor.execute(TABLES['first_level_subdivision_types'])
mycursor.execute(TABLES['first_level_subdivisions'])
mycursor.execute(TABLES['second_level_subdivision_types'])
mycursor.execute(TABLES['second_level_subdivisions'])

mydb.commit()
exit()
# TABLES['australia_level_three_subdivision_type'] = (
#     "  CREATE TABLE IF NOT EXISTS `australia`.`australia_level_three_subdivision_type` ("
#     "  `country_code` VARCHAR(2),"
#     "  `type` VARCHAR(45),"
#     "  PRIMARY KEY (`country_code`),"
#     "  FOREIGN KEY (`country_code`) REFERENCES `countries`.`country_names`(country_code)"
#     ") ENGINE=InnoDB"
# )

# mycursor.execute(TABLES['australia_level_three_subdivision_type'])
# exit()
# mycursor.execute(
#     "INSERT IGNORE INTO `australia`.`first_level_subdivision_types` (`first_level_subdivision_type_name`) VALUES ('Province')")
# mydb.commit()

url = 'https://en.wikipedia.org/wiki/Category:Provinces_of_Armenia'
wiki_content = requests.get(url).text
soup = BeautifulSoup(wiki_content, "html.parser")
provinces = soup.select("#mw-pages .mw-category-group")
for province in provinces[:]:
    if not province.h3.text.isalpha():
        provinces.remove(province)
soup = BeautifulSoup(str(provinces), "html.parser")
list_items = soup.select("li")
for item in list_items:
    # if item.text == "Buenos Aires":
    #     sql = "INSERT INTO australia.australia_provinces_and_autonomous_city  (province_name, country_code) VALUES (%s, %s);"
    #     vals = ("Autonomous City of Bueno Aires", "AR")
    #     mycursor.execute(sql, vals)
    #     mydb.commit()
    #     continue
    item_text = item.text.split(" Province")[0].strip()
    if item_text.startswith("Template"):
        continue
    num = 1
    if item_text.startswith("Yerevan"):
        num = 2
    sql = "INSERT INTO `australia`.`first_level_subdivisions` (first_level_subdivision_type_id, first_level_subdivision_name) VALUES (%s, %s);"
    vals = (num, item_text)
    mycursor.execute(sql, vals)
    mydb.commit()
