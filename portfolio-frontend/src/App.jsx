import { useState } from 'react';
import './App.css';
import Login from './Login';
import Dashboard from './Dashboard';
import Home from './Home';
import Register from './Register';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

function App() {
    // checking if we have a token
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwt_token'));
  	const [currentView, setCurrentView] = useState('home'); // also: 'login', 'register'

    const handleLogout = () => {
		localStorage.removeItem('jwt_token'); // getting rid of the token
		setIsLoggedIn(false); // changing the state to logged-out
		setCurrentView('home'); // returning to the home view
		navigate('/'); // redirecting to the home page
    };

    return (
        <Routes>
            {/* HOME PAGE */}
            <Route path="/" element={
                isLoggedIn ? <Navigate to="/dashboard" /> : <Home />
            } />
            
            {/* LOG IN */}
            <Route path="/login" element={
                isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={() => setIsLoggedIn(true)} />
            } />
            
            {/* SIGN UP */}
            <Route path="/register" element={
                isLoggedIn ? <Navigate to="/dashboard" /> : <Register />
            } />
            
            {/* DASHBOARD (secured!) */}
            <Route path="/dashboard" element={
                isLoggedIn ? (
                    <div style={{ textAlign: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
                        <h1>🏛️ Ancient Bank</h1>
                        <button onClick={handleLogout} style={{ marginBottom: '20px', padding: '8px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px' }}>
                            Log Out
                        </button>
                        <Dashboard />
                    </div>
                ) : <Navigate to="/" />
            } />
        </Routes>
    );
}

export default App