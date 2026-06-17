// src/data/gameData.js

export const MARKET_ITEMS = [
  {
    id: "weed",
    name: "🌿 Herbe de contrebande",
    basePrice: 10,
    minPrice: 5,
    maxPrice: 25,
    minPrestige: 0,
  },
  {
    id: "fake_watch",
    name: "⌚ Montres de contrefaçon",
    basePrice: 50,
    minPrice: 30,
    maxPrice: 90,
    minPrestige: 0,
  },
  {
    id: "weapons",
    name: "🔫 Armes de poing",
    basePrice: 300,
    minPrice: 150,
    maxPrice: 500,
    minPrestige: 1,
  },
  {
    id: "art",
    name: "🖼️ Tableaux volés",
    basePrice: 1500,
    minPrice: 800,
    maxPrice: 2500,
    minPrestige: 2,
  },
  {
    id: "diamonds",
    name: "💎 Diamants de sang",
    basePrice: 5000,
    minPrice: 3000,
    maxPrice: 8500,
    minPrestige: 3,
  },
  {
    id: "crypto",
    name: "💾 Clés Ledger piratées",
    basePrice: 12000,
    minPrice: 7000,
    maxPrice: 19000,
    minPrestige: 4,
  },
];

export const DEALER_ITEMS = [
  {
    id: "scooter",
    name: "🛵 Scooter d'occasion",
    price: 800,
    storageCapacity: 15,
  },
  { id: "sedan", name: "🚗 Berline teintée", price: 4500, storageCapacity: 50 },
  {
    id: "sports_car",
    name: "🏎️ Supercar Italienne",
    price: 25000,
    storageCapacity: 120,
  },
  {
    id: "helicopter",
    name: "🚁 Hélicoptère privé",
    price: 150000,
    storageCapacity: 500,
  },
];

export const LUXURY_ITEMS = [
  {
    id: "chain",
    name: "⛓️ Chaîne en Or massif",
    price: 1200,
    prestigeLevel: 1,
  },
  { id: "suit", name: "👔 Costume sur mesure", price: 3000, prestigeLevel: 2 },
  {
    id: "villa",
    name: "🏡 Villa sur les hauteurs",
    price: 80000,
    prestigeLevel: 3,
  },
  {
    id: "island",
    name: "🏝️ Atoll privé aux Bahamas",
    price: 500000,
    prestigeLevel: 4,
  },
];

export const DEFAULT_STORAGE_CAPACITY = 5;

export const calculateNewPrice = (item, currentPrice) => {
  if (!item || currentPrice === undefined) return 0;
  const changePercent = Math.random() * 0.45 - 0.2;
  let newPrice = Math.round(currentPrice * (1 + changePercent));

  const min = Math.round(item.basePrice * 0.5);
  const max = Math.round(item.basePrice * 2.5);

  if (newPrice < min) newPrice = min;
  if (newPrice > max) newPrice = max;
  return newPrice;
};

export const BUSINESS_ITEMS = [
  {
    id: "laundry",
    name: "🧺 Blanchisserie automatique",
    price: 2500,
    incomePerSecond: 25,
    minPrestige: 0,
  },
  {
    id: "bar",
    name: "🍺 Bar de nuit clandestin",
    price: 20000,
    incomePerSecond: 120,
    minPrestige: 1,
  },
  {
    id: "casino",
    name: "🎰 Casino clandestin",
    price: 90000,
    incomePerSecond: 600,
    minPrestige: 2,
  },
  {
    id: "bank",
    name: "🏦 Banque d'affaires offshore",
    price: 400000,
    incomePerSecond: 3000,
    minPrestige: 3,
  },
];

export const FLASH_EVENTS = [
  {
    id: "police_raid",
    text: "🚨 DESCENTE DE POLICE : Les stocks d'armes de poing ont été saisis aux douanes ! Les prix s'envolent !",
    idemId: "weapons",
    type: "BOOST",
    multiplier: 2.0,
  },
  {
    id: "weed_legalization",
    text: "🌿 RUMEUR : Discussion sur la légalisation de l'herbe. Le marché noir s'effondre !",
    itemId: "weed",
    type: "CRASH",
    multiplier: 0.4, // Le prix chute de 60%
  },
  {
    id: "crypto_hype",
    text: "💾 TECH : Une faille majeure découverte sur un modèle de Ledger, tout le monde s'arrache les clés piratées !",
    itemId: "crypto",
    type: "BOOST",
    multiplier: 1.8,
  },
  {
    id: "art_gallery",
    text: "🖼️ EXPOSITION : Un milliardaire ouvre un musée privé à Paris, la demande en tableaux volés explose !",
    itemId: "art",
    type: "BOOST",
    multiplier: 1.5,
  },
  {
    id: "fake_watch_seizure",
    text: "⌚ CONTRÔLE : Un gros réseau de contrefaçons démantelé à l'aéroport. Pénurie de montres !",
    itemId: "fake_watch",
    type: "BOOST",
    multiplier: 1.7,
  },
];
