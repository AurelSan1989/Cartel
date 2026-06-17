// src/components/Footer.jsx
import GameAlert from './GameAlert';
import styles from './Footer.module.css';

export default function Footer({ currentEvent }) {
  return (
    <footer className={styles.footer}>
      {/* Zone du haut : L'alerte flash injectée */}
      <div className={styles.alertSection}>
        <GameAlert currentEvent={currentEvent} />
      </div>

      {/* Zone du bas : Informations et Règles du jeu */}
      <div className={styles.contentSection}>
        <div className={styles.column}>
          <h4>📜 Règles du Cartel</h4>
          <ul>
            <li><strong>Le Marché :</strong> Les prix fluctuent toutes les 3 secondes. Achetez bas, vendez haut !</li>
            <li><strong>Stockage :</strong> Votre coffre a une capacité maximale. Achetez des véhicules au Garage pour l'augmenter.</li>
            <li><strong>Blanchiment :</strong> Investissez votre cash dans des Business pour générer un revenu passif automatique par seconde.</li>
            <li><strong>Prestige :</strong> Achetez des biens de luxe pour accumuler du Prestige et débloquer le classement final.</li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4>⚙️ Infos Application</h4>
          <p>Version : <strong>Cartel Beta v1.2</strong></p>
          <p>Statut de sauvegarde : <span className={styles.saveBadge}>Local Saving Actif</span></p>
          <p className={styles.copyright}>© 2026 Cartel Inc.</p>
        </div>
      </div>
    </footer>
  );
}