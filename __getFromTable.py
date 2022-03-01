import mysql.connector
import pycountry_convert as pc
from bs4 import BeautifulSoup
import requests
import re
rename_list = []

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


sql = "SELECT first_level_subdivision_name, first_level_subdivision_id FROM `afghanistan`.`first_level_subdivisions`;"
mycursor.execute(sql)
for first_level_subdivision_name in mycursor.fetchall():
    name = first_level_subdivision_name[0]
    selector = f'[aria-labelledby="{name.replace(" ", "_")}_Province"] .nowraplinks.mw-collapsible.autocollapse.navbox-inner tr:nth-of-type(4) td li'
    url = f"https://en.wikipedia.org/wiki/{name}_Province"
    wiki_content = requests.get(url).text
    soup = BeautifulSoup(wiki_content, "html.parser")
    villages = soup.select(selector)
    for village in villages:
        url = f"https://en.wikipedia.org{village.a['href']}"
        village_name = village.text
        wiki_content = requests.get(url).text
        soup = BeautifulSoup(wiki_content, "html.parser")
        lat_lon = soup.select(".geo-dms:first-of-type span")
        try:
            lat = str(dms2dec(lat_lon[0].text))[:10]
            lon = str(dms2dec(lat_lon[1].text))[:10]
            sql = f'INSERT INTO `afghanistan`.`second_level_subdivisions` (first_level_subdivision_id, second_level_subdivision_type_id, second_level_subdivision_name, lat, lon) VALUES ({first_level_subdivision_name[1]}, 1, "{village_name}", "{lat}", "{lon}")'
            mycursor.execute(sql)
            mydb.commit()
        except Exception as e:
            print(e)
