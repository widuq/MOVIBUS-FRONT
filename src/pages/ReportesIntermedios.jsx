import { useState } from 'react'

export default function ReportesIntermedios() {
  const [reporte, setReporte] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [cargando, setCargando] = useState(false)
  const [datos, setDatos] = useState([])

  const manejarGenerar = () => {
    if (!reporte || !fechaInicio || !fechaFin) {
      return alert('Por favor complete todos los filtros y el rango de fechas')
    }
    setCargando(true)

    setTimeout(() => {
      if (reporte === 'recaudo') {
        setDatos([
          { ruta: 'Ruta Norte-Centro', total_viajes: 45, recaudado: '$180,000' },
          { ruta: 'Terminal-Uniquindío', total_viajes: 68, recaudado: '$272,000' },
          { ruta: 'Ruta Sur-Sena', total_viajes: 32, recaudado: '$112,000' },
        ])
      } else if (reporte === 'combustible') {
        setDatos([
          { placa: 'WTM123', viajes_realizados: 22, galones_consumidos: 110, total_gasto: '$1,320,000' },
          { placa: 'TRK456', viajes_realizados: 18, galones_consumidos: 95, total_gasto: '$1,140,000' },
        ])
      } else if (reporte === 'incidentes_bus') {
        setDatos([
          { placa: 'WTM123', conductor_principal: 'Carlos Mendoza', total_incidentes: 3 },
          { placa: 'XYZ789', conductor_principal: 'Marcos López', total_incidentes: 1 },
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
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Seleccione el Reporte Agrupado:</label>
            <select 
              className="input-busqueda-rapida" 
              style={{ width: '100%', height: '40px', padding: '0 10px' }}
              value={reporte}
              onChange={(e) => { setReporte(e.target.value); setDatos([]); }}
            >
              <option value="">-- Seleccionar --</option>
              <option value="recaudo">Recaudación e Ingresos Totales por Ruta</option>
              <option value="combustible">Consumo Financiero de Combustible por Vehículo</option>
              <option value="incidentes_bus">Métricas de Frecuencia de Incidentes por Autobús</option>
            </select>
          </div>

          <div style={{ width: '160px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Desde:</label>
            <input 
              type="date" 
              className="input-busqueda-rapida" 
              style={{ width: '100%', height: '40px', padding: '0 10px' }} 
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>

          <div style={{ width: '160px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Hasta:</label>
            <input 
              type="date" 
              className="input-busqueda-rapida" 
              style={{ width: '100%', height: '40px', padding: '0 10px' }} 
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>

          <button className="btn-busqueda" style={{ height: '40px' }} onClick={manejarGenerar}>
            {cargando ? 'Procesando...' : '📈 Consolidar Datos'}
          </button>
        </div>
      </div>

      {datos.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>Mostrando métricas calculadas del rango seleccionado</span>
            <button className="btn-crear" style={{ background: '#d32f2f' }} onClick={() => alert('Generando PDF...')}>
              📄 Exportar a PDF
            </button>
          </div>

          <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: '#b75252', color: '#fff' }}>
                <tr>
                  {Object.keys(datos[0]).map((col) => (
                    <th key={col} style={{ padding: '12px 15px', textTransform: 'uppercase', fontSize: '12px' }}>{col.replace('_', ' ')}</th>
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