import { useState, useEffect } from "react" 
import axios from "axios"
const api_key = import.meta.env.VITE_SOME_KEY


const CountryDetail = ({details}) => {
  if (details) {
    return (
      <>
        <h1>{details.name.common}</h1>
        <div>capital {details.capital[0]}</div>
        <div>area {details.area}</div>
        <h2>languages:</h2>
        <ul>
          {Object.values(details.languages).map(name => <li key={name}>{name}</li>)}
        </ul>
        <img src={details.flags['png']} alt={details.flags['alt']}/>
      </>
    )
  }
  else {
    return <></>
  }
  
}

const WeatherDetails = ({weatherDetails}) => {
  if (weatherDetails) {
    return (
      <>
      <h1>Weather in {weatherDetails.name}</h1>
      <div>temperature {weatherDetails.temperature} Celcius</div>
      <img src={`https://openweathermap.org/img/wn/${weatherDetails.icon}@2x.png`} />
      <div>wind {weatherDetails.windSpeed} m/s</div>
      </>
    )
  }
  else {
    return <></>
  }
}

const CountryList = ({countriesToShow, showHandler}) => {

  if (!countriesToShow) {
    return <></> 
  }

  if (countriesToShow.length === 1) {
    if (countriesToShow[0].message) {
      return <div>{countriesToShow[0].message}</div>
    }
    else {
      console.log(countriesToShow[0])
      return (
        <>
        <div><CountryDetail details={countriesToShow[0].details}/></div>
        <div><WeatherDetails weatherDetails={countriesToShow[0].weatherInfo} /></div>
        </>
      )
    }
  }
  else {
    const listItems = []
    //console.log(countriesToShow)
    countriesToShow.forEach((country, index) => {
      //console.log(country)
      //console.log(country.show)
      if (country.show === false) {
        listItems.push(<div key={country.country}>{country.country} <button onClick={() => showHandler(country.country)}>show</button></div>)
      }
      else {
        if (country.details) {
          listItems.push(
          <div key={country.country}>
            {country.country} <button onClick={() => showHandler(country.country)}>hide</button>
            <div>
              <CountryDetail  details={country.details} />
            </div>
          </div>
          )
        }
        else {
          listItems.push(<div key={country.country}>{country.country} <button onClick={() => showHandler(country.country)}>hide</button></div>)
        }
      }
    })

    return listItems
  }

}

function App() {

  const [name, setName] = useState('')

  const [allCountries, setAllCountries] = useState(null)

  const [countriesToShow, setCountriesToShow] = useState(null)

  const showHandler = (country) => {
    console.log(`explore`)
    console.log(countriesToShow)
    const filteredObject = countriesToShow.filter(obj => obj.country === country)[0]
    console.log(filteredObject)
    const updatedObject = filteredObject.show ? {...filteredObject, show: false}: {...filteredObject, show: true}
    console.log(updatedObject)
    const updatedList =  JSON.parse(JSON.stringify(countriesToShow))
    console.log(updatedList.map(obj => obj.country !== country ? obj: updatedObject))
    setCountriesToShow(updatedList.map(obj => obj.country !== country ? obj: updatedObject))
  }

  

  useEffect(() => {
    console.log(`ok`)
    console.log(countriesToShow)
    if (countriesToShow) {
      if (countriesToShow.length === 1 && countriesToShow[0].message === null && countriesToShow[0].details === null) {
        //console.log(allCountries.map(country => country.name.common).filter(country => country.toLowerCase().includes(name.toLowerCase()))[0])
        axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${countriesToShow[0].country}`)
        .then(response => {
          //console.log(response.data.name.common)
          const oldObject = countriesToShow[0]
          const updatedobject = {...oldObject, details: response.data, weatherInfo: null}

          const [lat, lon] = response.data.capitalInfo.latlng
          const unit = 'metric'
          console.log(api_key)
          console.log(lat, lon)

          axios
          .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${api_key}`)
          .then(response => {
            console.log(response.data)
            const weatherInfo = {name: response.data.name , temperature: response.data.main.temp, windSpeed: response.data.wind.speed, icon: response.data.weather[0].icon}
            console.log(weatherInfo)
            updatedobject['weatherInfo'] = weatherInfo
            setCountriesToShow([updatedobject])
            console.log(updatedobject)
          })

          console.log(updatedobject)
          setCountriesToShow([updatedobject])
        })
      }
      else if (countriesToShow.length <= 10) {
        console.log(`1`)
        const updatedCountryList = JSON.parse(JSON.stringify(countriesToShow))
        countriesToShow.forEach((country, index) => {
          if (country.show === true && country.details === null && country.details === null) {
            axios
            .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country.country}`)
            .then(response => {
              console.log(`data`)
              updatedCountryList[index] = {...country, details: response.data}
              setCountriesToShow(updatedCountryList)
            })
          }
        })
        //setCountriesToShow(updatedCountryList)
      }
    }
  }, [countriesToShow])

  useEffect(() => {
    axios
    .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
    .then(response => {
      setAllCountries(response.data)
    })
  }, [])

  const handleChange = event => {

    const filteredCountries = allCountries ? 
    allCountries
    .map(country => country.name.common)
    .filter(country => event.target.value !== '' && country.toLowerCase().includes(event.target.value.toLowerCase())) : []

    if (filteredCountries.length > 10) {
      //setCountriesToShow("Too many matches, specify another filter")
      setCountriesToShow([{country: null, show: false, details: null, message: "Too many matches, specify another filter"}])
      //setCountryDetail(null)
    }
    else if (filteredCountries.length === 1) {
      setCountriesToShow([{country: filteredCountries[0], show: true, details: null, message: null}])
    }
    else {
      //setCountriesToShow(filteredCountries.map(country => <CountryList key={country} country={country} showHandler={() => showHandler(country)} />))
      setCountriesToShow(filteredCountries.map(country => ({country: country, show: false, details: null, message: null})))
      //setCountryDetail(null)
    }

    setName(event.target.value)
  }

  return (
    <>
      <div>
        find Countries <input value={name} onChange={handleChange} />
      </div>

      <CountryList  countriesToShow={countriesToShow} showHandler={showHandler} />

    </>
  )
}

export default App