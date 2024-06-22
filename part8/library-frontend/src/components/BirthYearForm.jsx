import { useState } from "react"
import { Button, FloatingLabel, Form } from "react-bootstrap"
import { EDIT_BIRTHYEAR, ALL_AUTHORS } from "../queries"
import { useMutation } from "@apollo/client"
import { useNavigate } from "react-router-dom"
import Select from 'react-select'

const BirthYearForm = ({ authors }) => {

    const [setBornTo, setBorn] = useState('')
    const [selectedOption, setSelectedOption] = useState(null);

    const navigate = useNavigate()

    const options = []
    authors.forEach(author => {
        options.push({ value: author.name, label: author.name })
    })

    const [ editBirthYear ] = useMutation(EDIT_BIRTHYEAR, {
        refetchQueries: [{ query: ALL_AUTHORS }],
        onError: (error) => {
            const messages = error.graphQLErrors.map(e => e.message).join('\n')
            console.log(messages)
        }
    })

    const handleSubmit = async (event) => {
        event.preventDefault()

        await editBirthYear({ variables: { name: selectedOption.value, setBornTo } })

        setBorn('')

        navigate('/')
    }

    return (
        <div>
            <h2>Set Birth Year</h2>
            <Form onSubmit={handleSubmit}>
            <Select
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={options}
                menuPortalTarget={document.body}
                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            />

                <FloatingLabel
                controlId="floatingTitle"
                label="Born"
                className="mb-3 mt-3"
                >
                <Form.Control
                    type="number"
                    placeholder="year"
                    value={setBornTo}
                    onChange={({ target }) => setBorn(parseInt(target.value))}
                />
                </FloatingLabel>

                <Button variant="primary" type="submit">
                    Update Author
                </Button>
            </Form>
        </div>
    )
}

export default BirthYearForm