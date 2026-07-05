import { useState } from 'react';
import './App.css';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
    // checking if we have a token
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwt_token'));

    const handleLogout = () => {
		localStorage.removeItem('jwt_token'); // getting rid of the token
		setIsLoggedIn(false); // changing the state to logged-out
    };

    return (
        <div style={{ textAlign: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
			<h1>🏦 Ancient Bank</h1>
			
			{/* view logic */}
			{!isLoggedIn ? (
				// if not logged in, show signing-in view
				<Login onLoginSuccess={() => setIsLoggedIn(true)} />
			) : (
				// if logged in, show the dashboard and a button to log out
				<div>
					<button onClick={handleLogout} style={{ marginBottom: '20px', padding: '8px', cursor: 'pointer' }}>
						Log Out
					</button>
					<Dashboard />
				</div>
			)}
		</div>
    )
}

export default App