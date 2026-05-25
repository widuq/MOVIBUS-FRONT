import { useState } from 'react'

export default function Reportes() {
  const [reporte, setReporte] = useState('')
  const [cargando, setCargando] = useState(false)
  const [datos, setDatos] = useState([])
  const [exportando, setExportando] = useState(false)

  // URL base para obtener las tablas en JSON (Ajusta si esta ruta cambia en tu otro Controller)
  const API_JSON_URL = 'http://localhost:8080/reportes/consultas'
  
  // URL base EXACTA de tu ReporteExportController
  const API_EXPORT_URL = 'http://localhost:8080/reportes/exportar'

  // Función para renderizar la tabla JSON en la interfaz
  const manejarGenerar = async () => {
    if (!reporte) return alert('Por favor, seleccione un reporte primero')
    
    setCargando(true)
    setDatos([]) 

    try {
      // Nota: Asegúrate de que tu controlador de JSON use estas mismas rutas de recurso
      const respuesta = await fetch(`${API_JSON_URL}/${reporte}`)
      
      if (!respuesta.ok) {
        throw new Error(`Error en el servidor: ${respuesta.status}`)
      }

      const resultado = await respuesta.json()
      
      if (resultado.length === 0) {
        alert('No se encontraron datos para este reporte.')
      } else {
        setDatos(resultado)
      }

    } catch (error) {
      console.error("Error al traer el reporte:", error)
      alert(`Hubo un error al obtener los datos: ${error.message}`)
    } finally {
      setCargando(false)
    }
  }

  // FUNCIÓN MAESTRA: Descarga archivos binarios (PDF, Excel, Word) conectada a tu Back
  const manejarExportarDocumento = async (formato) => {
    if (!reporte) return

    setExportando(true)

    try {
      // Construye la URL exacta según tu Back, ej: http://localhost:8080/reportes/exportar/viajes/pdf
      const endpointExportacion = `${API_EXPORT_URL}/${reporte}/${formato}`

      const respuesta = await fetch(endpointExportacion, {
        method: 'GET'
        // Si manejas seguridad por Token, descomenta la línea de abajo:
        // headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })

      if (!respuesta.ok) {
        throw new Error(`Error en la generación. Código de estado: ${respuesta.status}`)
      }

      // Capturar los bytes puros devueltos por el ResponseEntity del backend
      const blob = await respuesta.blob()

      // Crear URL de mapeo temporal del navegador
      const urlTemporal = window.URL.createObjectURL(blob)

      // Definir la extensión correcta del archivo según lo configurado en tu switch de Java
      let extension = '.pdf'
      if (formato === 'excel') extension = '.xlsx'
      if (formato === 'word') extension = '.docx'

      // Crear el disparador de descarga automática
      const link = document.createElement('a')
      link.href = urlTemporal
      link.setAttribute('download', `reporte_${reporte.replace('-', '_')}_${new Date().toISOString().slice(0,10)}${extension}`)
      document.body.appendChild(link)
      
      link.click()
      
      // Limpieza profunda de memoria del DOM
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(urlTemporal)

    } catch (error) {
      console.error(`Error al exportar a ${formato}:`, error)
      alert(`Error al descargar el archivo ${formato.toUpperCase()}: ${error.message}`)
    } finally {
      setExportando(false)
    }
  }

  return (
    <div className="tabla-page">
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          
          <div style={{ flex: 1, minWidth: '250px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Seleccione el Reporte:</label>
            <select 
              className="input-busqueda-rapida" 
              style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '4px', border: '1px solid #ccc' }}
              value={reporte}
              onChange={(e) => { setReporte(e.target.value); setDatos([]); }}
            >
              <option value="">-- Seleccionar --</option>
              <optgroup label="Fáciles">
                <option value="viajes">F1: Listado de Viajes (Estados y Valores)</option>
                <option value="incidentes">F2: Historial de Incidentes Operativos</option>
                <option value="vehiculos">F3: Listado de Vehículos del Sistema</option>
              </optgroup>
              <optgroup label="Medios">
                <option value="conductores-recorridos">F4: Historial de Conductores y Recorridos</option>
                <option value="pasajeros-viajes">F5: Reporte de Pasajeros y sus Viajes</option>
                <option value="rutas-completas">F6: Monitoreo de Rutas Completas</option>
                <option value="facturas-detalladas">F7: Auditoría de Facturas Detalladas</option>
              </optgroup>
              <optgroup label="Difíciles">
                <option value="pasajeros-gasto-superior">F8: Pasajeros Gasto Superior al Promedio</option>
                <option value="conductores-en-curso">F9: Conductores con Recorridos en Curso</option>
                <option value="rutas-incidentes-pendientes">F10: Rutas con Incidentes sin Resolver</option>
              </optgroup>
            </select>
          </div>

          <button className="btn-busqueda" style={{ height: '40px', padding: '0 20px', background: '#1565C0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={manejarGenerar} disabled={cargando}>
            {cargando ? '⌛ Cargando...' : '🔍 Generar Reporte'}
          </button>
        </div>
      </div>

      {datos.length > 0 && (
        <>
          {/* Fila de acciones con los tres botones que tu Backend soporta */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '12px' }}>
            <button 
              style={{ background: exportando ? '#9e9e9e' : '#d32f2f', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: exportando ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 'bold' }} 
              onClick={() => manejarExportarDocumento('pdf')}
              disabled={exportando}
            >
              📄 PDF
            </button>
            <button 
              style={{ background: exportando ? '#9e9e9e' : '#2e7d32', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: exportando ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 'bold' }} 
              onClick={() => manejarExportarDocumento('excel')}
              disabled={exportando}
            >
              🟢 Excel
            </button>
            <button 
              style={{ background: exportando ? '#9e9e9e' : '#1565c0', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: exportando ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 'bold' }} 
              onClick={() => manejarExportarDocumento('word')}
              disabled={exportando}
            >
              🔵 Word
            </button>
          </div>

          <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: '#1565C0', color: '#fff' }}>
                <tr>
                  {Object.keys(datos[0]).map((col) => (
                    <th key={col} style={{ padding: '12px 15px', textTransform: 'uppercase', fontSize: '12px' }}>
                      {col.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datos.map((fila, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee', background: index % 2 === 0 ? '#ffffff' : '#f8f9fa' }}>
                    {Object.values(fila).map((val, i) => (
                      <td key={i} style={{ padding: '12px 15px', fontSize: '14px' }}>
                        {val !== null ? val.toString() : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}