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
    "  CREATE TABLE IF NOT EXISTS `afghanistan`.`first_level_subdivisions` ("
    "  `first_level_subdivision_type_id` INT,"
    "  `first_level_subdivision_id` INT NOT NULL AUTO_INCREMENT,"
    "  `first_level_subdivision_name` VARCHAR(255),"
    "  PRIMARY KEY (`first_level_subdivision_id`),"
    "  FOREIGN KEY (first_level_subdivision_type_id) REFERENCES `afghanistan`.`first_level_subdivision_types`(first_level_subdivision_type_id)"
    ") ENGINE=InnoDB"
)

TABLES['first_level_subdivision_types'] = (
    "  CREATE TABLE IF NOT EXISTS `afghanistan`.`first_level_subdivision_types` ("
    "  `first_level_subdivision_type_id` INT NOT NULL AUTO_INCREMENT,"
    "  `first_level_subdivision_type_name` VARCHAR(45),"
    "  PRIMARY KEY (`first_level_subdivision_type_id`)"
    ") ENGINE=InnoDB"
)

# TABLES['afghanistan_level_two_subdivision_type'] = (
#     "  CREATE TABLE IF NOT EXISTS `afghanistan`.`afghanistan_level_two_subdivision_type` ("
#     "  `country_code` VARCHAR(2),"
#     "  `type` VARCHAR(45),"
#     "  PRIMARY KEY (`country_code`),"
#     "  FOREIGN KEY (`country_code`) REFERENCES `countries`.`country_names`(country_code)"
#     ") ENGINE=InnoDB"
# )

# TABLES['afghanistan_level_three_subdivision_type'] = (
#     "  CREATE TABLE IF NOT EXISTS `afghanistan`.`afghanistan_level_three_subdivision_type` ("
#     "  `country_code` VARCHAR(2),"
#     "  `type` VARCHAR(45),"
#     "  PRIMARY KEY (`country_code`),"
#     "  FOREIGN KEY (`country_code`) REFERENCES `countries`.`country_names`(country_code)"
#     ") ENGINE=InnoDB"
# )

mycursor.execute(TABLES['first_level_subdivision_types'])
mycursor.execute(TABLES['first_level_subdivisions'])
# mycursor.execute(TABLES['afghanistan_level_two_subdivision_type'])
# mycursor.execute(TABLES['afghanistan_level_three_subdivision_type'])
mydb.commit()

# mycursor.execute(
#     "INSERT IGNORE INTO `afghanistan`.`first_level_subdivision_types` (`first_level_subdivision_type_name`) VALUES ('Province')")
# mydb.commit()

url = 'https://en.wikipedia.org/wiki/Category:Provinces_of_Afghanistan'
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
    #     sql = "INSERT INTO afghanistan.afghanistan_provinces_and_autonomous_city  (province_name, country_code) VALUES (%s, %s);"
    #     vals = ("Autonomous City of Bueno Aires", "AR")
    #     mycursor.execute(sql, vals)
    #     mydb.commit()
    #     continue
    item_text = item.text.split(" Province")[0].strip()
    if item_text.startswith("Template"):
        continue
    sql = "INSERT INTO `afghanistan`.`first_level_subdivisions` (first_level_subdivision_type_id, first_level_subdivision_name) VALUES (%s, %s);"
    vals = (1, item_text)
    mycursor.execute(sql, vals)
    mydb.commit()
