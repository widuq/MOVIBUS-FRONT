import { useState } from 'react'
// Ajuste de rutas correcto desde la carpeta pages
import Sidebar from '../components/Sidebar'
import TablaPage from './TablaPage'
import { tablasConfig, listaTablas } from '../config/tablasConfig'
import '../App.css'
import ReportesSimples from './ReportesSimples'
import ReportesIntermedios from './ReportesIntermedios'
import ReportesAvanzados from './ReportesAvanzados'

export default function AdminDashboard({ usuario, onLogout }) {
  const [tablaActiva, setTablaActiva] = useState(listaTablas[0].key)

  // 1. Lógica condicional para renderizar el cuerpo de la aplicación sin romperla
  const renderContenido = () => {
    switch (tablaActiva) {
      case 'reporte-simple':
        return <ReportesSimples />
      case 'reporte-intermedio':
        return <ReportesIntermedios />
      case 'reporte-avanzado':
        return <ReportesAvanzados />
      default:
        // Si no es un reporte, busca de manera segura la configuración del CRUD original
        const configTabla = tablasConfig[tablaActiva]
        return <TablaPage key={tablaActiva} configTabla={configTabla} />
    }
  }

  // 2. Lógica condicional para renderizar el encabezado dinámicamente
  const renderHeader = () => {
    if (tablaActiva === 'reporte-simple') {
      return (
        <>
          <h1 className="app-titulo">Reportes Simples</h1>
          <span className="app-subtitulo">/reportes/simples</span>
        </>
      )
    }
    if (tablaActiva === 'reporte-intermedio') {
      return (
        <>
          <h1 className="app-titulo">Reportes Intermedios</h1>
          <span className="app-subtitulo">/reportes/intermedios</span>
        </>
      )
    }
    if (tablaActiva === 'reporte-avanzado') {
      return (
        <>
          <h1 className="app-titulo">Reportes Avanzados</h1>
          <span className="app-subtitulo">/reportes/avanzados</span>
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