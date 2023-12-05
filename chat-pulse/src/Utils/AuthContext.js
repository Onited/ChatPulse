// // src/utils/AuthContext.js ou src/AuthContext.js
// import React, { useContext, useState, useEffect } from 'react';
// import { auth } from './firebaseConfig';
// import { setPersistence, signInWithEmailAndPassword, browserLocalPersistence } from 'firebase/auth';

// const AuthContext = React.createContext();

// export function useAuth() {
//     return useContext(AuthContext);
// }

// export function AuthProvider({ children }) {
//     const [currentUser, setCurrentUser] = useState();
//     const [loading, setLoading] = useState(true);

//     function signUp(email, password) {
//         return auth.createUserWithEmailAndPassword(email, password);
//     }

//     function login(email, password) {
//         setPersistence(auth, browserLocalPersistence)
//             .then(() => {
//                 return signInWithEmailAndPassword(auth, email, password);
//             })
//             .catch((error) => {
//                 console.log(error.code);
//                 console.log(error.message);
//             });
//     }

//     function logout() {
//         return auth.signOut();
//     }

//     useEffect(() => {
//         const unsubscribe = auth.onAuthStateChanged(user => {
//             setCurrentUser(user);
//             setLoading(false)
//         });

//         return unsubscribe;
//     }, []);

//     const value = {
//         currentUser,
//         signUp,
//         login,
//         logout,
//     };

//     return (
//         <AuthContext.Provider value={value}>
//             {!loading && children}
//         </AuthContext.Provider>
//     );
// }

import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState, useContext, createContext } from 'react';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return auth.signOut();
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signUp,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}