import { useState } from 'react';
import './App.css';
import Login from './Login';
import Dashboard from './Dashboard';
import Home from './Home';
import Register from './Register';
import Transfer from './Transfer';
import History from './History';
import Exchange from './Exchange';
import { Routes, Route, Navigate, useNavigate, Link, NavLink } from 'react-router-dom';

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
        <div>
            {/* main nav panel */}
            {isLoggedIn && (
                <div className="nav-container">
                    <div className='nav-logo'>Ancient Bank</div>
                    <div className="nav-buttons-wrapper">
                        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            Dashboard
                        </NavLink>
                        
                        <NavLink to="/transfer" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            Transfer
                        </NavLink>
                        
                        <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            History
                        </NavLink>
                        
                        <NavLink to="/exchange" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            Exchange
                        </NavLink>
                        
                        <button onClick={handleLogout} className="nav-link logout-btn">
                            Log Out
                        </button>
                    </div>
                </div>
            )}

            {/* routing system */}
            <Routes>
                {/* public routes */}
                <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Home />} />
                <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={() => setIsLoggedIn(true)} />} />
                <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />} />
                
                {/* private routes (require login) */}
                <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
                <Route path="/transfer" element={isLoggedIn ? <Transfer /> : <Navigate to="/" />} />
                <Route path="/history" element={isLoggedIn ? <History /> : <Navigate to="/" />} />
                <Route path="/exchange" element={isLoggedIn ? <Exchange /> : <Navigate to="/" />} />
            </Routes>
        </div>
    );
}

export default App;