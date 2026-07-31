import { useState } from 'react';
import './App.css';
import Login from './Login';
import Dashboard from './Dashboard';
import Home from './Home';
import Register from './Register';
import Transfer from './Transfer';
import History from './History';
import Exchange from './Exchange';
import AdminDashboard from './AdminDashboard';
import CreateAccount from './CreateAccount';
import { Routes, Route, Navigate, useNavigate, Link, NavLink, useLocation } from 'react-router-dom';

const getRoleFromToken = (token) => {
    if (!token) return null;
    try {
        const payload = token.split('.')[1]; // middle part
        const decoded = JSON.parse(atob(payload));
        return decoded.role || 'ROLE_USER';
    } catch (error) {
        return null;
    }
};

function App() {
    // token in local storage
    const [token, setToken] = useState(localStorage.getItem('jwt_token'));
    const navigate = useNavigate();
    const location = useLocation();

    const isLoggedIn = !!token;
    const role = getRoleFromToken(token); // the role

    const handleLogout = () => {
        localStorage.removeItem('jwt_token'); // getting rid of the token
        setToken(null); // changing the state to logged-out
        navigate('/'); // redirecting to the home page
    };

    const handleLoginSuccess = () => {
        const newToken = localStorage.getItem('jwt_token');
        setToken(newToken);

        const newRole = getRoleFromToken(newToken);
        if (newRole === 'ROLE_ADMIN')
            navigate('/admin/dashboard');
        else
            navigate('/u/dashboard');
    };

    return (
        <div>
            {/* ======================================= */}
            {/*         MENU FOR A REGULAR USER         */}
            {/* ======================================= */}
            {isLoggedIn && role !== 'ROLE_ADMIN' && location.pathname !== '/u/create-account' && (
                <div className="nav-container">
                    <div className='nav-logo'>Ancient Bank</div>
                    <div className="nav-buttons-wrapper">
                        <NavLink to="/u/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
                        <NavLink to="/u/transfer" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Transfer</NavLink>
                        <NavLink to="/u/history" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>History</NavLink>
                        <NavLink to="/u/exchange" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Exchange</NavLink> 
                        <button onClick={handleLogout} className="nav-link logout-btn">Log Out</button>
                    </div>
                </div>
            )}

            {/* ======================================= */}
            {/*       MENU FOR THE ADMINISTRATOR        */}
            {/* ======================================= */}
            {isLoggedIn && role === 'ROLE_ADMIN' && (
                <div className="nav-container">
                    <div className='nav-logo'>Ancient Bank</div>
                    <div className="nav-buttons-wrapper">
                        {/* specifically for admins */}
                        <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
                        <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Users</NavLink>
                        <button onClick={handleLogout} className="nav-link logout-btn">Log Out</button>
                    </div>
                </div>
            )}

            {/* routing system */}
            <Routes>
                {/* public */}
                <Route path="/" element={
                    !isLoggedIn ? <Home /> : (role === 'ROLE_ADMIN' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/u/dashboard" />)
                } />
                <Route path="/login" element={!isLoggedIn ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />} />
                <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/" />} />
                
                {/* user */}
                <Route path="/u/dashboard" element={isLoggedIn && role !== 'ROLE_ADMIN' ? <Dashboard /> : <Navigate to="/" />} />
                <Route path="/u/transfer" element={isLoggedIn && role !== 'ROLE_ADMIN' ? <Transfer /> : <Navigate to="/" />} />
                <Route path="/u/history" element={isLoggedIn && role !== 'ROLE_ADMIN' ? <History /> : <Navigate to="/" />} />
                <Route path="/u/exchange" element={isLoggedIn && role !== 'ROLE_ADMIN' ? <Exchange /> : <Navigate to="/" />} />

                {/* sub routes */}
                <Route path="/u/create-account" element={isLoggedIn && role !== 'ROLE_ADMIN' ? <CreateAccount /> : <Navigate to="/" />} />

                {/* admin */}
                <Route path="/admin/dashboard" element={isLoggedIn && role === 'ROLE_ADMIN' ? <AdminDashboard /> : <Navigate to="/" />} />
                <Route path="/admin/users" element={
                    isLoggedIn && role === 'ROLE_ADMIN' 
                    ? <div style={{textAlign: 'center', marginTop: '50px'}}><h2>List of clients</h2></div> 
                    : <Navigate to="/" />
                } />
            </Routes>
        </div>
    );
}

export default App;