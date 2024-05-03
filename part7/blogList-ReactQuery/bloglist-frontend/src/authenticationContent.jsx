import { createContext, useReducer, useContext } from "react"

const authenticationReducer = (state, action) => {
    switch (action.type) {
        case 'setUser':
            return action.payload
        default:
            return state
    }
}

const authenticationContext = createContext()

export const AuthenticationContextProvider = (props) => {
    const [user, userDispatch] = useReducer(authenticationReducer, null)
    return (
        <authenticationContext.Provider value={[ user, userDispatch ]}>
            {props.children}
        </authenticationContext.Provider>
    )
}

export const useUserValue = () => {
    const userAndDispatch = useContext(authenticationContext)
    return userAndDispatch[0]
}

export const useUserDispatch = () => {
    const userAndDispatch = useContext(authenticationContext)
    return userAndDispatch[1]
}

export const setUser = (user) => {
    return { type: 'setUser', payload: user }
}

export default authenticationContext