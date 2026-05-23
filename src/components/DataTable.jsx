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
              {columnas.map(col => {
                // 1. Validamos si la columna cuenta con una función para aplanar/formatear el texto
                const valorCelda = col.aplanar 
                  ? col.aplanar(fila) 
                  : fila[col.key];

                return (
                  <td key={col.key}>
                    {valorCelda !== undefined && valorCelda !== null
                      ? String(valorCelda)
                      : '—'}
                  </td>
                )
              })}
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