import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './Routes/Router.jsx'
import { RouterProvider } from 'react-router-dom';
import App from './App.jsx'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';
import Chat from './Pages/Chat/Chat.jsx';


createRoot(document.getElementById('root')).render(

  <StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
