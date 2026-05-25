import { useState } from 'react'
import { listaTablas } from '../config/tablasConfig'
import './Sidebar.css'
import logo from '../images/logo_movi_bus.png'
import logoTexto from '../images/moviBus.png'

export default function Sidebar({ tablaActiva, onSeleccionar }) {
  // Estados para controlar qué secciones están desplegadas
  const [menuAbierto, setMenuAbierto] = useState({
    tablas: true,      // Abierto por defecto
    consultas: false,
    reportes: false,
  })

  // Función para alternar (toggle) la visibilidad de una sección
  const toggleSeccion = (seccion) => {
    setMenuAbierto((prev) => ({
      ...prev,
      [seccion]: !prev[seccion],
    }))
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="MoviBus logo" className="sidebar-logo-img" />
        <img src={logoTexto} alt="MoviBus" className="sidebar-logo-texto" />
      </div>

      <nav className="sidebar-nav">
        {/* ================= SECCIÓN TABLAS ================= */}
        <div className="sidebar-section">
          <button 
            className={`sidebar-section-trigger ${menuAbierto.tablas ? 'abierto' : ''}`}
            onClick={() => toggleSeccion('tablas')}
          >
            <strong>TABLAS</strong>
            <span className="arrow">▼</span>
          </button>
          
          {menuAbierto.tablas && (
            <ul className="sidebar-dropdown-list">
              {listaTablas.map(({ key, label }) => (
                <li key={key}>
                  <button
                    className={`sidebar-item ${tablaActiva === key ? 'activo' : ''}`}
                    onClick={() => onSeleccionar(key)}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ================= SECCIÓN REPORTES ================= */}
        <div className="sidebar-section">
          <button 
            className={`sidebar-section-trigger ${menuAbierto.reportes ? 'abierto' : ''}`}
            onClick={() => toggleSeccion('reportes')}
          >
            <strong>REPORTES</strong>
            <span className="arrow">▼</span>
          </button>

          {menuAbierto.reportes && (
            <ul className="sidebar-dropdown-list">
              <li>
                <button 
                  className={`sidebar-item ${tablaActiva === 'reportes' ? 'activo' : ''}`}
                  onClick={() => onSeleccionar('reportes')}
                >
                  Generar Reportes
                </button>
              </li>
            </ul>
          )}
        </div>
        
      </nav>
    </aside>
  )
}