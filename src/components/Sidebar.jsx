import { listaTablas } from '../config/tablasConfig'
import './Sidebar.css'
import logo from '../images/logo_movi_bus.png'
import logoTexto from '../images/moviBus.png'

export default function Sidebar({ tablaActiva, onSeleccionar }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="MoviBus logo" className="sidebar-logo-img" />
        <img src={logoTexto} alt="MoviBus" className="sidebar-logo-texto" />
      </div>
      <nav className="sidebar-nav">
        <p className="sidebar-section-label">Tablas</p>
        <ul>
          {listaTablas.map(({ key, label }) => (
            <li key={key}>
              <button
                className={`sidebar-item ${tablaActiva === key ? 'activo' : ''}`}
                onClick={() => onSeleccionar(key)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}