import { useState, useEffect } from "react";
import "./index.css";


const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if(!navigator.geolocation) {
      setError("Geolocation is not supported by your browser!")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
      }, 
      (err) => {
        console.error("Geolocation error", err.message);
        setError("Problems with getting your geolocation")
      }
    );
  }, []);

    async function handleCityChange(e) {
      const newCity = e.target.value;
      setCity(newCity);
      setLoading(true);
      if(!city.trim() && !coords) {
        setWeatherData(null);
        setError(null);
        return
      }
      try {
        const query = newCity.trim() ? city : `${coords.latitude}, ${coords.longitude}`
        const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${query}`);

      const data = await res.json();
      if(data.error) {
        setError(data.error.message);
      }

      setWeatherData(data);
      setError(null);
    } 
      catch (err) {
      console.log(err);
      setError(err.message)
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }

function renderError() {
  return (
    <p>{error}</p>
  );
}

function renderLoading() {
  return (
    <p>Loading...</p>
  );
}

function renderWeather() {
  return (
    <div className="weather-card">
      <h2>{`${weatherData?.location?.name}, ${weatherData?.location?.country}`}</h2>
      <img src={`https:${weatherData?.current?.condition?.icon}`} alt="icon" className="weather-icon" />
      <p className="temperature">{Math.round(weatherData?.current?.temp_c)}°C</p>
      <p className="condition">{weatherData?.current?.condition?.text}</p>
      <div className="weather-details">
        <p>Humidity: {weatherData?.current?.humidity}%</p>
        <p>Wind: {weatherData?.current?.wind_kph} km/h</p>
      </div>
    </div>
  );
}

console.log(weatherData);

  return (
    <div className="app">
      <div className="widget-container">
        <div className="weather-card-container">
          <h1 className="app-title">Weather Widget</h1>
          <div className="search-container">
            <input
              type="text"
              value={city} 
              placeholder="Enter city name"
              className="search-input" onChange={handleCityChange}
            />
          </div>
        </div>
        {error && renderError()}
        {loading && renderLoading()}
        {!loading && !error && weatherData && renderWeather()}
          
      </div>
    </div>
  );
}

export default App;
