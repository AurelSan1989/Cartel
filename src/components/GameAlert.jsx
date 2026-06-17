// src/components/GameAlert.jsx
import styles from './GameAlert.module.css';

export default function GameAlert({ currentEvent }) {
  if (!currentEvent) {
    return (
      <div className={styles.noAlert}>
        <span className={styles.pulse}>●</span> Statut du Cartel : Calme et sous contrôle...
      </div>
    );
  }

  return (
    <div className={styles.alertContainer}>
      <div className={styles.alertBanner}>
        <span className={styles.alertIcon}>🚨</span>
        <span className={styles.alertText}>
          <strong>ALERTE FLASH :</strong> {currentEvent.text} (Multiplicateur : x{currentEvent.multiplier})
        </span>
      </div>
    </div>
  );
}