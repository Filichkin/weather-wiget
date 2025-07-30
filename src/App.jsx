import { useState, useEffect } from "react";
import "./index.css";


const API_KEY = "";

function App() {
  const [city, setCity] = useState("Samara");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getData() {
      try {const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`);
      // if(!res.ok) {
      //   throw new Error(`Error: ${res.status} ${res.statusText}`
      // );
      // }

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
    }
  }
    getData();
}, []);

console.log(weatherData);

  return (
    <div className="app">
      <div className="widget-container">
        <div className="weather-card-container">
          <h1 className="app-title">Weather Widget</h1>
          <div className="search-container">
            <input type="text" placeholder="Enter city name" className="search-input" />
          </div>
        </div>
          <div className="weather-card">
            <h2>{`${weatherData?.location?.name}, ${weatherData?.location?.country}`}</h2>
            <img src="" alt="icon" className="weather-icon" />
            <p className="temperature">11°C</p>
            <p className="condition">rainy</p>
            <div className="weather-details">
              <p>Humidity: 20%</p>
              <p>Wind: 22 km/h</p>
            </div>
          </div>
      </div>
    </div>
  );
}

export default App;
