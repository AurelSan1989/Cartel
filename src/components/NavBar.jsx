import { NavLink } from 'react-router-dom';
import styles from './NavBar.module.css';

export default function NavBar() {
  const tabs = [
    { path: "/", label: "🏠 Empire" },
    { path: "/market", label: "📈 Marché" },
    { path: "/business", label: "🏢 Business" },
    { path: "/garage", label: "🏎️ Garage" },
    { path: "/luxury", label: "💎 Prestige" },
  ]; 

  return (
    <nav className={styles.navBar} >
        {tabs.map((tab) => (
            <NavLink
                key={tab.path}
                to={tab.path}
                end={tab.path === "/"} 
                className={({ isActive }) => 
                  `${styles.navButton} ${isActive ? styles.active : ''}`
                }
            >
                {tab.label}
            </NavLink>
        ))}
    </nav>
  )
}