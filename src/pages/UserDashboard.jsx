//import './UserDashboard.css' // Agrega estilos específicos para los usuarios si lo deseas

export default function UserDashboard({ usuario, onLogout }) {
  return (
    <div className="user-layout">
      <header className="user-header">
        <h2>MoviBus — Panel de {usuario.rol}</h2>
        <div className="user-actions">
          <span>Bienvenido, <strong>{usuario.nombre} {usuario.apellido}</strong></span>
          <button className="btn-secundario" onClick={onLogout}>Cerrar Sesión</button>
        </div>
      </header>

      <main className="user-main-content">
        <div className="welcome-card">
          <h3>¡Hola, {usuario.username}!</h3>
          <p>Desde aquí podrás revisar tus viajes disponibles, trayectos asignados e información personal de tu cuenta.</p>
        </div>

        {/* Aquí puedes meter tarjetas informativas o llamadas a endpoints para el usuario */}
        <div className="user-grid-info">
          <div className="info-box">
            <h4>Próximos Viajes</h4>
            <p>No tienes rutas programadas para hoy.</p>
          </div>
          <div className="info-box">
            <h4>Mi Perfil</h4>
            <p>ID de Cuenta: {usuario.id}</p>
            <p>Nombre de Usuario: {usuario.username}</p>
          </div>
        </div>
      </main>
    </div>
  )
}