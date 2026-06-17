import React from "react";
import { DEALER_ITEMS, BUSINESS_ITEMS } from "../data/gameData";
import styles from './Dashboard.module.css';

export default function Dashboard({ cash, prestige, inventory, businesses, currentVehiculeId}) {
    // Calcul pour le résumé
    const totalItems = Object.values(inventory).reduce((a, b) => a + b, 0);
    const activeVehicule = DEALER_ITEMS.find((v) => v.id === currentVehiculeId);

    const totalPassiveIncome = BUSINESS_ITEMS.reduce(
        (total, b) => total + (businesses[b.id] || 0) * b.incomePerSecond,
        0
    );

    const totalBusinessesOwned = Object.values(businesses).reduce((a, b) => a + b, 0);

    return (
        <div className={styles.dashboard}>
            <h2 className={styles.title}>🕶️ Tableau de Bord du Cartel</h2>
            <p className={styles.subtitle}>Résumé en temps réel de votre empire criminel.</p>

            <div className={styles.grid}>
                {/* Carte Finances */}
                <div className={styles.card}>
                   <h3>💰 Finances</h3>
                    <p>Cash disponible : <span className={styles.valueGlow}>{Math.floor(cash)} €</span></p>
                    <p>Revenu passif : <span className={styles.valueGreen}>+{totalPassiveIncome} €/s</span></p> 
                </div>

                {/* Carte Logistique & Stock */}
                <div className={styles.card}>
                    <h3>📦 Logistique</h3>
                    <p>Véhicule : <strong>{activeVehicule ? activeVehicule.name : "À pied"}</strong></p>
                    <p>Marchandises en stock : <span>{totalItems} unités</span></p>
                </div>

                {/* Carte Business */}
                <div className={styles.card}>
                    <h3>🏢 Propriétés</h3>
                    <p>Business actifs : <span>{totalBusinessesOwned} établissements</span></p>
                    <p>Blanchiment en cours...</p>
                </div>

                {/* Carte Inflence */}
                <div className={styles.card}>
                    <h3>⭐ Notoriété</h3>
                    <p>Niveau de prestige : <span className={styles.valueGold}>{prestige}</span></p>
                </div>
            </div>
        </div>
    )
}