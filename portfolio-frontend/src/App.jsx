import { useState } from 'react';
import './App.css';
import Login from './Login';
import Dashboard from './Dashboard';
import Home from './Home';
import Register from './Register';
import Transfer from './Transfer';
import History from './History';
import Exchange from './Exchange';
import { Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';

function App() {
    // checking if we have a token
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwt_token'));
    const navigate = useNavigate();

    const handleLogout = () => {
		localStorage.removeItem('jwt_token'); // getting rid of the token
		setIsLoggedIn(false); // changing the state to logged-out
		navigate('/'); // redirecting to the home page
    };

    return (
        <Routes>
            <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Home />} />
            <Route path="/login" element={isLoggedIn
                ? <Navigate to="/dashboard" />
                : <Login onLoginSuccess={() => setIsLoggedIn(true)} />} />
            <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />} />
            
            {/* DASHBOARD */}
            <Route path="/dashboard" element={
                isLoggedIn ? (
                    <div style={{ textAlign: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
                        <h1>🏛️ Ancient Bank</h1>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                            <Link to="/dashboard"><button style={{ padding: '8px' }}>💳 Dashboard</button></Link>
                            <Link to="/transfer"><button style={{ padding: '8px' }}>💸 Transfer</button></Link>
                            <Link to="/history"><button style={{ padding: '8px' }}>🏛️ History</button></Link>
                            <Link to="/exchange"><button style={{ padding: '8px' }}>💱 Exchange</button></Link>
                            <button onClick={handleLogout} style={{ padding: '8px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px' }}>
                                Log Out
                            </button>
                        </div>
                        <Dashboard />
                    </div>
                ) : <Navigate to="/" />
            } />

            {/* TRANSFER */}
            <Route path="/transfer" element={
                isLoggedIn ? (
                    <div style={{ textAlign: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
                        <h1>🏛️ Ancient Bank</h1>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                            <Link to="/dashboard"><button style={{ padding: '8px' }}>💳 Dashboard</button></Link>
                            <Link to="/transfer"><button style={{ padding: '8px' }}>💸 Transfer</button></Link>
                            <Link to="/history"><button style={{ padding: '8px' }}>🏛️ History</button></Link>
                            <Link to="/exchange"><button style={{ padding: '8px' }}>💱 Exchange</button></Link>
                            <button onClick={handleLogout} style={{ padding: '8px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px' }}>
                                Log Out
                            </button>
                        </div>
                        <Transfer />
                    </div>
                ) : <Navigate to="/" />
            } />

            {/* HISTORY */}
            <Route path="/history" element={
                isLoggedIn ? (
                    <div style={{ textAlign: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
                        <h1>🏛️ Ancient Bank</h1>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                            <Link to="/dashboard"><button style={{ padding: '8px' }}>💳 Dashboard</button></Link>
                            <Link to="/transfer"><button style={{ padding: '8px' }}>💸 Transfer</button></Link>
                            <Link to="/history"><button style={{ padding: '8px' }}>🏛️ History</button></Link>
                            <Link to="/exchange"><button style={{ padding: '8px' }}>💱 Exchange</button></Link>
                            <button onClick={handleLogout} style={{ padding: '8px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px' }}>
                                Log Out
                            </button>
                        </div>
                        <History />
                    </div>
                ) : <Navigate to="/" />
            } />

            {/* EXCHANGE */}
            <Route path="/exchange" element={
                isLoggedIn ? (
                    <div style={{ textAlign: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
                        <h1>🏛️ Ancient Bank</h1>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                            <Link to="/dashboard"><button style={{ padding: '8px' }}>💳 Dashboard</button></Link>
                            <Link to="/transfer"><button style={{ padding: '8px' }}>💸 Transfer</button></Link>
                            <Link to="/history"><button style={{ padding: '8px' }}>🏛️ History</button></Link>
                            <Link to="/exchange"><button style={{ padding: '8px' }}>💱 Exchange</button></Link>
                            <button onClick={handleLogout} style={{ padding: '8px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px' }}>
                                Log Out
                            </button>
                        </div>
                        <Exchange />
                    </div>
                ) : <Navigate to="/" />
            } />
        </Routes>
    );
}

export default App