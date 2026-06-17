import React, { useState } from "react";
import { auth } from "../firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword
} from "firebase/auth";
import styles from "./Login.module.css";

export default function Login( { onLoginSuccess } ) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]= useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (isRegistering) {
                // Logique d'inscription
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                // Logique de connexion
                await signInWithEmailAndPassword(auth, email, password);
            }
            // Alerte le composant parent (App.js) que la connexion a réussi
            onLoginSuccess();
        } catch (err) {
            // Traduction simple des erreurs courantes de Firebase
            if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
                setError("Identifiants incorrects.");
            } else if (err.code === "auth/email-already-in-use") {
                setError("Cette adresse e-mail est déjà utilisée.");
            } else if (err.code === "auth/weak-password") {
                setError("Le mot de passe doit contenir au moins 6 caractères.");
            } else {
                setError("Une erreur est survenue : " + err.message);
            }
        }
    };

    return (
        <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2>{isRegistering ? "⚔️ Créer un compte" : "🔌 Connexion au Réseau"}</h2>
        <p className={styles.subtitle}>
          {isRegistering 
            ? "Enregistre ton profil pour sécuriser ton empire." 
            : "Connecte-toi pour reprendre le contrôle de tes affaires."}
        </p>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Adresse E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="parrain@cartel.com"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            {isRegistering ? "S'inscrire" : "Se connecter"}
          </button>
        </form>

        <div className={styles.toggleMode}>
          {isRegistering ? (
            <p>
              Tu as déjà un compte ?{" "}
              <span onClick={() => setIsRegistering(false)}>Se connecter</span>
            </p>
          ) : (
            <p>
              Nouveau dans le milieu ?{" "}
              <span onClick={() => setIsRegistering(true)}>Créer un compte</span>
            </p>
          )}
        </div>
      </div>
    </div>
    )
}