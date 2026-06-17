import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import React, { useState, useEffect } from "react";
import MarketTable from "./components/MarketTable";
import CarDealer from "./components/CarDealer";
import LuxuryStore from "./components/LuxuryStore";
import BusinessStore from "./components/BusinessStore";
import Header from "./components/Header";
import Footer from "./components/Footer";

import {
  MARKET_ITEMS,
  DEALER_ITEMS,
  BUSINESS_ITEMS,
  DEFAULT_STORAGE_CAPACITY,
  calculateNewPrice,
  FLASH_EVENTS,
} from "./data/gameData";
import Dashboard from "./components/Dashboard";

export default function App() {
  // --- LOCALSTORAGE ---
  const getSaved = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    if (saved === null || saved === undefined) return defaultValue;
    try {
      return JSON.parse(saved);
    } catch (e) {
      return defaultValue;
    }
  };

  const [cash, setCash] = useState(() => getSaved("cartel_cash", 5000));
  const [prestige, setPrestige] = useState(() =>
    getSaved("cartel_prestige", 0)
  );
  const [currentVehicleId, setCurrentVehicleId] = useState(() =>
    getSaved("cartel_vehicle", null)
  );
  const [inventory, setInventory] = useState(() =>
    getSaved("cartel_inventory", {
      weed: 0,
      fake_watch: 0,
      weapons: 0,
      art: 0,
      diamonds: 0,
      crypto: 0,
    })
  );
  const [purchasePrices, setPurchasePrices] = useState(() =>
    getSaved("cartel_purchase_prices", {
      weed: 0,
      fake_watch: 0,
      weapons: 0,
      art: 0,
      diamonds: 0,
      crypto: 0,
    })
  );
  const [businesses, setBusinesses] = useState(() =>
    getSaved("cartel_businesses", {
      laundry: 0,
      bar: 0,
      casino: 0,
      bank: 0,
    })
  );

  // --- NOUVEL ÉTAT : ONGLET ACTIF ---
  const [currentEvent, setCurrentEvent] = useState(null);
  const [marketPrices, setMarketPrices] = useState(() => {
    const initialPrices = {};
    MARKET_ITEMS.forEach((item) => {
      initialPrices[item.id] = item.basePrice;
    });
    return initialPrices;
  });

  // --- EFFETS ET SYNCHRO ---
  // --- CHRONO DES ÉVÉNEMENTS ALÉATOIRES ---
  useEffect(() => {
    const eventInterval = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.5) {
        const evenementAuHasard =
          FLASH_EVENTS[Math.floor(Math.random() * FLASH_EVENTS.length)];
        setCurrentEvent(evenementAuHasard);
      } else {
        setCurrentEvent(null);
      }
    }, 15000); // 15000 millisecondes = 15 secondes

    return () => clearInterval(eventInterval);
  }, []);
  useEffect(() => {
    localStorage.setItem("cartel_cash", JSON.stringify(cash));
  }, [cash]);
  useEffect(() => {
    localStorage.setItem("cartel_prestige", JSON.stringify(prestige));
  }, [prestige]);
  useEffect(() => {
    localStorage.setItem("cartel_vehicle", JSON.stringify(currentVehicleId));
  }, [currentVehicleId]);
  useEffect(() => {
    localStorage.setItem("cartel_inventory", JSON.stringify(inventory));
  }, [inventory]);
  useEffect(() => {
    localStorage.setItem(
      "cartel_purchase_prices",
      JSON.stringify(purchasePrices)
    );
  }, [purchasePrices]);
  useEffect(() => {
    localStorage.setItem("cartel_businesses", JSON.stringify(businesses));
  }, [businesses]);

  const currentStorage = Object.values(inventory).reduce(
    (total, count) => total + count,
    0
  );
  const activeVehicle = DEALER_ITEMS.find((v) => v.id === currentVehicleId);
  const maxStorage = activeVehicle
    ? activeVehicle.storageCapacity
    : DEFAULT_STORAGE_CAPACITY;

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketPrices((prevPrices) => {
        const updatedPrices = {};
        MARKET_ITEMS.forEach((item) => {
          // 1. Calcul de base
          const currentPrice = prevPrices[item.id] || item.basePrice;
          let nextPrice = calculateNewPrice(item, currentPrice);

          // 2. Si une crise cible cet item, on applique le multiplicateur !
          if (currentEvent && currentEvent.itemId === item.id) {
            nextPrice = Math.round(nextPrice * currentEvent.multiplier);
          }

          updatedPrices[item.id] = nextPrice;
        });
        return updatedPrices;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [currentEvent]); // ⚠️ N'oublie pas d'ajouter [currentEvent] ici à la ligne 137 !

  useEffect(() => {
    const interval = setInterval(() => {
      setCash((currentCash) => {
        const income = BUSINESS_ITEMS.reduce(
          (total, b) => total + (businesses[b.id] || 0) * b.incomePerSecond,
          0
        );
        return currentCash + income;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [businesses]);

  const handleResetGame = () => {
    if (window.confirm("🚨 Tout réinitialiser ?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Calcul du gain passif total pour le tableau de bord
  const totalPassiveIncome = BUSINESS_ITEMS.reduce(
    (total, b) => total + (businesses[b.id] || 0) * b.incomePerSecond,
    0
  );

  return (
    <Router>
      <div className="App">
        <Header 
          cash={cash}
          prestige={prestige}
          onReset={handleResetGame}
        />
        <main style={{ padding: "0 20px"}}>
          <Routes>
            {/* Redirection automatique de l'accueil "/" vers le marché */}
            <Route path="/" element={
              <Dashboard 
                cash={cash}
                prestige={prestige}
                inventory={inventory}
                businesses={businesses}
                currentVehiculeId={currentVehicleId}
              />
            } />

            <Route path="/market" element={
              <MarketTable 
                cash={cash}
                setCash={setCash}
                inventory={inventory}
                setInventory={setInventory}
                marketPrices={marketPrices}
                prestige={prestige}
                purchasePrices={purchasePrices}
                setPurchasePrices={setPurchasePrices}
                currentStorage={currentStorage}
                maxStorage={maxStorage}
              />
            } />

            <Route path="/business" element={
              <BusinessStore 
                cash={cash}
                setCash={setCash}
                prestige={prestige}
                businesses={businesses}
                setBusinesses={setBusinesses}
              />
            }
            />

            <Route path="/garage" element={
              <CarDealer 
                cash={cash}
                setCash={setCash}
                currentVehicleId={currentVehicleId}
                setCurrentVehicleId={setCurrentVehicleId}
              />
            }            
            />

            <Route path="/luxury" element={
              <LuxuryStore 
                cash={cash}
                setCash={setCash}
                prestige={prestige}
                setPrestige={setPrestige}
              />
            }            
            />
          </Routes>
        </main>
        <Footer currentEvent={currentEvent} />
      </div>
    </Router>
  )
}
