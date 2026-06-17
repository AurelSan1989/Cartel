import React from "react";
import { DEALER_ITEMS, DEFAULT_STORAGE_CAPACITY } from "../data/gameData";
import styles from "./CarDealer.module.css"

export default function CarDealer({
  cash,
  setCash,
  currentVehicleId,
  setCurrentVehicleId,
}) {
  const handleBuyVehicle = (vehicle) => {
    const currentVehicle = DEALER_ITEMS.find((v) => v.id === currentVehicleId);
    const currentCapacity = currentVehicle
      ? currentVehicle.storageCapacity
      : DEFAULT_STORAGE_CAPACITY;

    if (vehicle.storageCapacity <= currentCapacity) return;
    if (cash < vehicle.price) return;

    setCash(cash - vehicle.price);
    setCurrentVehicleId(vehicle.id);
  };

  return (
    <div
      className={styles.container}
    >
      <h2>🏎️ Concessionnaire Souterrain (Logistique & Transports)</h2>
      <p
        className={styles.description} 
      >
        Achète des véhicules plus grands pour augmenter la taille de ton coffre.
      </p>
      <div
        className={styles.grid}
      >
        {DEALER_ITEMS.map((vehicle) => {
          const currentVehicle = DEALER_ITEMS.find(
            (v) => v.id === currentVehicleId
          );
          const currentCapacity = currentVehicle
            ? currentVehicle.storageCapacity
            : DEFAULT_STORAGE_CAPACITY;

          const isCurrent = currentVehicleId === vehicle.id;
          const isInferior =
            currentCapacity >= vehicle.storageCapacity && !isCurrent;
          const isTooExpensive = cash < vehicle.price;
          const isDisabled = isCurrent || isInferior || isTooExpensive;

          // Logique de classes
          const cardClasses = `${styles.card} ${isCurrent ? styles.cardCurrent : ''} ${isInferior ? styles.cardInferior : ''}`
          const priceClasses = `${styles.vehiculePrice} ${isTooExpensive && !isCurrent ? styles.priceTooExpensive : styles.priceAvailable}`

          // Logique du bouton
          let btnClass = styles.buyButton;
          if (isCurrent) btnClass += ` ${styles.btnCurrent}`;
          else if (isTooExpensive && !isInferior) btnClass += ` ${styles.btnTooExpensive}`;
          else if (!isInferior) btnClass += ` ${styles.btnAvailable}`

          let btnText = "Acheter";
          if (isCurrent) btnText = "Actuel ✓";
          else if (isInferior) btnText = "Dépassé";
          else if (isTooExpensive) btnText = "Pas assez d'argent";

          return (
            <div
              key={vehicle.id}
              className={cardClasses}
            >
              <h3 className={styles.vehiculeName}>
                {vehicle.name}
              </h3>
              <p
                className={priceClasses}
              >
                {vehicle.price} €
              </p>
              <p
              className={styles.vehiculeStorageCapacity}
              >
                📦 Coffre : {vehicle.storageCapacity} objets
              </p>
              <button
                onClick={() => handleBuyVehicle(vehicle)}
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
