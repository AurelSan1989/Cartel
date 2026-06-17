import React from "react";
import { MARKET_ITEMS } from "../data/gameData"; 
import styles from "./MarketTable.module.css"

export default function MarketTable({
  cash,
  setCash,
  inventory,
  setInventory,
  marketPrices,
  prestige,
  purchasePrices,
  setPurchasePrices,
  currentStorage,
  maxStorage,
}) {
  const handleBuy = (item) => {
    const currentPrice = marketPrices[item.id];
    if (
      prestige < item.minPrestige ||
      currentStorage >= maxStorage ||
      cash < currentPrice
    )
      return;

    const currentCount = inventory[item.id];
    const oldPAM = purchasePrices[item.id];
    const newCount = currentCount + 1;
    const newPAM = Math.round(
      (currentCount * oldPAM + currentPrice) / newCount
    );

    setCash(cash - currentPrice);
    setInventory({ ...inventory, [item.id]: newCount });
    setPurchasePrices({ ...purchasePrices, [item.id]: newPAM });
  };

  const handleBuyMax = (item) => {
    const currentPrice = marketPrices[item.id];
    if (
      prestige < item.minPrestige ||
      cash < currentPrice ||
      currentStorage >= maxStorage
    )
      return;

    const maxByCash = Math.floor(cash / currentPrice);
    const maxByStorage = maxStorage - currentStorage;
    const quantityToBuy = Math.min(maxByCash, maxByStorage);

    if (quantityToBuy <= 0) return;

    const currentCount = inventory[item.id];
    const oldPAM = purchasePrices[item.id];
    const newCount = currentCount + quantityToBuy;
    const totalCost = currentPrice * quantityToBuy;
    const newPAM = Math.round((currentCount * oldPAM + totalCost) / newCount);

    setCash(cash - totalCost);
    setInventory({ ...inventory, [item.id]: newCount });
    setPurchasePrices({ ...purchasePrices, [item.id]: newPAM });
  };

  const handleSell = (item) => {
    const currentCount = inventory[item.id];
    if (currentCount <= 0) return;

    const currentPrice = marketPrices[item.id];
    const newCount = currentCount - 1;

    setCash(cash + currentPrice);
    setInventory({ ...inventory, [item.id]: newCount });

    if (newCount === 0) {
      setPurchasePrices({ ...purchasePrices, [item.id]: 0 });
    }
  };

  const handleSellAll = () => {
    let totalGain = 0;
    MARKET_ITEMS.forEach((item) => {
      const count = inventory[item.id];
      const currentPrice = marketPrices[item.id];
      if (count > 0) totalGain += count * currentPrice;
    });

    if (totalGain === 0) return;

    setCash(cash + totalGain);
    const resetObj = {
      weed: 0,
      fake_watch: 0,
      weapons: 0,
      art: 0,
      diamonds: 0,
      crypto: 0,
    };
    setInventory(resetObj);
    setPurchasePrices(resetObj);
  };

  let totalGlobalProfit = 0;
  let hasItems = false;

  MARKET_ITEMS.forEach((item) => {
    const count = inventory[item.id];
    const currentPrice = marketPrices[item.id];
    const pam = purchasePrices[item.id];
    if (count > 0) {
      hasItems = true;
      totalGlobalProfit += (currentPrice - pam) * count;
    }
  });

  let buttonText = "🚨 Tout Vendre";
  let buttonBgColor = "#4c566a";

  if (hasItems) {
    if (totalGlobalProfit > 0) {
      buttonText = `🚨 Tout Vendre (+${totalGlobalProfit} € 📈)`;
      buttonBgColor = "#4caf50";
    } else if (totalGlobalProfit < 0) {
      buttonText = `🚨 Tout Vendre (${totalGlobalProfit} € 📉)`;
      buttonBgColor = "#ff4d4d";
    } else {
      buttonText = "🚨 Tout Vendre (0 €)";
      buttonBgColor = "#d08770";
    }
  }

  const storagePercentage = Math.min((currentStorage / maxStorage) * 100, 100);
  const isStorageFull = currentStorage >= maxStorage;

  return (
    <div
      className={styles.container}
    >
      {/* BARRE DE STOCKAGE */}
      <div
        className={styles.storageBarContainer}
      >
        <div
          className={`${styles.storageBarContainer} ${isStorageFull ? styles.storageBarContainerFull : ""}`}
        >
          <span>🎒 Espace de transport :</span>
          <span style={{ color: isStorageFull ? "#ff4d4d" : "#4caf50" }}>
            {currentStorage} / {maxStorage} unités
          </span>
        </div>
        <div className={styles.progressBarTrack} >
          <div
            className={styles.progressBarFill}
            style={{
              width: `${storagePercentage}%`,
              backgroundColor: isStorageFull ? "#ff4d4d" : "#4caf50",
            }}
          />
        </div>
      </div>

      <div className={styles.marketHeader} >
        <h2 style={{ margin: 0 }}>📈 Marché Noir</h2>
        <button
          onClick={handleSellAll}
          disabled={!hasItems}
          className={styles.actionButton}
          style={{
            backgroundColor: buttonBgColor
          }}
        >
          {buttonText}
        </button>
      </div>

      <table
        className={styles.table}
      >
        <thead>
          <tr className={styles.tableHeader}>
            <th>Marchandise</th>
            <th>Prix Actuel</th>
            <th>Tendance</th>
            <th>En Stock</th>
            <th>PAM</th>
            <th>Bénéfice Latent</th>
            <th>Prestige</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {MARKET_ITEMS.map((item) => {
            const currentPrice = marketPrices[item.id] || item.basePrice;
            const count = inventory[item.id];
            const isLocked = prestige < item.minPrestige;
            const isCashTooLow = cash < currentPrice;
            const pam = purchasePrices[item.id];

            const maxByCash = Math.floor(cash / currentPrice);
            const maxByStorage = maxStorage - currentStorage;
            const maxQuantity = Math.max(0, Math.min(maxByCash, maxByStorage));

            let trendEmoji = "➡️";
            let trendColor = "#888";
            if (currentPrice > item.basePrice) {
              trendEmoji = "🔺 Haut";
              trendColor = "#ff4d4d";
            } else if (currentPrice < item.basePrice) {
              trendEmoji = "🔻 Bas";
              trendColor = "#4caf50";
            }

            let profitText = "-";
            let profitColor = "#888";
            if (count > 0) {
              const totalProfit = (currentPrice - pam) * count;
              if (totalProfit > 0) {
                profitText = `+${totalProfit} € 📈`;
                profitColor = "#4caf50";
              } else if (totalProfit < 0) {
                profitText = `${totalProfit} € 📉`;
                profitColor = "#ff4d4d";
              } else {
                profitText = "0 €";
                profitColor = "white";
              }
            }

            const isDisabledBuy = isLocked || isStorageFull || isCashTooLow;

            return (
              <tr
                key={item.id}
                className={styles.tableRow}
                style={{
                  opacity: isLocked ? 0.3 : 1,
                }}
              >
                <td>
                  {item.name}
                </td>
                <td>
                  {currentPrice} €
                </td>
                <td>
                  {trendEmoji}
                </td>
                <td>{count}</td>
                <td>
                  {count > 0 ? `${pam} €` : "-"}
                </td>
                <td>
                  {profitText}
                </td>
                <td>⭐ {item.minPrestige}</td>
                <td>
                  <button 
                    onClick={() => handleBuy(item)} 
                    className={styles.actionButton}>
                      Acheter +1
                  </button>

                  <button 
                    onClick={() => handleBuyMax(item)} 
                    className={`${styles.actionButton} ${styles.buyButton}`}>
                      Acheter Max
                  </button>

                  <button
                    onClick={() => handleSell(item)}
                    disabled={count <= 0}
                    className={styles.sellButton}
                  >
                    Vendre -1
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
