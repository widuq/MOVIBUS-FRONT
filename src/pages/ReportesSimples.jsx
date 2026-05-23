import { useState } from 'react'

export default function ReportesSimples() {
  const [reporte, setReporte] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [cargando, setCargando] = useState(false)
  const [datos, setDatos] = useState([])

  const manejarGenerar = () => {
    if (!reporte) return alert('Por favor, seleccione un reporte primero')
    setCargando(true)
    
    // Simulación de respuesta de la API con datos ficticios de tus tablas
    setTimeout(() => {
      if (reporte === 'conductores') {
        setDatos([
          { id: 1, nombre: 'Carlos Mendoza', cedula: '1094001', telefono: '31245678', estado: filtroEstado === 'Todos' ? 'Activo' : filtroEstado },
          { id: 2, nombre: 'Juan Pérez', cedula: '1094002', telefono: '31578945', estado: filtroEstado === 'Todos' ? 'Inactivo' : filtroEstado },
        ])
      } else if (reporte === 'incidentes') {
        setDatos([
          { id: 101, vehiculo: 'WTM123', tipo: 'Falla Mecánica', fecha: '2026-05-10', descripcion: 'Recalentamiento de motor' },
          { id: 102, vehiculo: 'TRK456', tipo: 'Choque Leve', fecha: '2026-05-14', descripcion: 'Raspadura en parachoques trasero' },
        ])
      } else if (reporte === 'pasajeros') {
        setDatos([
          { id: 1003, nombre: 'Wilson Willy', correo: 'wilson@mail.com', telefono: '32198765', ciudad: 'Armenia' },
          { id: 1004, nombre: 'Ana María', correo: 'ana@mail.com', telefono: '30045612', ciudad: 'Circasia' },
        ])
      }
      setCargando(false)
    }, 800)
  }

  return (
    <div className="tabla-page">
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          
          <div style={{ flex: 1, minWidth: '250px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Seleccione el Reporte:</label>
            <select 
              className="input-busqueda-rapida" 
              style={{ width: '100%', height: '40px', padding: '0 10px' }}
              value={reporte}
              onChange={(e) => { setReporte(e.target.value); setDatos([]); }}
            >
              <option value="">-- Seleccionar --</option>
              <option value="conductores">Listado de Conductores por Estado</option>
              <option value="incidentes">Historial de Incidentes Operativos</option>
              <option value="pasajeros">Registro de Pasajeros del Sistema</option>
            </select>
          </div>

          {/* Filtro dinámico si selecciona Conductores */}
          {reporte === 'conductores' && (
            <div style={{ width: '200px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Filtrar Estado:</label>
              <select 
                className="input-busqueda-rapida" 
                style={{ width: '100%', height: '40px', padding: '0 10px' }}
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="Todos">Todos</option>
                <option value="Activo">Activos</option>
                <option value="Inactivo">Inactivos</option>
              </select>
            </div>
          )}

          <button className="btn-busqueda" style={{ height: '40px' }} onClick={manejarGenerar}>
            {cargando ? 'Cargando...' : '🔍 Generar Reporte'}
          </button>
        </div>
      </div>

      {datos.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <button className="btn-crear" style={{ background: '#d32f2f' }} onClick={() => alert('Generando PDF...')}>
              📄 Exportar a PDF
            </button>
          </div>

          <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: '#b75252', color: '#fff' }}>
                <tr>
                  {Object.keys(datos[0]).map((col) => (
                    <th key={col} style={{ padding: '12px 15px', textTransform: 'uppercase', fontSize: '12px' }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datos.map((fila, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    {Object.values(fila).map((val, i) => (
                      <td key={i} style={{ padding: '12px 15px', fontSize: '14px' }}>{val}</td>
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