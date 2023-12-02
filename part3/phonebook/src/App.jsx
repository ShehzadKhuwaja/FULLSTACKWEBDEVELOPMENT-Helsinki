import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
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
      alert(`${newName} is already added to the phonebook`)
      return
    }
  
    const newNameobject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }

    setPersons(persons.concat(newNameobject))
    setNewName('') 
    setNewNumber('')
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
      
      <Persons filteredPhoneBook={filteredPhoneBook} />

    </div>
  )
}

export default App
