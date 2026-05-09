import './Modal.css'

export default function CrudModal({
  titulo,
  columnas,
  form,
  onChange,
  onGuardar,
  onCerrar
}) {
  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h2>{titulo}</h2>

          <button
            className="modal-close"
            onClick={onCerrar}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="form-grid">

            {columnas.map(col => (
              <div className="form-field" key={col.key}>

                <label>
                  {col.label}

                  {col.requerido && (
                    <span className="required"> *</span>
                  )}
                </label>

                {col.tipo === 'select' ? (

                  <select
                    name={col.key}
                    value={form[col.key] ?? ''}
                    onChange={onChange}
                    disabled={
                      col.soloLectura &&
                      titulo === 'Editar Registro'
                    }
                  >
                    <option value="">
                      — Selecciona —
                    </option>

                    {col.opciones?.map(op => (
                      <option
                        key={op.value}
                        value={op.value}
                      >
                        {op.label}
                      </option>
                    ))}
                  </select>

                ) : (

                  <input
                    type={col.tipo || 'text'}
                    name={col.key}
                    value={form[col.key] ?? ''}
                    onChange={onChange}
                    disabled={
                      col.soloLectura &&
                      titulo === 'Editar Registro'
                    }
                    placeholder={col.label}
                  />

                )}

              </div>
            ))}

          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn-secundario"
            onClick={onCerrar}
          >
            Cancelar
          </button>

          <button
            className="btn-primario"
            onClick={onGuardar}
          >
            Guardar
          </button>
        </div>

      </div>
    </div>
  )
}