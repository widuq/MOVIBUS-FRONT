import { useState } from 'react'
// Ajuste de rutas correcto desde la carpeta pages
import Sidebar from '../components/Sidebar'
import TablaPage from './TablaPage'
import { tablasConfig, listaTablas } from '../config/tablasConfig'
import '../App.css'
import Reportes from './Reportes' // Import único del componente unificado

export default function AdminDashboard({ usuario, onLogout }) {
  const [tablaActiva, setTablaActiva] = useState(listaTablas[0].key)

  // 1. Lógica condicional para renderizar el cuerpo de la aplicación sin romperla
  const renderContenido = () => {
    switch (tablaActiva) {
      case 'reportes':
        return <Reportes />
      default:
        // Si no es el panel de reportes, busca la configuración del CRUD original
        const configTabla = tablasConfig[tablaActiva]
        return <TablaPage key={tablaActiva} configTabla={configTabla} />
    }
  }

  // 2. Lógica condicional para renderizar el encabezado dinámicamente
  const renderHeader = () => {
    if (tablaActiva === 'reportes') {
      return (
        <>
          <h1 className="app-titulo">Reportes del Sistema</h1>
          <span className="app-subtitulo">/reportes</span>
        </>
      )
    }

    // Header original por defecto usando la configuración del CRUD (con el operador ?. por seguridad)
    const configOriginal = tablasConfig[tablaActiva]
    return (
      <>
        <h1 className="app-titulo">{configOriginal?.label}</h1>
        <span className="app-subtitulo">/{configOriginal?.endpoint}</span>
      </>
    )
  }

  return (
    <div className="app-layout">
      <Sidebar tablaActiva={tablaActiva} onSeleccionar={setTablaActiva} />

      <main className="app-main">
        {/* Encabezado con soporte para títulos normales, reportes y el botón de cerrar sesión */}
        <div className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {renderHeader()}
          </div>
          
          {/* Botón de cerrar sesión integrado en el diseño de escritorio */}
          <div style={{ marginRight: '20px', color: '#333', fontSize: '0.95rem' }}>
            <span>Admin: <b>{usuario?.username}</b></span>
            <button 
              onClick={onLogout} 
              style={{ marginLeft: '15px', padding: '6px 12px', cursor: 'pointer', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Cuerpo dinámico: alterna automáticamente entre Tablas CRUD y las páginas de Reportes */}
        <div className="app-content-body">
          {renderContenido()}
        </div>
      </main>
    </div>
  )
}