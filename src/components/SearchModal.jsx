import './Modal.css'

// Solo muestra campos filtrables (tipo text, number, select) — no fechas
const TIPOS_FILTRABLES = ['text', 'number', 'select', undefined]

export default function SearchModal({ columnas, form, onChange, onBuscar, onCerrar }) {
  const colsFiltro = columnas.filter(c => TIPOS_FILTRABLES.includes(c.tipo))

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h2>🔍 Búsqueda avanzada</h2>
          <button className="modal-close" onClick={onCerrar}>✕</button>
        </div>

        <div className="modal-body">
          <p className="modal-hint">Completa solo los campos por los que quieres filtrar.</p>
          <div className="form-grid">
            {colsFiltro.map(col => (
              <div className="form-field" key={col.key}>
                <label>{col.label}</label>

                {col.tipo === 'select' ? (
                  <select name={col.key} value={form[col.key] ?? ''} onChange={onChange}>
                    <option value="">Todos</option>
                    {col.opciones?.map(op => (
                      <option key={op.value} value={op.value}>{op.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={col.tipo || 'text'}
                    name={col.key}
                    value={form[col.key] ?? ''}
                    onChange={onChange}
                    placeholder={`Filtrar por ${col.label.toLowerCase()}...`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secundario" onClick={onCerrar}>Cancelar</button>
          <button className="btn-primario" onClick={onBuscar}>Buscar</button>
        </div>

      </div>
    </div>
  )
}