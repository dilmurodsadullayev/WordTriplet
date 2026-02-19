import os
from dotenv import load_dotenv
import requests

load_dotenv()
API_KEY = os.getenv("API_KEY")

if not API_KEY:
    raise Exception("API_KEY .env faylda topilmadi!")

url = f"https://translation.googleapis.com/language/translate/v2?key={API_KEY}"

data = {
    'q': 'Salom, Anakin!',
    'source': 'uz',
    'target': 'en',
    'format': 'text'
}

response = requests.post(url, data=data)

if response.status_code == 200:
    print("Tarjima natijasi:", response.json()['data']['translations'][0]['translatedText'])
else:
    print("Xatolik:", response.status_code, response.text)
