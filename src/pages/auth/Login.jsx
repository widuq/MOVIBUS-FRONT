import { useState } from 'react'
import api from '../../services/api'
import { tablasConfig } from '../../config/tablasConfig' 
import logo from '../../images/logo_movi_bus.png' 
import './Auth.css' 

export default function Login({ onLoginSuccess, onIrARegistro }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const userMin = username.toLowerCase().trim()

      // 1. Cargamos personas desde su nuevo endpoint asignado en tablasConfig y los roles correspondientes
      const [resPersonas, resAdmins, resConductores, resPasajeros] = await Promise.all([
        api.get(`/${tablasConfig.personas.endpoint}`).catch(() => ({ data: [] })),
        api.get(`/${tablasConfig.administradores.endpoint}`).catch(() => ({ data: [] })),
        api.get(`/${tablasConfig.conductores.endpoint}`).catch(() => ({ data: [] })),
        api.get(`/${tablasConfig.pasajeros.endpoint}`).catch(() => ({ data: [] }))
      ])

      const personasRaw = Array.isArray(resPersonas.data) ? resPersonas.data : []
      const adminsRaw = Array.isArray(resAdmins.data) ? resAdmins.data : []
      const conductoresRaw = Array.isArray(resConductores.data) ? resConductores.data : []
      const pasajerosRaw = Array.isArray(resPasajeros.data) ? resPasajeros.data : []

      // 2. BUSCAMOS LAS CREDENCIALES EN LA DATA MADRE DE PERSONAS
      const personaMatch = personasRaw.find(p => {
        const u = (p.username || '').toLowerCase()
        const pass = p.password || ''
        return u === userMin && pass === password
      })

      if (!personaMatch) {
        throw new Error('Credenciales incorrectas. Inténtalo de nuevo.')
      }

      // 3. CON EL ID RECONOCIDO (EJ: 1001), DETERMINAMOS SU ROL
      const matchId = personaMatch.id
      let rolAsignado = ''
      
      const esAdmin = adminsRaw.some(adm => adm.id === matchId)
      const esConductor = conductoresRaw.some(c => c.id === matchId)
      const esPasajero = pasajerosRaw.some(p => p.id === matchId)

      if (esAdmin) {
        rolAsignado = 'ADMIN'
      } else if (esConductor) {
        rolAsignado = 'CONDUCTOR'
      } else if (esPasajero) {
        rolAsignado = 'PASAJERO'
      } else {
        throw new Error('Usuario válido pero no cuenta con un rol activo en MoviBus.')
      }

      // 4. MOCKUP DE INICIO DE SESIÓN UNIFICADO
      const nombreCompleto = `${personaMatch.primerNombre || ''} ${personaMatch.primerApellido || ''}`.trim()

      const mockupUser = {
        id: matchId,
        username: personaMatch.username,
        nombre: nombreCompleto || personaMatch.username,
        rol: rolAsignado
      }

      localStorage.setItem('user_movibus', JSON.stringify(mockupUser))
      onLoginSuccess(mockupUser)

    } catch (err) {
      setError(err.message || 'Error de comunicación con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-desktop-wrapper">
      <div className="auth-brand-side">
        <div className="brand-overlay-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <img 
            src={logo} 
            alt="MoviBus Logo" 
            className="brand-desktop-logo" 
            style={{ width: '420px', height: 'auto', marginBottom: '25px' }} 
          />
          <h1 className="brand-desktop-title" style={{ margin: '0 0 10px 0' }}>MoviBus</h1>
          <p className="brand-desktop-tagline" style={{ margin: '0', textAlign: 'center' }}>Tu viaje, tu control. Rápido, seguro y confiable.</p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card-desktop">
          <h2 className="auth-card-title">Iniciar sesión</h2>
          
          {error && <div className="auth-error-msg">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form-element">
            <div className="auth-input-group">
              <label>Username</label>
              <div className="input-with-icon">
                <span className="input-icon">👤</span>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="Ej: seniorw o carlos_cond" 
                  disabled={loading}
                  required 
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <div className="input-with-icon">
                <span className="input-icon">🔒</span>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="•••••" 
                  disabled={loading}
                  required 
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Validando accesos...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="auth-footer-text">
            ¿No tiene cuenta? <strong onClick={onIrARegistro}>Registrarse</strong>
          </p>
        </div>
      </div>
    </div>
  )
}