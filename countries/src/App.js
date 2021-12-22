import { useEffect, useState } from "react";
import axios from "axios";

const OneCountry = ({ country }) => {
  console.log(country);
  const renderCountry = (
    <>
      <h2>{country.name.common}</h2>
      <p>{`Capital: ${country.capital}`}</p>
      <p>{`Population: ${country.population}`}</p>
      <h3>Spoken Languages</h3>
      {/* country.languages is an Object! Needs converting to array.  */}
      <ul>
        {Object.values(country.languages).map((language) => (
          <li>{language}</li>
        ))}
      </ul>
      <img
        src={country.flags.png}
        style={{ width: "30%" }}
        alt={`Flag of ${country.name.common}`}
      />
    </>
  );
  return renderCountry;
};

const MultipleCountries = ({ countries, setResultCountries }) => {
  console.log(countries);
  const renderCountries = (
    <div>
      {countries.map((country) => (
        <div key={country.ccn3}>
          {`${country.name.common} (${country.name.official})`}
          <button onClick={() => setResultCountries([country])}>show</button>
        </div>
      ))}
    </div>
  );
  console.log(countries.map((country) => country.name.common));
  return renderCountries;
};

const SearchResult = ({ resultCountries, searchValue, setResultCountries }) => {
  console.log(resultCountries, typeof resultCountries);
  const filteredCountries = resultCountries.filter((country) => {

    return (
      country.name.common.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
    );
  });
  console.log(filteredCountries);
  const filteredAmount = filteredCountries.length;
  if (filteredAmount === 0) {
    return null;
  } else if (filteredAmount === 1) {
    return <OneCountry country={filteredCountries[0]} />;
  } else {
    console.log(resultCountries);
    return (
      <MultipleCountries
        countries={filteredCountries}
        setResultCountries={setResultCountries}
      />
    );
  }
};

// this component doesn't get rendered if resultCountries.length !== 1
const CountryWeather = ({ weatherData }) => {
  const degreeToCompass = (degree) => {
    const value = Math.floor(degree / 22.5 + 0.5);

    // formula taken from https://stackoverflow.com/questions/7490660/
    const compassDirection = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ][value % 16];
    return compassDirection;
  };

  return (
    <>
      <h3>Weather in {weatherData.name}</h3>
      <p>Temperature: {Math.round(weatherData.temperature)} Celcius</p>
      {weatherData.icon !== undefined ? (
        <img
          src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
          alt="Icon of current weather"
        ></img>
      ) : null}
      <p>Wind: {`${Math.round(weatherData.windSpeed * 2.23)} mph`}</p>
      <p>Wind Direction: {degreeToCompass(weatherData.windDirection)}</p>
    </>
  );
};

function App() {
  const [searchValue, setSearchValue] = useState("");
  const [message, setMessage] = useState("Please enter search query.");
  const [resultCountries, setResultCountries] = useState([]);
  const [weatherData, setWeatherData] = useState({});

  const handleSearch = (event) => {
    setResultCountries([]);
    setSearchValue(event.target.value);

    // resultCountries need to be reset, otherwise SearchResult()
    // will use stale resultCountries, but new searchValue
    // eg: search for 'land', and immediatly paste "greenland"
    // Greenland will appear immediately, before apiHook in useEffect
  };

  const apiHook = () => {
    if (searchValue.length > 2) {
      setMessage("");
      const debounceTimer = setTimeout(() => {
        axios
          .get(`https://restcountries.com/v3.1/name/${searchValue}`)
          .then((response) => setResultCountries(response.data))
          .catch(() => {
            setResultCountries([]);
            setMessage("No countries found.");
            return;
          });
      }, 800);
      return () => clearTimeout(debounceTimer);
    } else if (searchValue.length === 0) {
      setMessage("Please enter search query.");
      setResultCountries([]);
    } else {
      setMessage("Please enter at least 3 letters.");
      setResultCountries([]);
    }
  };

  useEffect(apiHook, [searchValue]);

  const weatherHook = () => {
    if (resultCountries.length === 1) {
      const capital = resultCountries[0].capital;
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
        )
        .then((response) => {
          let weatherObj = {
            name: response.data.name,
            icon: response.data.weather[0].icon,
            temperature: response.data.main.temp,
            windSpeed: response.data.wind.speed,
            windDirection: response.data.wind.deg,
          };
          setWeatherData(weatherObj);
        });
    }
  };

  useEffect(weatherHook, [resultCountries]);
  return (
    <>
      <label>
        <input type="text" value={searchValue} onChange={handleSearch}></input>
      </label>
      <p>{message}</p>
      <SearchResult {...{ resultCountries, searchValue, setResultCountries }} />
      {resultCountries.length === 1 ? (
        <CountryWeather {...{ weatherData }} />
      ) : null}
    </>
  );
}

export default App;
