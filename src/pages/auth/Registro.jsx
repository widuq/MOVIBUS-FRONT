import { useState } from 'react'
import logo from '../../images/logo_movi_bus.png'
import './Auth.css'

export default function Registro({ onVolverAlLogin }) {
  // Estado unificado con todos los campos requeridos por la base de datos
  const [formData, setFormData] = useState({
    id: '', // Cédula de la persona
    codigo_tipo_documento: '1', // 1: Cédula de Ciudadanía, 2: Tarjeta de Identidad
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    fecha_nacimiento: '',
    numero_telefono: '', // Se procesará para la tabla telefono antes de insertar la persona
    username: '',
    email: '',
    password: ''
  })

  const [step, setStep] = useState(1) // Control del flujo de pasos (1 de 3)
  const [mensaje, setMensaje] = useState('')
  const [errorValidacion, setErrorValidacion] = useState('')

  // Manejador de cambios en los inputs y selectores
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Funciones para navegar entre las pestañas de continuidad
  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  // Envío del formulario al Backend resolviendo dependencias de claves primarias
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorValidacion('')
    setMensaje('')

    // URL Base de tu API de Spring Boot
    const API_BASE = 'http://localhost:8080' 

    // 1. RESOLVER ID DEL TELÉFONO: Como no es autoincremental en Spring Boot,
    // extraemos un ID numérico único derivado del documento (los últimos 6 dígitos)
    // o generamos un número aleatorio controlado si la cédula es muy corta.
    const codigoTelefonoCalculado = formData.id 
      ? Number(formData.id.toString().slice(-6)) 
      : Math.floor(100000 + Math.random() * 900000);

    // 2. OBTENER FECHA ACTUAL: Formato YYYY-MM-DD requerido por PostgreSQL
    const fechaActual = new Date().toISOString().split('T')[0];

    // 3. ESTRUCTURAR CUERPOS DE PETICIÓN (Cumpliendo camelCase de tus entidades Java)
    const payloadTelefono = {
      codigo: codigoTelefonoCalculado,
      numero: formData.numero_telefono.toString()
    }

    const payloadPersona = {
      id: Number(formData.id),
      primerNombre: formData.primer_nombre,
      segundoNombre: formData.segundo_nombre || '',
      primerApellido: formData.primer_apellido,
      segundoApellido: formData.segundo_apellido,
      correo: formData.email, // Si en tu DTO se llama 'correo'
      email: formData.email,  // Si en tu DTO se llama 'email'
      username: formData.username,
      password: formData.password,
      fechaNacimiento: formData.fecha_nacimiento,
      fechaRegistro: fechaActual,
      estado: 1,

      // === ATRIBUTOS PARA EL TELÉFONO ===
      codigoTelefono: codigoTelefonoCalculado,
      telefono: {
        codigo: codigoTelefonoCalculado
      },

      // === ATRIBUTOS PARA EL TIPO DE DOCUMENTO (DTO COMPATIBLE) ===
      // Enviamos todas las variantes comunes para que Jackson mapee la correcta en el PersonaDTO
      codigoDocumento: Number(formData.codigo_tipo_documento),
      codigoTipoDocumento: Number(formData.codigo_tipo_documento),
      idDocumento: Number(formData.codigo_tipo_documento),
      documento: {
        codigo: Number(formData.codigo_tipo_documento)
      }
    }

    try {
      // PASO A: Insertar el número celular en la tabla 'telefono'
      const resTelefono = await fetch(`${API_BASE}/telefonos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadTelefono)
      });
      
      if (!resTelefono.ok) {
        const errorData = await resTelefono.json().catch(() => ({}));
        throw new Error(errorData.error || 'No se pudo registrar el número telefónico.');
      }

      // PASO B: Insertar la entidad 'persona' usando la llave externa del teléfono
      const resPersona = await fetch(`${API_BASE}/personas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadPersona)
      });

      if (!resPersona.ok) {
        const errorData = await resPersona.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al guardar la información de la persona.');
      }

      // ======================================================================
      // PASO C: Insertar en la tabla 'pasajero' ligando la cédula y valores por defecto (1)
      // ======================================================================
      const payloadPasajero = {
        id: Number(formData.id),          // La cédula como clave primaria/foránea compartida
        codigoMetodoPago: 1,              // Valor por defecto solicitado
        codigoTarifa: 1                   // Valor por defecto solicitado
      }

      const resPasajero = await fetch(`${API_BASE}/pasajeros`, { // Valida si el @RequestMapping del controlador de pasajeros es /pasajeros
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadPasajero)
      });

      if (!resPasajero.ok) {
        const errorData = await resPasajero.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al asignar el rol de pasajero a la cuenta.');
      }

      // Transacción completada con éxito total en el cliente de forma ordenada
      setMensaje('¡Cuenta de MoviBus creada con éxito! Redirigiendo...')
      setTimeout(() => {
        onVolverAlLogin()
      }, 2500)

    } catch (err) {
      setErrorValidacion(err.message || 'Hubo un error de conexión con el servidor.')
    }
  }

  return (
    <div className="auth-desktop-wrapper">
      {/* Panel Izquierdo: Identidad de Marca */}
      <div className="auth-brand-side">
        <div className="brand-overlay-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <img 
            src={logo} 
            alt="MoviBus Logo" 
            className="brand-desktop-logo" 
            style={{ width: '420px', height: 'auto', marginBottom: '25px' }} 
          />
          <h1 className="brand-desktop-title" style={{ margin: '0 0 10px 0' }}>MoviBus</h1>
          <p className="brand-desktop-tagline" style={{ margin: '0', textAlign: 'center' }}>Únete a nuestra red de rutas y optimiza tu transporte diario.</p>
        </div>
      </div>

      {/* Panel Derecho: Formulario Estilizado por Pasos */}
      <div className="auth-form-side">
        <div className="auth-card-desktop">
          <h2 className="auth-card-title">Crear cuenta (Paso {step} de 3)</h2>
          
          {mensaje && <div className="auth-success-msg">{mensaje}</div>}
          {errorValidacion && <div className="auth-error-msg" style={{ color: 'red', marginBottom: '15px', fontSize: '0.9rem' }}>{errorValidacion}</div>}

          <form onSubmit={handleSubmit} className="auth-form-element">
            
            {/* ================= PASO 1: IDENTIFICACIÓN Y NOMBRES ================= */}
            {step === 1 && (
              <>
                <div className="auth-input-group">
                  <label>Tipo de Documento</label>
                  <div className="input-with-icon">
                    <span className="input-icon">🪪</span>
                    <select 
                      name="codigo_tipo_documento" 
                      value={formData.codigo_tipo_documento} 
                      onChange={handleChange}
                    >
                      <option value="1">Cédula de Ciudadanía</option>
                      <option value="2">Tarjeta de Identidad</option>
                    </select>
                  </div>
                </div>

                <div className="auth-input-group">
                  <label>Número de Documento (Cédula)</label>
                  <div className="input-with-icon">
                    <span className="input-icon">🔢</span>
                    <input 
                      type="text" 
                      name="id" 
                      onChange={handleChange} 
                      value={formData.id} 
                      placeholder="Ingrese su número de documento" 
                      required 
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label>Primer Nombre</label>
                  <div className="input-with-icon">
                    <span className="input-icon">👤</span>
                    <input 
                      type="text" 
                      name="primer_nombre" 
                      onChange={handleChange} 
                      value={formData.primer_nombre} 
                      placeholder="Ej: Wilson" 
                      required 
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label>Segundo Nombre (Opcional)</label>
                  <div className="input-with-icon">
                    <span className="input-icon">👤</span>
                    <input 
                      type="text" 
                      name="segundo_nombre" 
                      onChange={handleChange} 
                      value={formData.segundo_nombre} 
                      placeholder="Ej: Andrés" 
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label>Primer Apellido</label>
                  <div className="input-with-icon">
                    <span className="input-icon">👤</span>
                    <input 
                      type="text" 
                      name="primer_apellido" 
                      onChange={handleChange} 
                      value={formData.primer_apellido} 
                      placeholder="Ej: Delgado" 
                      required 
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label>Segundo Apellido</label>
                  <div className="input-with-icon">
                    <span className="input-icon">👤</span>
                    <input 
                      type="text" 
                      name="segundo_apellido" 
                      onChange={handleChange} 
                      value={formData.segundo_apellido} 
                      placeholder="Ej: Viveros" 
                      required 
                    />
                  </div>
                </div>

                <button type="button" className="auth-submit-btn" onClick={nextStep}>Siguiente</button>
              </>
            )}

            {/* ================= PASO 2: CONTACTO Y FECHA DE NACIMIENTO ================= */}
            {step === 2 && (
              <>
                <div className="auth-input-group">
                  <label>Fecha de Nacimiento</label>
                  <div className="input-with-icon">
                    <span className="input-icon">📅</span>
                    <input 
                      type="date" 
                      name="fecha_nacimiento" 
                      onChange={handleChange} 
                      value={formData.fecha_nacimiento} 
                      required 
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label>Número de Celular</label>
                  <div className="input-with-icon">
                    <span className="input-icon">📞</span>
                    <input 
                      type="tel" 
                      name="numero_telefono" 
                      onChange={handleChange} 
                      value={formData.numero_telefono} 
                      placeholder="Ej: 3101234567" 
                      required 
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label>Correo Electrónico</label>
                  <div className="input-with-icon">
                    <span className="input-icon">✉</span>
                    <input 
                      type="email" 
                      name="email" 
                      onChange={handleChange} 
                      value={formData.email} 
                      placeholder="wilson@uniquindio.edu.co" 
                      required 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                  <button type="button" className="auth-submit-btn" style={{ background: '#f3f4f6', color: '#1f2937', border: '1px solid #d1d5db' }} onClick={prevStep}>Atrás</button>
                  <button type="button" className="auth-submit-btn" onClick={nextStep}>Siguiente</button>
                </div>
              </>
            )}

            {/* ================= PASO 3: CREDENCIALES DE SEGURIDAD ================= */}
            {step === 3 && (
              <>
                <div className="auth-input-group">
                  <label>Nombre de Usuario (Username)</label>
                  <div className="input-with-icon">
                    <span className="input-icon">🆔</span>
                    <input 
                      type="text" 
                      name="username" 
                      onChange={handleChange} 
                      value={formData.username} 
                      placeholder="Ej: seniorw" 
                      required 
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label>Contraseña</label>
                  <div className="input-with-icon">
                    <span className="input-icon">🔒</span>
                    <input 
                      type="password" 
                      name="password" 
                      onChange={handleChange} 
                      value={formData.password} 
                      placeholder="Ingrese una contraseña segura" 
                      required 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                  <button type="button" className="auth-submit-btn" style={{ background: '#f3f4f6', color: '#1f2937', border: '1px solid #d1d5db' }} onClick={prevStep}>Atrás</button>
                  <button type="submit" className="auth-submit-btn">Crear cuenta</button>
                </div>
              </>
            )}

          </form>

          <p className="auth-footer-text">
            ¿Ya tienes una cuenta? <strong onClick={onVolverAlLogin}>Iniciar Sesión</strong>
          </p>
        </div>
      </div>
    </div>
  )
}