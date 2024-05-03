import ReactDOM from 'react-dom/client'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationContextProvider } from './NotificationContext'
import { AuthenticationContextProvider } from './AuthenticationContent'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        <NotificationContextProvider>
            <AuthenticationContextProvider>
                <App />
            </AuthenticationContextProvider>
        </NotificationContextProvider>
    </QueryClientProvider>
)
