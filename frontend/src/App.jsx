import React, { useEffect } from 'react'
import { socket } from './socket'
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import MainRoutes from './routes/MainRoutes';
import Navbar from './components/Navbar';

const App = () => {
  useEffect(()=>{
    socket.connect();
  })
  return (
    <>
    <MainRoutes/>
    
    </>
    )
}



export default App