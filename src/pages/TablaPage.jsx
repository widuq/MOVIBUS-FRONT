import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import DataTable from '../components/DataTable'
import CrudModal from '../components/CrudModal'
import SearchModal from '../components/SearchModal'
import './TablaPage.css'

function aplanarFila(fila, columnas) {
  const resultado = { ...fila }
  columnas.forEach(col => {
    if (col.aplanar) resultado[col.key] = col.aplanar(fila)
  })
  return resultado
}

function formVacio(columnas) {
  return Object.fromEntries(
    (columnas || []).filter(c => !c.key.startsWith('_')).map(c => [c.key, ''])
  )
}

export default function TablaPage({ configTabla }) {
  const { endpoint, columnas = [], pk, normalizar, desnormalizar } = configTabla

  const [filas, setFilas] = useState([]) 
  const [cargando, setCargando] = useState(true)
  const [modal, setModal] = useState(null)
  const [formCrud, setFormCrud] = useState({})
  
  const [formBusqueda, setFormBusqueda] = useState(formVacio(columnas))
  const [filtrosActivos, setFiltrosActivos] = useState(false)
  const [busquedaRapida, setBusquedaRapida] = useState('')

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const res = await api.get(`/${endpoint}`)
      const rawData = Array.isArray(res.data) ? res.data : []
      
      // 1. AQUI USAMOS SU NORMALIZAR MANUAL
      const dataAdaptada = normalizar ? rawData.map(normalizar) : rawData
      setFilas(dataAdaptada.map(f => aplanarFila(f, columnas)))
    } catch (err) {
      console.error("Error al cargar:", err)
    } finally {
      setCargando(false)
    }
  }, [endpoint, columnas, normalizar])

  useEffect(() => { cargar() }, [cargar])

  const manejarCambioInput = (e, setEstado) => {
    const { name, value } = e.target;
    setEstado(prev => ({ ...prev, [name]: value }));
  };

  const abrirCrear = () => {
    setFormCrud(formVacio(columnas))
    setModal('crear')
  }

  const abrirEditar = (filaAplanada) => {
    const original = filas.find(f => String(f[pk]) === String(filaAplanada[pk]))
    const inicial = {}
    columnas.forEach(c => {
      if (!c.key.startsWith('_')) inicial[c.key] = original[c.key] ?? ''
    })
    setFormCrud(inicial)
    setModal('editar')
  }

  /**
   * GUARDAR: El punto donde MoviBus recibe los datos.
   */
  const guardar = async () => {
    try {
      // 2. AQUI USAMOS SU DESNORMALIZAR MANUAL
      // Si no existe, enviamos el form tal cual (pero ya vimos que sí existe)
      const payload = desnormalizar ? desnormalizar(formCrud) : formCrud;

      console.log("🚀 PAYLOAD FINAL QUE VA AL SERVIDOR:", payload);

      if (modal === 'editar') {
        await api.put(`/${endpoint}`, payload);
      } else {
        await api.post(`/${endpoint}`, payload);
      }
      
      setModal(null);
      cargar();
    } catch (err) {
      // 3. LOG DE ERROR DETALLADO
      console.error("❌ ERROR DEL BACKEND:", err.response?.data || err);
      alert(`Error: ${err.response?.data?.message || 'Verifica los campos obligatorios'}`);
    }
  };

  const eliminar = async (fila) => {
    if (!window.confirm(`¿Eliminar registro ${fila[pk]}?`)) return
    try {
      await api.delete(`/${endpoint}/${fila[pk]}`)
      cargar()
    } catch (err) { alert('Error al eliminar') }
  }

  // Lógica de filtros (simplificada para el ejemplo)
  let filasMostrar = filtrosActivos 
    ? filas.filter(f => columnas.every(col => {
        const val = formBusqueda[col.key];
        return !val || String(f[col.key] ?? '').toLowerCase().includes(String(val).toLowerCase());
      }))
    : filas;

  if (busquedaRapida.trim()) {
    const q = busquedaRapida.toLowerCase()
    filasMostrar = filasMostrar.filter(f =>
      Object.values(f).some(v => String(v ?? '').toLowerCase().includes(q))
    )
  }

  return (
    <div className="tabla-page">
      <div className="tabla-toolbar">
          <button
            className="btn-busqueda"
            onClick={() => setModal('buscar')}
          >
            🔍 Búsqueda avanzada
          </button>
          <input
            className="input-busqueda-rapida"
            placeholder="Buscar en todo..."
            value={busquedaRapida}
            onChange={e => setBusquedaRapida(e.target.value)}
          />
          <button className="btn-crear" onClick={abrirCrear}>+ Nuevo</button>
      </div>

      <DataTable
        columnas={columnas}
        filas={filasMostrar}
        onEditar={abrirEditar}
        onEliminar={eliminar}
        cargando={cargando}
      />

      {(modal === 'crear' || modal === 'editar') && (
        <CrudModal
          titulo={modal === 'editar' ? 'Editar Registro' : 'Nuevo Registro'}
          columnas={columnas.filter(c => !c.key.startsWith('_'))}
          form={formCrud}
          onChange={e => manejarCambioInput(e, setFormCrud)}
          onGuardar={guardar}
          onCerrar={() => setModal(null)}
        />
      )}

      {modal === 'buscar' && (
        <SearchModal
          columnas={columnas.filter(c => !c.key.startsWith('_'))}
          form={formBusqueda}
          onChange={e => manejarCambioInput(e, setFormBusqueda)}
          onBuscar={() => { setFiltrosActivos(true); setModal(null); }}
          onCerrar={() => setModal(null)}
        />
      )}
    </div>
  )
}