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
      { key: 'codigo_estado_viaje', label: 'ID ESTADO', tipo: 'number', requerido: true },
      { key: 'codigo_pasajero', label: 'ID PASAJERO', tipo: 'number', requerido: true },
      { key: 'codigo_recorrido', label: 'ID RECORRIDO', tipo: 'number', requerido: true },
      {
        key: '_estado_txt',
        label: 'ESTADO (TXT)',
        tipo: 'text',
        soloLectura: true,
        aplanar: (v) => v._original?.estadoViaje?.estado || '—'
      }
    ],

    normalizar: (v) => ({
      id: v.id,
      fechaInicio: v.fechaInicio || v.fecha_inicio || '',
      fechaFin: v.fechaFin || v.fecha_fin || '',
      valorPagado: v.valorPagado || v.valor_pagado || 0,
      origen: v.origen || '',
      destino: v.destino || '',
      codigo_estado_viaje: v.codigoEstadoViaje || v.estadoViaje?.codigo || v.codigo_estado_viaje || '',
      codigo_pasajero: v.codigoPasajero || v.pasajero?.id || v.codigo_pasajero || '',
      codigo_recorrido: v.codigoRecorrido || v.recorrido?.id || v.codigo_recorrido || '',
      _original: v
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
  }, // <--- Antes tenías un "}," aquí que rompía el objeto

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

        {
            key: 'codigo_estado_incidente',
            label: 'ESTADO',
            tipo: 'number'
        },

        {
            key: 'codigo_tipo_evento',
            label: 'EVENTO',
            tipo: 'number'
        },

        {
            key: 'codigo_ubicacion_incidente',
            label: 'UBICACION',
            tipo: 'number'
        },

        {
            key: 'descripcion',
            label: 'DESCRIPCION',
            tipo: 'text'
        },

        {
            key: '_estado_txt',
            label: 'ESTADO TXT',
            tipo: 'text',
            soloLectura: true
        },

        {
            key: '_evento_txt',
            label: 'EVENTO TXT',
            tipo: 'text',
            soloLectura: true
        }
    ],

    normalizar: (i) => ({
        codigo: i.codigo,

        fecha: i.fecha,

        codigo_estado_incidente:
            i.estadoIncidente?.codigo || '',

        codigo_tipo_evento:
            i.evento?.codigo || '',

        codigo_ubicacion_incidente:
            i.ubicacionIncidente?.codigo || '',

        descripcion: i.descripcion,

        _estado_txt:
            i.estadoIncidente?.estado || '',

        _evento_txt:
            i.evento?.tipoEvento || ''
    }),

    desnormalizar: (form) => ({
        codigo: Number(form.codigo),

        fecha: form.fecha,

        codigoEstadoIncidente:
            Number(form.codigo_estado_incidente),

        codigoTipoEvento:
            Number(form.codigo_tipo_evento),

        codigoUbicacionIncidente:
            Number(form.codigo_ubicacion_incidente),

        descripcion: form.descripcion
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
            key: 'codigo_metodo_pago',
            label: 'METODO PAGO',
            tipo: 'number'
        },

        {
            key: 'codigo_tipo_tarifa',
            label: 'TARIFA',
            tipo: 'number'
        },

        {
            key: '_metodo_pago_txt',
            label: 'METODO PAGO TXT',
            tipo: 'text',
            soloLectura: true
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
            p.tarifa?.tipoTarifa || ''
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
            label: 'VEHICULO',
            tipo: 'number'
        },

        {
            key: '_vehiculo_txt',
            label: 'VEHICULO TXT',
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
        tipo: 'number'
        },

        {
        key: 'codigo_marca',
        label: 'MARCA',
        tipo: 'number'
        },

        {
        key: 'codigo_tipo_combustible',
        label: 'COMBUSTIBLE',
        tipo: 'number'
        },

        {
        key: 'codigo_ubicacion_vehiculo',
        label: 'UBICACION',
        tipo: 'number'
        },

        {
        key: '_marca_txt',
        label: 'MARCA TXT',
        tipo: 'text',
        soloLectura: true
        }
    ],

    normalizar: (v) => ({
        codigo: v.codigo,

        modelo: v.modelo,

        placa: v.placa,

        capacidad: v.capacidad,

        codigo_estado_vehiculo:
        v.estadoVehiculo?.codigo || '',

        codigo_marca:
        v.marca?.codigo || '',

        codigo_tipo_combustible:
        v.combustible?.codigo || '',

        codigo_ubicacion_vehiculo:
        v.ubicacionVehiculo?.codigo || '',

        _marca_txt:
        v.marca?.marca || ''
    }),

    desnormalizar: (form) => ({
        codigo: Number(form.codigo),

        modelo: Number(form.modelo),

        placa: form.placa,

        capacidad: Number(form.capacidad),

        codigoEstadoVehiculo:
        Number(form.codigo_estado_vehiculo),

        codigoMarca:
        Number(form.codigo_marca),

        codigoTipoCombustible:
        Number(form.codigo_tipo_combustible),

        codigoUbicacionVehiculo:
        Number(form.codigo_ubicacion_vehiculo)
    })
}
}; // <--- Aquí cerramos el objeto tablasConfig completo

export const listaTablas = Object.entries(tablasConfig).map(([key, cfg]) => ({
  key,
  label: cfg.label
}));