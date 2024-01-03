import personService from "../services/note"

const Person = ({id, name, number, onDelete}) => {

  const handleDelete = () => {

    if (!window.confirm(`Delete ${name}`)) {
      return
    }
    
    personService
    .erase(id)
    .then(_ => {
      onDelete(id)
    })
  }

  return (
    <div>{name} {number} <button type="button" onClick={handleDelete}>delete</button></div>
  )
}

export default Person