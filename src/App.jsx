import { useState, useEffect } from 'react'
import Login from './pages/auth/Login'
import Registro from './pages/auth/Registro'
import AdminDashboard from './pages/AdminDashboard' // Importamos el que acabamos de crear
import UserDashboard from './pages/UserDashboard'
import './App.css'

export default function App() {
  const [usuario, setUsuario] = useState(null)
  const [pantallaActual, setPantallaActual] = useState('login') // 'login' o 'registro'
  const [cargando, setCargando] = useState(true)

  // Revisa al cargar si el usuario ya estaba logueado
  useEffect(() => {
    const sesion = localStorage.getItem('user_movibus')
    if (sesion) {
      setUsuario(JSON.parse(sesion))
    }
    setCargando(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user_movibus')
    setUsuario(null)
    setPantallaActual('login')
  }

  if (cargando) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Cargando MoviBus...</div>
  }

  // Si no está logueado, decide si muestra Login o Registro
  if (!usuario) {
    return pantallaActual === 'login' ? (
      <Login 
        onLoginSuccess={(datos) => setUsuario(datos)} 
        onIrARegistro={() => setPantallaActual('registro')} 
      />
    ) : (
      <Registro onVolverAlLogin={() => setPantallaActual('login')} />
    )
  }

  // Si está logueado, decide el Dashboard por su ROL
  if (usuario.rol === 'ADMIN') {
    return <AdminDashboard usuario={usuario} onLogout={handleLogout} />
  } else {
    return <UserDashboard usuario={usuario} onLogout={handleLogout} />
  }
}