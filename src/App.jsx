import { useState } from 'react'
import Sidebar from './components/Sidebar'
import TablaPage from './pages/TablaPage'
import { tablasConfig, listaTablas } from './config/tablasConfig'
import './App.css'

export default function App() {
  const [tablaActiva, setTablaActiva] = useState(listaTablas[0].key)

  const config = tablasConfig[tablaActiva]

  return (
    <div className="app-layout">
      <Sidebar tablaActiva={tablaActiva} onSeleccionar={setTablaActiva} />

      <main className="app-main">
        <div className="app-header">
          <h1 className="app-titulo">{config.label}</h1>
          <span className="app-subtitulo">/{config.endpoint}</span>
        </div>

        {/* key={tablaActiva} fuerza re-mount al cambiar tabla */}
        <TablaPage key={tablaActiva} configTabla={config} />
      </main>
    </div>
  )
}