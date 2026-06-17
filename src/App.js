import { HashRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";

// --- IMPORTS DES COMPOSANTS ---
import MarketTable from "./components/MarketTable";
import CarDealer from "./components/CarDealer";
import LuxuryStore from "./components/LuxuryStore";
import BusinessStore from "./components/BusinessStore";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";

// --- IMPORT FIREBASE & DB ---
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { saveGameData, loadGameData } from "./dbService";

import {
  MARKET_ITEMS,
  DEALER_ITEMS,
  BUSINESS_ITEMS,
  DEFAULT_STORAGE_CAPACITY,
  calculateNewPrice,
} from "./data/gameData";

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

  // --- ÉTATS DU JEU ---
  const [cash, setCash] = useState(() => getSaved("cartel_cash", 5000));
  const [prestige, setPrestige] = useState(() => getSaved("cartel_prestige", 0));
  const [currentVehicleId, setCurrentVehicleId] = useState(() => getSaved("cartel_vehicle", null));
  const [ownedLuxury, setOwnedLuxury] = useState(() => getSaved("cartel_luxury", []));
  const [inventory, setInventory] = useState(() =>
    getSaved("cartel_inventory", { weed: 0, fake_watch: 0, weapons: 0, art: 0, diamonds: 0, crypto: 0 })
  );
  const [purchasePrices, setPurchasePrices] = useState(() =>
    getSaved("cartel_purchase_prices", { weed: 0, fake_watch: 0, weapons: 0, art: 0, diamonds: 0, crypto: 0 })
  );
  const [businesses, setBusinesses] = useState(() =>
    getSaved("cartel_businesses", { laundry: 0, bar: 0, casino: 0, bank: 0 })
  );

  const [marketPrices, setMarketPrices] = useState(() => {
    const initialPrices = {};
    MARKET_ITEMS.forEach((item) => { initialPrices[item.id] = item.basePrice; });
    return initialPrices;
  });

  const [user, setUser] = useState(null);

  // --- SAUVEGARDE AUTOMATIQUE CLOUD ---
  useEffect(() => {
    if (user) {
      const dataToSave = { cash, prestige, inventory, businesses, activeVehicle: currentVehicleId, ownedLuxury, purchasePrices };
      saveGameData(user.uid, dataToSave);
    }
  }, [cash, prestige, inventory, businesses, currentVehicleId, ownedLuxury, purchasePrices, user]);

  // --- ÉCOUTEUR DE CONNEXION ET CHARGEMENT ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const savedData = await loadGameData(currentUser.uid);
        if (savedData) {
          setCash(savedData.cash ?? 5000);
          setPrestige(savedData.prestige ?? 0);
          setInventory(savedData.inventory || { weed: 0, fake_watch: 0, weapons: 0, art: 0, diamonds: 0, crypto: 0 });
          setBusinesses(savedData.businesses || { laundry: 0, bar: 0, casino: 0, bank: 0 });
          setCurrentVehicleId(savedData.activeVehicle ?? null);
          setOwnedLuxury(savedData.ownedLuxury || []);
        }
        setUser(currentUser);
      } else {
        setUser(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- EFFETS ---
  useEffect(() => {
    localStorage.setItem("cartel_cash", JSON.stringify(cash));
    localStorage.setItem("cartel_prestige", JSON.stringify(prestige));
    localStorage.setItem("cartel_vehicle", JSON.stringify(currentVehicleId));
    localStorage.setItem("cartel_inventory", JSON.stringify(inventory));
    localStorage.setItem("cartel_purchase_prices", JSON.stringify(purchasePrices));
    localStorage.setItem("cartel_businesses", JSON.stringify(businesses));
    localStorage.setItem("cartel_luxury", JSON.stringify(ownedLuxury));
  }, [cash, prestige, currentVehicleId, inventory, purchasePrices, businesses, ownedLuxury]);

  // --- LOGIQUE MARCHÉ ET REVENUS ---
  const currentStorage = Object.values(inventory).reduce((total, count) => total + count, 0);
  const activeVehicle = DEALER_ITEMS.find((v) => v.id === currentVehicleId);
  const maxStorage = activeVehicle ? activeVehicle.storageCapacity : DEFAULT_STORAGE_CAPACITY;

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketPrices((prevPrices) => {
        const updatedPrices = {};
        MARKET_ITEMS.forEach((item) => {
          const currentPrice = prevPrices[item.id] || item.basePrice;
          updatedPrices[item.id] = calculateNewPrice(item, currentPrice);
        });
        return updatedPrices;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCash((currentCash) => {
        const income = BUSINESS_ITEMS.reduce((total, b) => total + (businesses[b.id] || 0) * b.incomePerSecond, 0);
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

  const handleLogout = async () => {
    try { await signOut(auth); } catch (err) { console.error("Erreur déconnexion :", err); }
  };

  if (user === null) return <h3>Chargement du réseau sécurisé...</h3>;
  if (user === false) return <div className="App"><Login onLoginSuccess={() => {}} /></div>;

  return (
    <Router>
      <div className="App">
        <Header cash={cash} prestige={prestige} onReset={handleResetGame} />
        <button onClick={handleLogout}>Se déconnecter</button>
        <main>
          <Routes>
            <Route path="/" element={<Dashboard cash={cash} prestige={prestige} inventory={inventory} businesses={businesses} currentVehiculeId={currentVehicleId} />} />
            <Route path="/market" element={<MarketTable cash={cash} setCash={setCash} inventory={inventory} setInventory={setInventory} marketPrices={marketPrices} prestige={prestige} purchasePrices={purchasePrices} setPurchasePrices={setPurchasePrices} currentStorage={currentStorage} maxStorage={maxStorage} />} />
            <Route path="/business" element={<BusinessStore cash={cash} setCash={setCash} prestige={prestige} businesses={businesses} setBusinesses={setBusinesses} />} />
            <Route path="/garage" element={<CarDealer cash={cash} setCash={setCash} currentVehicleId={currentVehicleId} setCurrentVehicleId={setCurrentVehicleId} />} />
            <Route path="/luxury" element={<LuxuryStore cash={cash} setCash={setCash} prestige={prestige} setPrestige={setPrestige} ownedLuxury={ownedLuxury} setOwnedLuxury={setOwnedLuxury} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}