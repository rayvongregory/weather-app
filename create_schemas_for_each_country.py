import mysql.connector
import pycountry_convert as pc
from bs4 import BeautifulSoup
import requests

mydb = mysql.connector.connect(
    host="localhost",
    user="Rayvon",
    password="@iLoveMyPillow1",
)

mycursor = mydb.cursor()

sql = "SELECT (country_name) FROM `countries`.`country_names`"
mycursor.execute(sql)
countries = mycursor.fetchall()
for country in countries:
    country_name = country[0].replace(" ", "_")
    sql = f"CREATE DATABASE IF NOT EXISTS `{country_name}`"
    mycursor.execute(sql)
    mydb.commit()
