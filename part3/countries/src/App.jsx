import { useState, useEffect } from "react" 
import axios from "axios"

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

function App() {

  const [name, setName] = useState('')

  const [allCountries, setAllCountries] = useState(null)

  const [countriesToShow, setCountriesToShow] = useState(null)

  const [countryDetail, setCountryDetail] = useState(null)

  useEffect(() => {
    if (countriesToShow === '') {
      console.log(allCountries.map(country => country.name.common).filter(country => country.toLowerCase().includes(name.toLowerCase()))[0])
      axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${allCountries.map(country => country.name.common).filter(country => country.toLowerCase().includes(name.toLowerCase()))[0]}`)
      .then(response => {
        console.log(response.data.name.common)
        setCountryDetail(response.data)
      })
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
      setCountriesToShow("Too many matches, specify another filter")
      setCountryDetail(null)
    }
    else if (filteredCountries.length === 1) {
      setCountriesToShow("")
    }
    else {
      setCountriesToShow(filteredCountries.map(country => <div key={country}>{country}</div>))
      setCountryDetail(null)
    }

    setName(event.target.value)
  }

  return (
    <>
      <div>
        find Countries <input value={name} onChange={handleChange} />
      </div>

      {countriesToShow}

      <CountryDetail  details={countryDetail} />
    </>
  )
}

export default App
