import { useState } from "react";
import { 
  Heart, 
  History, 
  Search, 
  Percent, 
  Bell, 
  User, 
  Map, 
  Settings, 
  LogOut, 
  Globe, 
  ShieldCheck 
} from "lucide-react";
import "./UserDashboard.css";
import mapaImg from "../images/mapa.png"; // Una sola vez

export default function UserDashboard({ usuario, onLogout }) {
  // Estados para manejar las vistas en la sección derecha
  const [vistaActiva, setVistaActiva] = useState('inicio'); // 'inicio', 'perfil', 'configuracion'

  return (
    <div className="movibus-web-layout">
      
      {/* --- SIDEBAR IZQUIERDO (RECREACIÓN DEL MENÚ MÓVIL) --- */}
      <aside className="movibus-sidebar">
        
        {/* Cabecera del Usuario (Estilo Móvil) */}
        <div className="sidebar-user-header">
          <div className="avatar-container">
            <User className="avatar-icon" />
          </div>
          <div className="user-tag">
            <span>{usuario.nombre}</span>
          </div>
        </div>

        {/* Banner Rojo "Menú Principal" */}
        <div className="sidebar-menu-banner">
          <h3>Menú Principal</h3>
          <div className="mini-logo-placeholder">🚌</div>
        </div>

        {/* Opciones del Menú Azul */}
        <nav className="sidebar-nav-links">
          <button className="nav-item-btn">
            <Heart className="nav-icon" /> <span>Rutas favoritas</span> <span className="arrow">›</span>
          </button>
          <button className="nav-item-btn">
            <History className="nav-icon" /> <span>Historial de rutas</span> <span className="arrow">›</span>
          </button>
          <button className="nav-item-btn">
            <Search className="nav-icon" /> <span>Buscar ruta</span> <span className="arrow">›</span>
          </button>
          <button className="nav-item-btn">
            <Percent className="nav-icon" /> <span>Rutas disponibles</span> <span className="arrow">›</span>
          </button>
          <button className="nav-item-btn">
            <Bell className="nav-icon" /> <span>Notificaciones</span> <span className="arrow">›</span>
          </button>
        </nav>

        {/* Barra de Navegación Inferior (Tabs de control) */}
        <footer className="sidebar-footer-tabs">
          <button 
            className={`tab-btn ${vistaActiva === 'perfil' ? 'active' : ''}`}
            onClick={() => setVistaActiva('perfil')}
            title="Mi Perfil"
          >
            <User size={28} />
          </button>
          
          <button 
            className={`tab-btn central-map-btn ${vistaActiva === 'inicio' ? 'active' : ''}`}
            onClick={() => setVistaActiva('inicio')}
            title="Ver Mapa / Inicio"
          >
            <Map size={24} />
          </button>
          
          <button 
            className={`tab-btn ${vistaActiva === 'configuracion' ? 'active' : ''}`}
            onClick={() => setVistaActiva('configuracion')}
            title="Configuración"
          >
            <Settings size={28} />
          </button>
        </footer>
      </aside>

      {/* --- CONTENIDO PRINCIPAL (MAPA DE FONDO + TARJETAS DINÁMICAS) --- */}
      <main className="movibus-main-content" style={{ backgroundImage: `url(${mapaImg})` }}>
        <div className="map-overlay-container">
          
          {/* VISTA 1: INICIO (Bienvenida y Próximos Viajes) */}
          {vistaActiva === 'inicio' && (
            <div className="glass-panel welcome-panel">
              <h2>MoviBus — Panel de {usuario.rol}</h2>
              <div className="welcome-card">
                <h3>¡Hola, {usuario.username}!</h3>
                <p>Desde aquí podrás revisar tus viajes disponibles, trayectos asignados e información personal de tu cuenta.</p>
              </div>
              <div className="info-box mt-4">
                <h4>Próximos Viajes</h4>
                <p className="no-routes">No tienes rutas programadas para hoy.</p>
              </div>
            </div>
          )}

          {/* VISTA 2: MI PERFIL (Activado desde el muñequito abajo) */}
          {vistaActiva === 'perfil' && (
            <div className="glass-panel profile-panel">
              <h2>Mi Perfil</h2>
              <div className="profile-details">
                <div className="profile-avatar-large">
                  <User size={50} />
                </div>
                <div className="info-box">
                  <h4>Información de la Cuenta</h4>
                  <p><strong>Nombre Completo:</strong> {usuario.nombre} {usuario.apellido}</p>
                  <p><strong>ID de Cuenta:</strong> {usuario.id}</p>
                  <p><strong>Nombre de Usuario:</strong> {usuario.username}</p>
                </div>
              </div>
            </div>
          )}

          {/* VISTA 3: CONFIGURACIÓN (Activado desde la tuerca abajo) */}
          {vistaActiva === 'configuracion' && (
            <div className="glass-panel settings-panel">
              <div className="settings-banner-header">
                <h3>Configuración</h3>
                <span>🚌</span>
              </div>
              
              <div className="settings-options-list">
                <div className="settings-item">
                  <Bell size={20} className="text-red" />
                  <span>Notificaciones: Activas</span>
                </div>
                <div className="settings-item">
                  <Globe size={20} className="text-red" />
                  <span>Idioma: Español</span>
                </div>
                <div className="settings-item">
                  <ShieldCheck size={20} className="text-red" />
                  <span>Política de tratamiento de datos</span>
                </div>
                
                {/* Botón de Cerrar Sesión solicitado */}
                <button className="settings-item btn-logout-action" onClick={onLogout}>
                  <LogOut size={20} />
                  <strong>Cerrar Sesión</strong>
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}