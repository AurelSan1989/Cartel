import React from "react";
import { LUXURY_ITEMS } from "../data/gameData";
import styles from "./LuxuryStore.module.css"

export default function LuxuryStore({ cash, setCash, prestige, setPrestige }) {
  const handleBuyLuxury = (luxury) => {
    if (prestige >= luxury.prestigeLevel) return;
    if (cash < luxury.price) return;

    setCash(cash - luxury.price);
    setPrestige(luxury.prestigeLevel);
  };

  return (
    <div className={styles.container}>
      <h2>💎 Boutique de Style & Immobilier (Prestige & Influence)</h2>
      <p 
        className={styles.description}>
        Flambe avec des biens d'élite pour faire grimper ton Prestige.
      </p>
      <div className={styles.grid}>
        {LUXURY_ITEMS.map((luxury) => {
          const isOwned = prestige >= luxury.prestigeLevel;
          const isTooExpensive = cash < luxury.price;
          const isDisabled = isOwned || isTooExpensive;

          //Définir les classes dynamiques
          const cardClass = `${styles.card} ${isOwned ? styles.cardOwned : ''}`;
          const priceClass = `${styles.luxuryPrice} ${isTooExpensive && !isOwned ? styles.priceTooExpensive : styles.priceOwned} `;

          // Définir la classe du bouton
          let btnClass = styles.buyButton;
          if (isOwned) btnClass += ` ${styles.isOwned}`;
          else if (isTooExpensive) btnClass += ` ${styles.btnLocked}`;
          else btnClass += ` ${styles.btnAvailable}`;

          let btnText = "S'offrir ce style";
          if (isOwned) btnText = "Possédé ✓";
          else if (isTooExpensive) btnText = "Pas assez d'argent";

          return (
            <div
              key={luxury.id}
              className={cardClass}
            >
              <h3 className={styles.luxuryName}>
                {luxury.name}
              </h3>
              <p
                className={priceClass}
              >
                {luxury.price} €
              </p>
              <p className={styles.luxuryPrestigeLevel}>
                Donne : ⭐ Niveau {luxury.prestigeLevel}
              </p>
              <button
                onClick={() => handleBuyLuxury(luxury)}
                disabled={isDisabled}
                className={btnClass}
              >
                {btnText}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
