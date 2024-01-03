import Person from "./Person"

const Persons = ({filteredPhoneBook, onDelete}) => {

  return (
    filteredPhoneBook.map(({id, name, number}) => <Person key={id} name={name} number={number} onDelete={onDelete} id={id}/>)
  )
}

export default Persons