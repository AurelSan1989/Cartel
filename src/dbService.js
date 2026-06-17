// src/dbService.js
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Sauvegarde l'état du jeu pour un utilisateur spécifique
export const saveGameData = async (userId, data) => {
  try {
    // Vérifie bien que "players" est entre guillemets ici !
    const userDocRef = doc(db, "players", userId); 
    await setDoc(userDocRef, data, { merge: true });
    console.log("Données sauvegardées avec succès !");
  } catch (error) {
    console.error("Erreur lors de la sauvegarde :", error);
  }
};

// Récupère l'état du jeu lors de la connexion
export const loadGameData = async (userId) => {
  try {
    // Et ici aussi
    const userDocRef = doc(db, "players", userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Erreur lors du chargement :", error);
    return null;
  }
};