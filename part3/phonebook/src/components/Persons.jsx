import Person from "./Person"

const Persons = ({filteredPhoneBook}) => {
    return (
      filteredPhoneBook.map(({id, name, number}) => <Person key={id} name={name} number={number}/>)
    )
  }

export default Persons