import './DataTable.css'

export default function DataTable({ columnas, filas, onEditar, onEliminar, cargando }) {

  if (cargando) return <div className="dt-estado">Cargando datos...</div>
  if (!filas || filas.length === 0) return <div className="dt-estado">Sin resultados.</div>

  return (
    <div className="dt-wrapper">
      <table className="dt-table">
        <thead>
          <tr>
            {columnas.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, i) => (
            <tr key={fila.id ?? i}>
              {columnas.map(col => (
                <td key={col.key}>
                  {fila[col.key] !== undefined && fila[col.key] !== null
                    ? String(fila[col.key])
                    : '—'}
                </td>
              ))}
              <td className="dt-acciones">
                <button className="btn-editar" onClick={() => onEditar(fila)}>Editar</button>
                <button className="btn-eliminar" onClick={() => onEliminar(fila)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}