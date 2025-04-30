//Funcion para buscar los datos del clima de la ciudad, se llama en el boton buscar y en el Select del desplegable
function fetchWeather(event) {
    const form = new FormData(event.target);
    const city = form.get("city");
    console.log("ciudad ", city);

    //Peticion a la API para obtener la informacion del clima de la ciudad obtenida

    if (city) {
        fetch(`/weather?city=${city}`)
            .then(response => response.json())//Convertimos a JSON
            .then(data => {
                show_weather(data);
            })
    }
    event.preventDefault();
    document.getElementById("form-1").reset();
}

//Obtiene el clima por coordenada
function getLocationWeather() {
    if (navigator.geolocation) {

        //Obtenemos la ubicacion
        navigator.geolocation.getCurrentPosition(
            position => {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;


                //Enviamos coordenadas a la API
                fetch(`/weather?lat=${lat}&lon=${lon}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error al obtener los datos del clima');
                        }
                        return response.json();
                    })
                    .then(data => {
                        show_weather(data);
                    })
            }
        );
    } else {
        document.getElementById('weatherResul').innerHTML = `<p>Geolocalizacion no soportada en este navegador.</p>`;
    }
}

//Muestra la informacion del clima en el HTML
function show_weather(data) {
    document.getElementById('weatherResul').innerHTML =
        `<h2>${data.city} &#128205</h2>
    <img src="https://openweathermap.org/img/wn/${data.icon}@2x.png" alt="Icono del clima">
    <p><strong>Temperatura:</strong> ${data.temperature}°C &#127777</p>
    <p><strong>Descripcion:</strong> ${data.description} &#127782</p>
    <p><strong>Viento:</strong> ${data.wind_speed} m/s &#127788</p>
    <p><strong>Direccion:</strong> ${data.wind_direction}° &#9095</p>
    <p><strong>Presion:</strong> ${data.pressure} hPa &#127757</p>`;
}

//Obtiene el clima al cargar la pagina
document.addEventListener('DOMContentLoaded', getLocationWeather);

///Funcion para el desplegable de las ciudades populares
function selectCity() {
    const dropdown = document.getElementById('cityDropdown');
    const selectedCity = dropdown.value;

    if (selectedCity) {//Cuando selecciones una ciudad
        document.getElementById('cityInput').value = selectedCity;
        fetchWeather(selectedCity);//Muestra el clima de la ciudad seleccionada
    }
}

//Para cambiar entre modo y oscuro
document.addEventListener("DOMContentLoaded", function () {
    const toggleSwitch = document.querySelector(".switch input");
    const htmlElement = document.documentElement;

    //Verificar si hay una preferencia guardada
    if (localStorage.getItem("darkMode") === "enabled") {
        htmlElement.classList.add("dark");
        toggleSwitch.checked = true;
    }

    //Cambiar entre modo oscuro y claro
    toggleSwitch.addEventListener("change", function () {
        if (toggleSwitch.checked) {
            htmlElement.classList.add("dark");
            localStorage.setItem("darkMode", "enabled");
        } else {
            htmlElement.classList.remove("dark");
            localStorage.setItem("darkMode", "disabled");
        }
    });
});


