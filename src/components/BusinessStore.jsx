import React from "react";
import { BUSINESS_ITEMS } from "../data/gameData";
import styles from "./BusinessStore.module.css"

export default function BusinessStore({
  cash,
  setCash,
  prestige,
  businesses,
  setBusinesses,
}) {
  const handleBuyBusiness = (business) => {
    if (prestige < business.minPrestige) return;
    if (cash < business.price) return;

    setCash(cash - business.price);
    setBusinesses({
      ...businesses,
      [business.id]: (businesses[business.id] || 0) + 1,
    });
  };

  // Calcul du revenu passif total affiché dans l'en-tête du composant
  const totalPassiveIncome = BUSINESS_ITEMS.reduce((total, b) => {
    return total + (businesses[b.id] || 0) * b.incomePerSecond;
  }, 0);

  return (
    <div
      className={styles.container}
    >
      <h2>🏢 Blanchiment & Revenus Passifs (Génération de Cash)</h2>
      <p className={styles.description}>
        Investis ton argent sale dans des commerces légitimes pour générer du
        cash automatiquement.
        <br />
        💰 Revenu total actuel :{" "}
        <strong className={styles.incomeHighlight}>
          +{totalPassiveIncome} € / sec
        </strong>
      </p>

      <div
        className={styles.grid}
      >
        {BUSINESS_ITEMS.map((business) => {
          const count = businesses[business.id] || 0;
          const isLocked = prestige < business.minPrestige;
          const isTooExpensive = cash < business.price;
          const isDisabled = isLocked || isTooExpensive;

          // Logique pour les classes conditionnelles
        const cardClass = `${styles.card} ${count > 0 ? styles.cardActive : ''} ${isLocked ? styles.cardLocked : ''}`;
        const btnClass = `${styles.button} ${isLocked ? styles.btnLocked : isTooExpensive ? styles.btnTooExpensive : styles.btnAvailable}`;

          return (
            <div
              key={business.id}
              className={cardClass}
            >
              <h3 className={styles.businessName}>
                {business.name}
              </h3>
              <p
                className={styles.price}
              >
                Prix : {business.price} €
              </p>
              <p
                className={styles.gain}
              >
                📈 Gain : +{business.incomePerSecond} €/sec
              </p>
              <p
                className={styles.owned}
              >
                Possédés : {count}
              </p>

              <button
                onClick={() => handleBuyBusiness(business)}
                disabled={isDisabled}
                className={btnClass}
              >
                {isLocked
                  ? `⭐ Req. Niveau ${business.minPrestige}`
                  : isTooExpensive
                  ? "Pas assez d'argent"
                  : "Acheter"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
