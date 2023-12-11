import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../Utils/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import './css/Auth.css';
import { useTheme } from '../../Utils/ThemeContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { darkMode } = useTheme();

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setSuccessMessage('Connexion réussie. Redirection en cours...');
            setTimeout(() => navigate('/chat'), 2000);
        } catch (err) {
            setError(err.message);
        }
    };
    if (darkMode){
        return (
            <div className='container'>
                <div className='form-container dark-mode-form'>
                    <h1>Login</h1>
                    <form onSubmit={handleLogin}>
                        <label htmlFor="email">Email: </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className='dark-mode-input'
                        />
                        <label htmlFor="password">Mot de passe: </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mot de passe"
                            className='dark-mode-input'
                        />
                        <button type="submit">Se connecter</button>
                    </form>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                    <p>You don't have an account ? <a href='/register'>Signup</a> or <a href='/home'>go home</a></p>
                </div>
            </div>
        );
    }else {
        return (
            <div className='container'>
                <div className='form-container light-mode-form'>
                <h1>Login</h1>
                    <form onSubmit={handleLogin}>
                        <label htmlFor="email">Email: </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                        <label htmlFor="password">Mot de passe: </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mot de passe"
                        />
                        <button type="submit">Se connecter</button>
                    </form>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                    <p>You don't have an account ? <a href='/register'>Signup</a> or <a href='/home'>go home</a></p>
                </div>
            </div>
        );
    }
}

export default Login;
