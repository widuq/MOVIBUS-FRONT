import { useEffect, useState } from 'react';
import api from '../services/api';

const ListaViajes = () => {
  const [viajes, setViajes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Llamamos al endpoint /viajes que tienes en tu controlador de Java
    api.get('/viajes')
      .then(response => setViajes(response.data))
      .catch(err => setError("No se pudo conectar con el servidor"));
  }, []);

  if (error) return <div style={{color: 'red'}}>{error}</div>;

  return (
    <div>
      <h2>Rutas de MoviBus Disponibles</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>ID</th>
            <th>Origen/Destino</th> {/* Ajusta según tus entidades */}
          </tr>
        </thead>
        <tbody>
          {viajes.map(v => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.descripcion || 'Viaje de prueba'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaViajes;