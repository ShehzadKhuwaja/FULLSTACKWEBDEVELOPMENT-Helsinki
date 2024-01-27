import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/note'

// eslint-disable-next-line react/prop-types
const Notification = ({message, type}) => {

  const successNotificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  const errorNotificiationStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message === null) {
    return null
  }

  if (type === 'success') {
    return (
      <div style={successNotificationStyle}>{message}</div>
    )
  }
  else if (type === 'failure') {
    return (
      <div style={errorNotificiationStyle}>{message}</div>
    )
  }

  
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')

  const [newNumber, setNewNumber] = useState('')

  const [nameSearch, setNewSearch] = useState('')

  const [successMessage, setSuccessMessage] = useState(null)

  const [errorMessage, setErrorMessage] = useState(null)

  const filteredPhoneBook = persons.filter((person) => person.name.toUpperCase().includes(nameSearch.toUpperCase()))

  const handleNameSearch = (event) => {
    setNewSearch(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.find((person) => person.name === newName)) {
      const message = `${newName} is already added to the phonebook, replace the old number with a new one?`
      
      if (!window.confirm(message)) {
        setNewName('') 
        setNewNumber('')
        return
      }

      const objectToUpdate = persons.find((person) => person.name === newName)
      const updatedObject = { ...objectToUpdate, number: newNumber}

      personService
      .update(objectToUpdate.id, updatedObject)
      .then(response => {
        setPersons(persons.map(person => person.id !== objectToUpdate.id ? person : response.data ))

        setSuccessMessage(`${newName} number has been updated`)
        setTimeout(() => setSuccessMessage(null), 5000)
      })
      .catch(error => {
        setErrorMessage(error.response.data.error)
        setTimeout(() => setErrorMessage(null), 5000)
      })

      setNewName('') 
      setNewNumber('')

      return
    }
  
    const newNameobject = {
      name: newName,
      number: newNumber
    }

    personService
    .create(newNameobject)
    .then(response => {
      setPersons(persons.concat(response.data))
      setNewName('') 
      setNewNumber('')
      setSuccessMessage(`Added ${newName}`)
      setTimeout(() => setSuccessMessage(null), 5000)
    })
    .catch(error => {
      console.log(error.response.data.error)
      setErrorMessage(error.response.data.error)
      setTimeout(() => setErrorMessage(null), 5000)
    })

    

  }

  useEffect(() => {
    personService
    .getAll()
    .then(response => {
      setPersons(response.data)
    })
  }, [])

  const handleDelete = id => {
    setPersons(persons.filter(person => person.id !== id))
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={successMessage} type="success" />

      <Notification message={errorMessage} type="failure" />

      <Filter nameSearch={nameSearch} handleNameSearch={handleNameSearch} />

      <h2>add a new</h2>
      
      <PersonForm 
        addPerson={addPerson}
        newName={newName} 
        newNumber={newNumber} 
        handleNameChange={handleNameChange} 
        handleNumberChange={handleNumberChange}
      />
      
      <h2>Numbers</h2>
      
      <Persons filteredPhoneBook={filteredPhoneBook} onDelete={handleDelete}/>

    </div>
  )
}

export default App
