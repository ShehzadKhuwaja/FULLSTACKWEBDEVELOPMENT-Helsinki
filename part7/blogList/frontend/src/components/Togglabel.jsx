import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'

const Togglabel = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none': '', marginBottom: '10px', marginTop: '10px'}
    const showWhenVisible = { display: visible ? '': 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    useImperativeHandle(ref, () => {
        return {
            toggleVisibility
        }
    })

    return (
        <div>
            <div style={hideWhenVisible}>
                <div className="d-grid">
                    <Button variant="primary" size="lg" onClick={ toggleVisibility }>
                        { props.buttonLabel }
                    </Button>
                </div>
            </div>
            <div style={showWhenVisible}>
                { props.children }
                <Button variant="danger" onClick={ toggleVisibility } className="mb-1">Cancel</Button>
                <hr className="my-4" />
            </div>
        </div>
    )
})

Togglabel.displayName = 'Togglable'

Togglabel.propTypes = {
    buttonLabel: PropTypes.string.isRequired
}

export default Togglabel