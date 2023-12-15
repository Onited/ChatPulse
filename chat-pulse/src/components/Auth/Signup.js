import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from '../../Utils/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Utils/AuthContext';
import { useTheme } from '../../Utils/ThemeContext';
import './css/Auth.css';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pseudo, setPseudo] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { setCurrentUser } = useAuth();
    const { darkMode } = useTheme();

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        const formattedPseudo = `@${pseudo}`;

        const pseudoDocRef = doc(db, 'pseudos', formattedPseudo);
        const pseudoSnap = await getDoc(pseudoDocRef);
        if (pseudoSnap.exists() || !pseudo.trim()) {
            setError('Le pseudo est déjà utilisé ou invalide.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: formattedPseudo,
            });

            await setDoc(doc(db, 'users', user.uid), { pseudo: formattedPseudo, email: email });

            setCurrentUser({
                ...user,
                pseudo: formattedPseudo,
            });

            setSuccessMessage('Compte créé avec succès. Redirection en cours...');
            setTimeout(() => navigate('/home'), 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    const formClassName = darkMode ? 'form-container dark-mode-form' : 'form-container light-mode-form';
    const inputClassName = darkMode ? 'dark-mode-input' : '';

    return (
        <div className='container'>
            <div className={formClassName}>
                <h1>Signup</h1>
                <form onSubmit={handleSignup}>
                    <label htmlFor="pseudo">Pseudo: </label>
                    <input
                        type="text"
                        value={pseudo}
                        onChange={(e) => setPseudo(e.target.value)}
                        placeholder="Pseudo"
                        className={inputClassName}
                    />
                    <label htmlFor="email">Email: </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className={inputClassName}
                    />
                    <label htmlFor="password">Mot de passe: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mot de passe"
                        className={inputClassName}
                    />
                    <button type="submit">S'inscrire</button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                <p>You already have an account ? <a href='/login'>Login</a> or <a href='/home'>go home</a></p>
            </div>
        </div>
    );
}

export default Signup;
