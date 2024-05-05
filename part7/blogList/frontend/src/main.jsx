import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './state'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'

console.log(store.getState())

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>
)
