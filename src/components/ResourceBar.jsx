import styles from './ResourceBar.module.css';

export default function ResourceBar({ cash, prestige, onReset}) {
    return (
        <div className={styles.resourceBar}>
            <div className={styles.stats}>
                <div className={styles.statItem}>
                    💰 Cash : <span className={styles.statValue}>{Math.floor(cash)} €</span>
                </div>
                <div className={styles.statItem}>
                    ⭐ Prestige : <span className={styles.statValue}>{prestige}</span>
                </div>
            </div>

            <button 
                className={styles.resetButton}
                onClick={onReset}
            >
                Reset
            </button>
        </div>
    )
}