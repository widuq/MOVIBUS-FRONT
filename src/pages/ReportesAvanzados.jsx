import { useState } from 'react'

export default function ReportesAvanzados() {
  const [reporte, setReporte] = useState('')
  const [cargando, setCargando] = useState(false)
  const [datos, setDatos] = useState([])

  const manejarGenerar = () => {
    if (!reporte) return alert('Seleccione un análisis analítico avanzado')
    setCargando(true)

    setTimeout(() => {
      if (reporte === 'combustible_avg') {
        setDatos([
          { placa: 'WTM123', total_gasto: '$1,450,000', promedio_flota: '$1,100,000', sobrecosto: '+$350,000' },
          { placa: 'XYZ999', total_gasto: '$1,280,000', promedio_flota: '$1,100,000', sobrecosto: '+$180,000' },
        ])
      } else if (reporte === 'rutas_criticas') {
        setDatos([
          { ruta: 'Terminal-Uniquindío', total_viajes: 120, incidentes_reportados: 14, porcentaje_riesgo: '11.6%' },
        ])
      }
      setCargando(false)
    }, 800)
  }

  return (
    <div className="tabla-page">
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
          
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Métricas Analíticas y Alertas Gerenciales:</label>
            <select 
              className="input-busqueda-rapida" 
              style={{ width: '100%', height: '40px', padding: '0 10px' }}
              value={reporte}
              onChange={(e) => { setReporte(e.target.value); setDatos([]); }}
            >
              <option value="">-- Seleccionar --</option>
              <option value="combustible_avg">Vehículos con Consumo de Combustible Superior al Promedio General</option>
              <option value="rutas_criticas">Análisis de Rutas Críticas con Alto Índice de Riesgo/Incidentes</option>
            </select>
          </div>

          <button className="btn-busqueda" style={{ height: '40px', background: '#1976d2' }} onClick={manejarGenerar}>
            {cargando ? 'Analizando...' : '🚀 Ejecutar Análisis CMI'}
          </button>
        </div>
      </div>

      {datos.length > 0 && (
        <>
          {/* Tarjetas KPI emulando indicadores gráficos avanzados */}
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <div style={{ flex: 1, background: '#ffebee', borderLeft: '5px solid #ef5350', padding: '15px', borderRadius: '4px' }}>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#c62828', fontWeight: 'bold' }}>Alertas Críticas</span>
              <h4 style={{ margin: '5px 0 0 0', fontSize: '24px', color: '#c62828' }}>{datos.length} Unidades</h4>
            </div>
            <div style={{ flex: 1, background: '#e3f2fd', borderLeft: '5px solid #2196f3', padding: '15px', borderRadius: '4px' }}>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#0d47a1', fontWeight: 'bold' }}>Impacto Presupuestal</span>
              <h4 style={{ margin: '5px 0 0 0', fontSize: '24px', color: '#0d47a1' }}>Alto</h4>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <button className="btn-crear" style={{ background: '#d32f2f' }} onClick={() => alert('Exportando PDF de Análisis Gerencial...')}>
              👑 Exportar Reporte Ejecutivo (PDF)
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
                      <td key={i} style={{ padding: '12px 15px', fontSize: '14px' }}>
                        {i === 3 && reporte === 'combustible_avg' ? (
                          <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>{val}</span>
                        ) : val}
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