// config/tablasConfig.js

export const tablasConfig = {
  

viajes: {
    label: 'Viajes',
    endpoint: 'viajes',
    pk: 'id',
    columnas: [
      { key: 'id', label: 'ID', tipo: 'number', soloLectura: true },
      { key: 'fechaInicio', label: 'FECHA INICIO', tipo: 'date', requerido: true },
      { key: 'fechaFin', label: 'FECHA FIN', tipo: 'date' },
      { key: 'valorPagado', label: 'VALOR', tipo: 'number', requerido: true },
      { key: 'origen', label: 'ORIGEN', tipo: 'text', requerido: true },
      { key: 'destino', label: 'DESTINO', tipo: 'text', requerido: true },
      
      // CORRECCIÓN: Ahora es un select y lee directo de la variable plana normalizada
      {
        key: 'codigo_estado_viaje',
        label: 'ESTADO',
        tipo: 'select',
        requerido: true,
        opciones: [
          { value: 1, label: 'Programado' },
          { value: 2, label: 'En Ruta' },
          { value: 3, label: 'Finalizado' },
          { value: 4, label: 'Cancelado' }
        ],
        aplanar: (v) => v._estado_txt || '—'
      },
      
      { key: 'codigo_pasajero', label: 'ID PASAJERO', tipo: 'number', requerido: true },
      { key: 'codigo_recorrido', label: 'ID RECORRIDO', tipo: 'number', requerido: true },
      
      // Columna de solo lectura para soporte en el listado si se requiere
      {
        key: '_estado_txt',
        label: 'ESTADO (TXT)',
        tipo: 'text',
        soloLectura: true,
        aplanar: (v) => v._estado_txt || '—'
      }
    ],

    normalizar: (v) => ({
      id: v.id,
      fechaInicio: v.fechaInicio || v.fecha_inicio || '',
      fechaFin: v.fechaFin || v.fecha_fin || '',
      valorPagado: v.valorPagado || v.valor_pagado || 0,
      origen: v.origen || '',
      destino: v.destino || '',
      codigo_estado_viaje: v.estadoViaje?.codigo || v.codigoEstadoViaje || v.codigo_estado_viaje || '',
      codigo_pasajero: v.pasajero?.id || v.codigoPasajero || v.codigo_pasajero || '',
      codigo_recorrido: v.recorrido?.id || v.codigoRecorrido || v.codigo_recorrido || '',
      
      // CORRECCIÓN: Guardamos el texto plano aquí buscando las variantes del objeto Java
      _estado_txt: v.estadoViaje?.estado || v.estadoViaje?.nombre || v.estadoViaje?.descripcion || ''
    }),

    desnormalizar: (form) => ({
      id: form.id ? Number(form.id) : null,
      fechaInicio: form.fechaInicio,
      fechaFin: form.fechaFin,
      valorPagado: Number(form.valorPagado),
      origen: form.origen,
      destino: form.destino,
      codigoEstadoViaje: Number(form.codigo_estado_viaje),
      codigoPasajero: Number(form.codigo_pasajero),
      codigoRecorrido: Number(form.codigo_recorrido)
    })
  },

  incidentes: {
        label: 'Incidentes',
        endpoint: 'incidentes',
        pk: 'codigo',

        columnas: [
            {
                key: 'codigo',
                label: 'CODIGO',
                tipo: 'number'
            },
            {
                key: 'fecha',
                label: 'FECHA',
                tipo: 'date'
            },
            // Al editar se convierte en Select, al listar muestra el texto aplanado
            {
                key: 'codigo_estado_incidente',
                label: 'ESTADO',
                tipo: 'select',
                opciones: [
                    { value: 1, label: 'Activo' },
                    { value: 2, label: 'Finalizado' }
                    
                ],
                aplanar: (i) => i._estado_txt || '—'
            },
            // Al editar se convierte en Select, al listar muestra el texto aplanado
            {
                key: 'codigo_tipo_evento',
                label: 'EVENTO',
                tipo: 'select',
                opciones: [
                    { value: 1, label: 'Accidente de Tránsito' },
                    { value: 2, label: 'Falla Mecánica' },
                    { value: 3, label: 'Retraso por congestión vehicular' }
                ],
                aplanar: (i) => i._evento_txt || '—'
            },
            {
                key: 'codigo_ubicacion_incidente',
                label: 'UBICACION',
                tipo: 'number' // Puedes cambiarlo a select si creas opciones de zonas/paradas
            },
            {
                key: 'descripcion',
                label: 'DESCRIPCION',
                tipo: 'text'
            },
            // Columnas de solo lectura por si el componente requiere los campos de texto explícitos
            {
                key: '_estado_txt',
                label: 'ESTADO (TXT)',
                tipo: 'text',
                soloLectura: true,
                aplanar: (i) => i._estado_txt || '—'
            }
        ],

        normalizar: (i) => {
            // Log para ver en la consola del navegador qué está mandando el backend exactamente
            console.log("Datos del incidente recibido:", i);
            
            return {
                codigo: i.codigo,
                fecha: i.fecha,
                codigo_estado_incidente: i.estadoIncidente?.codigo || '',
                codigo_tipo_evento: i.evento?.codigo || '',
                codigo_ubicacion_incidente: i.ubicacionIncidente?.codigo || '',
                descripcion: i.descripcion,
                
                _estado_txt: i.estadoIncidente?.estado || '',
                
                // INTENTA LEER TODAS LAS VARIANTES POSIBLES DEL STRING:
                _evento_txt: 
                    i.evento?.nombre || 
                    i.evento?.descripcion || 
                    i.evento?.evento || 
                    i.evento?.tipoEvento || 
                    i.evento?.tipo ||
                    ''
            };
        },

        desnormalizar: (form) => ({
            codigo: Number(form.codigo),
            fecha: form.fecha,
            codigoEstadoIncidente: Number(form.codigo_estado_incidente),
            codigoTipoEvento: Number(form.codigo_tipo_evento),
            codigoUbicacionIncidente: Number(form.codigo_ubicacion_incidente),
            descripcion: form.descripcion
        })
    },
personas: {
    label: 'Personas',
    endpoint: 'personas',
    pk: 'id',

    columnas: [
        { key: 'id', label: 'ID', tipo: 'number' },
        { key: 'primer_nombre', label: 'PRIMER NOMBRE', tipo: 'text' },
        { key: 'segundo_nombre', label: 'SEGUNDO NOMBRE', tipo: 'text' },
        { key: 'primer_apellido', label: 'PRIMER APELLIDO', tipo: 'text' },
        { key: 'segundo_apellido', label: 'SEGUNDO APELLIDO', tipo: 'text' },
        { key: 'correo', label: 'CORREO', tipo: 'text' },
        { key: 'username', label: 'USERNAME', tipo: 'text' },
        { key: 'password', label: 'CONTRASEÑA', tipo: 'text' },
        { key: 'fecha_nacimiento', label: 'F. NACIMIENTO', tipo: 'date' },
        { key: 'fecha_registro', label: 'F. REGISTRO', tipo: 'date' },
        { key: 'estado', label: 'ESTADO', tipo: 'number' },
        { key: 'codigo_telefono', label: 'ID TELÉFONO', tipo: 'number' },
        { key: 'codigo_tipo_documento', label: 'ID TIPO DOC', tipo: 'number' }
    ],

    normalizar: (p) => ({
        id: p.id,
        primer_nombre: p.primerNombre || '',
        segundo_nombre: p.segundoNombre || '',
        primer_apellido: p.primerApellido || '',
        segundo_apellido: p.segundoApellido || '',
        correo: p.correo || '',
        username: p.username || '',
        password: p.password || '',
        fecha_nacimiento: p.fechaNacimiento || '',
        fecha_registro: p.fechaRegistro || '',
        estado: p.estado !== undefined ? p.estado : 1,
        // Alivio de fallos: si no viene el objeto relación, saca la propiedad plana de la query nativa
        codigo_telefono: p.telefono?.codigo || p.codigoTelefono || '',
        codigo_tipo_documento: p.documento?.codigo || p.codigoTipoDocumento || ''
    }),

    desnormalizar: (form) => ({
        id: form.id ? Number(form.id) : null,
        primerNombre: form.primer_nombre,
        segundoNombre: form.segundo_nombre,
        primerApellido: form.primer_apellido,
        segundoApellido: form.segundo_apellido,
        correo: form.correo,
        username: form.username,
        password: form.password,
        fechaNacimiento: form.fecha_nacimiento || null,
        fechaRegistro: form.fecha_registro || null,
        estado: Number(form.estado || 1),
        codigoTelefono: form.codigo_telefono ? Number(form.codigo_telefono) : null,
        codigoDocumento: form.codigo_tipo_documento ? Number(form.codigo_tipo_documento) : null
    })
},

pasajeros: {
    label: 'Pasajeros',
    endpoint: 'pasajeros',
    pk: 'id',

    columnas: [
        {
            key: 'id',
            label: 'ID',
            tipo: 'number'
        },

        {
            key: 'primer_nombre',
            label: 'PRIMER NOMBRE',
            tipo: 'text'
        },

        {
            key: 'segundo_nombre',
            label: 'SEGUNDO NOMBRE',
            tipo: 'text'
        },

        {
            key: 'primer_apellido',
            label: 'PRIMER APELLIDO',
            tipo: 'text'
        },

        {
            key: 'segundo_apellido',
            label: 'SEGUNDO APELLIDO',
            tipo: 'text'
        },

        {
            key: 'correo',
            label: 'CORREO',
            tipo: 'text'
        },

        {
            key: 'username',
            label: 'USERNAME',
            tipo: 'text'
        },

        {
            key: '_metodo_pago_txt',
            label: 'METODO PAGO',
            tipo: 'text',
            soloLectura: true
        },

        {
            key: 'codigo_tipo_tarifa',
            label: 'TARIFA',
            tipo: 'number',
            aplanar: (p) => p._tarifa_txt || '—'
        },

        {
            key: '_tarifa_txt',
            label: 'TARIFA TXT',
            tipo: 'text',
            soloLectura: true
        }
    ],

    normalizar: (p) => ({
        id: p.id,

        primer_nombre:
            p.persona?.primerNombre || '',

        segundo_nombre:
            p.persona?.segundoNombre || '',

        primer_apellido:
            p.persona?.primerApellido || '',

        segundo_apellido:
            p.persona?.segundoApellido || '',

        correo:
            p.persona?.correo || '',

        username:
            p.persona?.username || '',

        codigo_metodo_pago:
            p.metodoPago?.codigo || '',

        codigo_tipo_tarifa:
            p.tarifa?.codigo || '',

        _metodo_pago_txt:
            p.metodoPago?.metodo || '',

        _tarifa_txt:
            p.tarifa?.tipo || ''
    }),

    desnormalizar: (form) => ({
        id: Number(form.id),

        persona: {
            primerNombre: form.primer_nombre,
            segundoNombre: form.segundo_nombre,
            primerApellido: form.primer_apellido,
            segundoApellido: form.segundo_apellido,
            correo: form.correo,
            username: form.username
        },

        codigoMetodoPago:
            Number(form.codigo_metodo_pago),

        codigoTarifa:
            Number(form.codigo_tipo_tarifa)
    })
},

conductores: {
    label: 'Conductores',
    endpoint: 'conductores',
    pk: 'id',

    columnas: [
        {
            key: 'id',
            label: 'ID',
            tipo: 'number'
        },

        {
            key: 'primer_nombre',
            label: 'PRIMER NOMBRE',
            tipo: 'text'
        },

        {
            key: 'segundo_nombre',
            label: 'SEGUNDO NOMBRE',
            tipo: 'text'
        },

        {
            key: 'primer_apellido',
            label: 'PRIMER APELLIDO',
            tipo: 'text'
        },

        {
            key: 'segundo_apellido',
            label: 'SEGUNDO APELLIDO',
            tipo: 'text'
        },

        {
            key: 'correo',
            label: 'CORREO',
            tipo: 'text'
        },

        {
            key: 'username',
            label: 'USERNAME',
            tipo: 'text'
        },

        {
            key: 'experiencia',
            label: 'EXPERIENCIA',
            tipo: 'number'
        },

        {
            key: 'codigo_vehiculo',
            label: 'ID VEHICULO',
            tipo: 'number'
        },

        {
            key: '_vehiculo_txt',
            label: 'PLACA VEHICULO',
            tipo: 'text',
            soloLectura: true
        }
    ],

    normalizar: (c) => ({
        id: c.id,

        primer_nombre:
            c.persona?.primerNombre || '',

        segundo_nombre:
            c.persona?.segundoNombre || '',

        primer_apellido:
            c.persona?.primerApellido || '',

        segundo_apellido:
            c.persona?.segundoApellido || '',

        correo:
            c.persona?.correo || '',

        username:
            c.persona?.username || '',

        experiencia:
            c.experiencia || '',

        codigo_vehiculo:
            c.vehiculo?.codigo || '',

        _vehiculo_txt:
            c.vehiculo?.placa || ''
    }),

    desnormalizar: (form) => ({
        id: Number(form.id),

        persona: {
            primerNombre: form.primer_nombre,
            segundoNombre: form.segundo_nombre,
            primerApellido: form.primer_apellido,
            segundoApellido: form.segundo_apellido,
            correo: form.correo,
            username: form.username
        },

        experiencia:
            Number(form.experiencia),

        codigoVehiculo:
            Number(form.codigo_vehiculo)
    })
},

administradores: {
    label: 'Administradores',
    endpoint: 'administradores',
    pk: 'id',

    columnas: [
        { key: 'id', label: 'ID', tipo: 'number' },
        { key: 'primer_nombre', label: 'PRIMER NOMBRE', tipo: 'text' },
        { key: 'segundo_nombre', label: 'SEGUNDO NOMBRE', tipo: 'text' },
        { key: 'primer_apellido', label: 'PRIMER APELLIDO', tipo: 'text' },
        { key: 'segundo_apellido', label: 'SEGUNDO APELLIDO', tipo: 'text' },
        { key: 'correo', label: 'CORREO', tipo: 'text' },
        { key: 'username', label: 'USERNAME', tipo: 'text' },
        { key: 'cargo', label: 'CARGO', tipo: 'text' },
        { key: 'codigo_nivel_permiso', label: 'ID PERMISO', tipo: 'number' },
        { key: '_nivel_permiso_txt', label: 'NIVEL PERMISO', tipo: 'text', soloLectura: true },
        { key: 'codigo_administrador', label: 'ID JEFE', tipo: 'number' }
    ],

    normalizar: (a) => ({
        id: a.id,
        primer_nombre: a.persona?.primerNombre || '',
        segundo_nombre: a.persona?.segundoNombre || '',
        primer_apellido: a.persona?.primerApellido || '',
        segundo_apellido: a.persona?.segundoApellido || '',
        correo: a.persona?.correo || '',
        username: a.persona?.username || '',
        cargo: a.cargo || '',
        codigo_nivel_permiso: a.nivelPermiso?.codigo || '', 
        _nivel_permiso_txt: a.nivelPermiso?.nombre || a.nivelPermiso?.descripcion || '',
        codigo_administrador: a.administrador?.id || '' 
    }),

    desnormalizar: (form) => ({
        id: Number(form.id),
        persona: {
            primerNombre: form.primer_nombre,
            segundoNombre: form.segundo_nombre,
            primerApellido: form.primer_apellido,
            segundoApellido: form.segundo_apellido,
            correo: form.correo,
            username: form.username
        },
        cargo: form.cargo,
        codigoNivelPermiso: Number(form.codigo_nivel_permiso),
        codigoAdministrador: form.codigo_administrador ? Number(form.codigo_administrador) : null
    })
},

  combustibles: {
    label: 'Combustibles',
    endpoint: 'combustibles',
    pk: 'codigo',
    columnas: [
      { key: 'codigo', label: 'CODIGO', tipo: 'number', soloLectura: true },
      { key: 'tipo', label: 'TIPO', tipo: 'text', requerido: true }
    ]
  }, // <--- Coma para continuar el objeto

  vehiculos: {
    label: 'Vehículos',
    endpoint: 'vehiculos',
    pk: 'codigo',

    columnas: [
      {
        key: 'codigo',
        label: 'CODIGO',
        tipo: 'number'
      },
      {
        key: 'modelo',
        label: 'MODELO',
        tipo: 'number'
      },
      {
        key: 'placa',
        label: 'PLACA',
        tipo: 'text'
      },
      {
        key: 'capacidad',
        label: 'CAPACIDAD',
        tipo: 'number'
      },
      {
        key: 'codigo_estado_vehiculo',
        label: 'ESTADO',
        tipo: 'select',
        opciones: [
          { value: 1, label: 'Activo' },
          { value: 2, label: 'En Mantenimiento' },
          { value: 3, label: 'Fuera de Servicio' }
        ],
        aplanar: (v) => v._estado_txt || '—'
      },
      {
        key: 'codigo_marca',
        label: 'MARCA',
        tipo: 'select',
        opciones: [
          { value: 1, label: 'Mercedes-Benz' },
          { value: 6, label: 'International' }
        ],
        aplanar: (v) => v._marca_txt || '—'
      },
      {
        key: 'codigo_tipo_combustible',
        label: 'COMBUSTIBLE',
        tipo: 'select',
        opciones: [
          { value: 1, label: 'Diésel' },
          { value: 2, label: 'Gasolina' },
          { value: 3, label: 'Eléctrico' },
          { value: 4, label: 'Gas Natural' }
        ],
        aplanar: (v) => v._combustible_txt || '—'
      },
      {
        key: 'codigo_ubicacion_vehiculo',
        label: 'UBICACION',
        tipo: 'number' // Puedes cambiarlo a 'select' si luego manejas paradas/patios fijos
      },
      {
        key: '_marca_txt',
        label: 'MARCA TXT',
        tipo: 'text',
        soloLectura: true,
        aplanar: (v) => v._marca_txt || '—'
      }
    ],

    normalizar: (v) => ({
      codigo: v.codigo,
      modelo: v.modelo,
      placa: v.placa,
      capacidad: v.capacidad,
      
      codigo_estado_vehiculo: v.estadoVehiculo?.codigo || v.codigoEstadoVehiculo || '',
      codigo_marca: v.marca?.codigo || v.codigoMarca || '',
      codigo_tipo_combustible: v.combustible?.codigo || v.codigoTipoCombustible || '',
      codigo_ubicacion_vehiculo: v.ubicacionVehiculo?.codigo || v.codigoUbicacionVehiculo || '',

      // Mapeos de texto plano robustos (intentando variaciones del backend)
      _marca_txt: v.marca?.marca || v.marca?.nombre || v.marca?.descripcion || '',
      _estado_txt: v.estadoVehiculo?.estado || v.estadoVehiculo?.nombre || v.estadoVehiculo?.descripcion || '',
      _combustible_txt: v.combustible?.tipo || v.combustible?.nombre || v.combustible?.descripcion || ''
    }),

    desnormalizar: (form) => ({
      codigo: Number(form.codigo),
      modelo: Number(form.modelo),
      placa: form.placa,
      capacidad: Number(form.capacidad),
      codigoEstadoVehiculo: Number(form.codigo_estado_vehiculo),
      codigoMarca: Number(form.codigo_marca),
      codigoTipoCombustible: Number(form.codigo_tipo_combustible),
      codigoUbicacionVehiculo: Number(form.codigo_ubicacion_vehiculo)
    })
  },

  telefonos: {
    label: 'Teléfonos',
    endpoint: 'telefonos',
    pk: 'codigo',

    columnas: [
        { key: 'codigo', label: 'CÓDIGO ID', tipo: 'number' },
        { key: 'numero', label: 'NÚMERO DE TELÉFONO', tipo: 'text' }
    ],

    // Convierte el formato que viene de Spring Boot (Java) al formato de tu interfaz (snake_case / plano)
    normalizar: (t) => ({
        codigo: t.codigo,
        numero: t.numero || ''
    }),

    // Convierte el estado de tus inputs/formularios al JSON exacto que espera recibir tu @RequestBody en Spring Boot
    desnormalizar: (form) => ({
        codigo: form.codigo ? Number(form.codigo) : null,
        numero: form.numero ? form.numero.toString() : ''
    })
}

}; // <--- Aquí cierra el objeto tablasConfig completo

export const listaTablas = Object.entries(tablasConfig).map(([key, cfg]) => ({
  key,
  label: cfg.label
}));