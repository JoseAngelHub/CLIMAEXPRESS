from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

API_KEY = "cd533305d93c4c2b1cc30062030a9e5e"
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

#Obtener los datos del clima de ciudad o coordenadas
def get_weather(city=None, lat=None, lon=None):
    params = {"appid": API_KEY, "units": "metric", "lang": "es"}
    #Definir la forma en la que se obtiene el clima, por ciudad o por coordenadas
    if lat and lon:
        params["lat"] = lat
        params["lon"] = lon
    elif city:
        params["q"] = city
    else:
        return None
    
    response = requests.get(BASE_URL, params=params)
    
    if response.status_code == 200:
        data = response.json()
        weather_info = {
            "city": data.get("name", ""),#Nombre de la ciudad
            "temperature": data["main"].get("temp"),#Temperatura
            "icon": data["weather"][0].get("icon"),#Icono
            "description": data["weather"][0].get("description"),#Descripcion
            "wind_speed": data["wind"].get("speed"),#Velocidad del viento
            "wind_direction": data["wind"].get("deg"),#Direccion del viento
            "pressure": data["main"].get("pressure"),#Presion atmosferica
        }
        return weather_info#Se devuelve la informacion de la ciudad
    return None#En caso de error devuelve error

@app.route('/')
#Carga el html
def index():
    return render_template('index.html')

@app.route('/weather', methods=['GET'])
#Obtener los valores de esa ciudad
def weather():
    city = request.args.get('city')
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    
    if lat and lon:
        weather_data = get_weather(lat=lat, lon=lon)
    elif city:
        weather_data = get_weather(city=city)
    #Se devuelve en formato JSON
    if weather_data:
        return jsonify(weather_data)
    #Si no encuentra la informacion muestra
    return jsonify({"error": "&#10060 No se encontraron datos del clima."}), 404

#Ejecuta la aplicacion
if __name__ == '__main__':
    app.run(debug=True)