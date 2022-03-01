import mysql.connector
import pycountry_convert as pc
from bs4 import BeautifulSoup
import requests

mydb = mysql.connector.connect(
    host="localhost",
    user="Rayvon",
    password="@iLoveMyPillow1",
    database="countries"
)

mycursor = mydb.cursor()

for c in ["asia", "africa", "europe", "north-america", "south-america", "australia/oceania"]:
    url = f'https://www.worldometers.info/geography/7-continents/{c}/'
    html_content = requests.get(url).text
    soup = BeautifulSoup(html_content, "html.parser")
    list_items = soup.select("td:nth-of-type(2)")
    for i in list_items:
        sql = "INSERT IGNORE INTO `countries`.`country_names` VALUES (%s, %s)"
        try:
            country_code = pc.country_name_to_country_alpha2(
                i.text, cn_name_format="default")
            val = (country_code, i.text)
            mycursor.execute(sql, val)
            mydb.commit()
        except:
            pass

sql = "INSERT IGNORE INTO `countries`.`country_names` VALUES (%s, %s)"
mycursor.execute(sql, ("PS", "State of Palestine"))
mycursor.execute(sql, ("TL", "Timor-Leste"))
mycursor.execute(sql, ("SH", "Saint Helena"))
mycursor.execute(sql, ("FO", "Faeroe Islands"))
mycursor.execute(sql, ("VA", "Holy See (Vatican City State)"))
mycursor.execute(sql, ("US", "United States"))
mycursor.execute(sql, ("SX", "Sint Maarten"))
mycursor.execute(sql, ("BQ", "Caribbean Netherlands"))
mycursor.execute(sql, ("EH", "Western Sahara"))
mycursor.execute(sql, ("WF", "Wallis and Futuna Islands"))
mydb.commit()
