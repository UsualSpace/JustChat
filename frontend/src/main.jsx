import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GroupsContextProvider } from './contexts/groups_context.jsx'
import { FriendshipsContextProvider } from './contexts/friends_context.jsx'
import { BrowserRouter } from 'react-router-dom'
import { SocketContextProvider } from './contexts/socket_context.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GroupsContextProvider>
      <FriendshipsContextProvider>
        <SocketContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SocketContextProvider>
      </FriendshipsContextProvider>
    </GroupsContextProvider>
    
  </StrictMode>,
)
