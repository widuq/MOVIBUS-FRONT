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

const ENDPOINTS_SELECTS = {
  codigo_marca: { url: '/marcas', propId: 'codigo', propLabel: 'nombre' },
  codigo_estado_vehiculo: { url: '/estados-vehiculo', propId: 'codigo', propLabel: 'nombre' },
  codigo_tipo_combustible: { url: '/tipos-combustible', propId: 'codigo', propLabel: 'nombre' },
};

export default function TablaPage({ configTabla }) {
  const { endpoint, columnas: columnasOriginales = [], pk, normalizar, desnormalizar } = configTabla

  const [columnasDinamicas, setColumnasDinamicas] = useState(columnasOriginales)
  const [filasRaw, setFilasRaw] = useState([]) // 👈 NUEVO: Guardamos los datos puros del backend separados
  const [cargando, setCargando] = useState(true)
  const [modal, setModal] = useState(null)
  const [formCrud, setFormCrud] = useState({})

  const [formBusqueda, setFormBusqueda] = useState(formVacio(columnasOriginales))
  const [filtrosActivos, setFiltrosActivos] = useState(false)
  const [busquedaRapida, setBusquedaRapida] = useState('')

  // 1. Efecto dedicado exclusivamente a cargar los catálogos del select
  useEffect(() => {
    let activo = true;

    const cargarCatalogosVehiculos = async () => {
      if (endpoint !== 'vehiculos') {
        setColumnasDinamicas(columnasOriginales);
        return;
      }

      try {
        const selectsAFiltrar = columnasOriginales.filter(c => c.tipo === 'select');
        
        const promesas = selectsAFiltrar.map(col => {
          const conf = ENDPOINTS_SELECTS[col.key];
          if (!conf) return Promise.resolve(null);
          
          return api.get(conf.url).then(res => ({
            key: col.key,
            opciones: (Array.isArray(res.data) ? res.data : []).map(item => ({
              value: Number(item[conf.propId] || item.id),
              label: item[conf.propLabel] || item.descripcion || item.marca || item.estado || item.tipo
            }))
          })).catch(() => null);
        });

        const resultados = await Promise.all(promesas);

        if (!activo) return;

        const columnasConDataReal = columnasOriginales.map(col => {
          const resMatch = resultados.find(r => r && r.key === col.key);
          if (resMatch) {
            return { ...col, opciones: resMatch.opciones };
          }
          return col;
        });

        setColumnasDinamicas(columnasConDataReal);
      } catch (err) {
        console.error("Error cargando los catálogos dinámicos:", err);
      }
    };

    cargarCatalogosVehiculos();

    return () => { activo = false; };
  }, [endpoint, columnasOriginales]);


  // 2. Cargar datos puros de la entidad sin procesar el "aplanado" con columnas dinámicas cambiantes
  const cargar = useCallback(async (silencioso = false) => {
    if (!silencioso) setCargando(true)
    try {
      const res = await api.get(`/${endpoint}`)
      let rawData = Array.isArray(res.data) ? res.data : []

      if (endpoint === 'administradores') {
        try {
          const resPersonas = await api.get('/personas')
          const personas = Array.isArray(resPersonas.data) ? resPersonas.data : []
          rawData = rawData.map(admin => {
            const personaMatch = personas.find(p => String(p.id) === String(admin.id))
            return {
              ...admin,
              persona: personaMatch ? {
                primerNombre: personaMatch.primerNombre,
                segundoNombre: personaMatch.segundoNombre,
                primerApellido: personaMatch.primerApellido,
                segundoApellido: personaMatch.segundoApellido,
                correo: personaMatch.correo,
                username: personaMatch.username,
                password: personaMatch.password,
                fechaNacimiento: personaMatch.fechaNacimiento,
                fechaRegistro: personaMatch.fechaRegistro,
                estado: personaMatch.estado,
                telefono: personaMatch.telefono ? { codigo: personaMatch.telefono.codigo ?? personaMatch.telefono } : undefined,
                documento: personaMatch.documento ? { codigo: personaMatch.documento.codigo ?? personaMatch.documento } : undefined
              } : null
            }
          })
        } catch (errPersona) {
          console.error("Error al cruzar personas en el frontend:", errPersona)
        }
      }

      const dataAdaptada = normalizar ? rawData.map(normalizar) : rawData
      setFilasRaw(dataAdaptada); // 👈 Guardamos la data adaptada limpia
    } catch (err) {
      console.error("Error al cargar:", err)
    } finally {
      if (!silencioso) setCargando(false)
    }
  }, [endpoint, normalizar]) // 👈 quitamos la dependencia problemática de columnasDinamicas


  useEffect(() => {
    cargar()
    if (modal !== null) return

    const intervalo = setInterval(() => {
      cargar(true)
    }, 5000)

    return () => clearInterval(intervalo)
  }, [cargar, modal])


  // 3. 🧠 LA CLAVE: El aplanado de filas se calcula dinámicamente en tiempo de renderizado
  // usando la última versión estable de columnasDinamicas.
  const filas = filasRaw.map(f => aplanarFila(f, columnasDinamicas));

  const manejarCambioInput = (e, setEstado) => {
    const { name, value } = e.target;
    setEstado(prev => ({ ...prev, [name]: value }));
  };

  const abrirCrear = () => {
    setFormCrud(formVacio(columnasDinamicas))
    setModal('crear')
  }

  const abrirEditar = (filaAplanada) => {
    const original = filas.find(f => String(f[pk]) === String(filaAplanada[pk]))
    const inicial = {}
    columnasDinamicas.forEach(c => {
      if (!c.key.startsWith('_')) inicial[c.key] = original[c.key] ?? ''
    })
    setFormCrud(inicial)
    setModal('editar')
  }

  const guardar = async () => {
    try {
      const payload = desnormalizar ? desnormalizar(formCrud) : formCrud;

      if (payload.persona) {
        const telefonoFrontend = formCrud.codigo_telefono ? String(formCrud.codigo_telefono) : '';
        const codigoTelefonoCalculado = payload.id
          ? Number(payload.id.toString().slice(-6))
          : Math.floor(100000 + Math.random() * 900000);

        const fechaActual = new Date().toISOString().split('T')[0];
        const payloadTelefono = { codigo: codigoTelefonoCalculado, numero: telefonoFrontend };

        const personaPayload = {
          id: Number(payload.id),
          primerNombre: payload.persona.primerNombre,
          segundoNombre: payload.persona.segundoNombre || '',
          primerApellido: payload.persona.primerApellido,
          segundoApellido: payload.persona.segundoApellido,
          correo: payload.persona.correo,
          email: payload.persona.correo,
          username: payload.persona.username,
          password: payload.persona.password || 'MoviBusAdmin2026*',
          fechaNacimiento: formCrud.fecha_nacimiento || fechaActual, 
          fechaRegistro: formCrud.fecha_registro || fechaActual,
          estado: Number(formCrud.estado || 1),
          codigoTelefono: codigoTelefonoCalculado,
          telefono: { codigo: codigoTelefonoCalculado },
          codigoDocumento: Number(formCrud.codigo_tipo_documento || 1),
          codigoTipoDocumento: Number(formCrud.codigo_tipo_documento || 1),
          documento: { codigo: Number(formCrud.codigo_tipo_documento || 1) }
        };

        if (modal === 'editar') {
          try { await api.put('/personas', personaPayload); } catch (errPersona) { console.warn(errPersona); }
        } else {
          try { await api.post('/telefonos', payloadTelefono); } catch (errTel) { console.warn(errTel); }
          try { await api.post('/personas', personaPayload); } catch (errPersona) { console.warn(errPersona); }
        }
      }

      if (modal === 'editar') {
        await api.put(`/${endpoint}`, payload);
      } else {
        await api.post(`/${endpoint}`, payload);
      }

      setModal(null);
      cargar();
    } catch (err) {
      console.error("❌ ERROR DEL BACKEND:", err.response?.data || err);
      alert(`Error: ${err.response?.data?.message || err.response?.data?.error || 'Verifica los campos obligatorios'}`);
    }
  };

  const eliminar = async (fila) => {
    if (!window.confirm(`¿Eliminar registro ${fila[pk]}?`)) return
    try {
      await api.delete(`/${endpoint}/${fila[pk]}`)
      cargar()
    } catch (err) { alert('Error al eliminar') }
  }

  let filasMostrar = filtrosActivos
    ? filas.filter(f => columnasDinamicas.every(col => {
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
        <button className="btn-busqueda" onClick={() => setModal('buscar')}>
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
        columnas={columnasDinamicas}
        filas={filasMostrar}
        onEditar={abrirEditar}
        onEliminar={eliminar}
        cargando={cargando}
      />

      {(modal === 'crear' || modal === 'editar') && (
        <CrudModal
          titulo={modal === 'editar' ? 'Editar Registro' : 'Nuevo Registro'}
          columnas={columnasDinamicas.filter(c => !c.key.startsWith('_'))}
          form={formCrud}
          onChange={e => manejarCambioInput(e, setFormCrud)}
          onGuardar={guardar}
          onCerrar={() => setModal(null)}
        />
      )}

      {modal === 'buscar' && (
        <SearchModal
          columnas={columnasDinamicas.filter(c => !c.key.startsWith('_'))}
          form={formBusqueda}
          onChange={e => manejarCambioInput(e, setFormBusqueda)}
          onBuscar={() => { setFiltrosActivos(true); setModal(null); }}
          onCerrar={() => setModal(null)}
        />
      )}
    </div>
  )
}