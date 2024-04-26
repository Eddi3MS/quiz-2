import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import { useEffect } from 'react'
import { socket } from '../config/socket'

const RootLayout = () => {
  useEffect(() => {
    socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [])
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default RootLayout
