import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/note'



const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')

  const [newNumber, setNewNumber] = useState('')

  const [nameSearch, setNewSearch] = useState('')

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
        setNewName('') 
        setNewNumber('')
      })

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
