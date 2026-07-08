import { useState } from 'react';
import './App.css';
import Login from './Login';
import Dashboard from './Dashboard';
import Home from './Home';
import Register from './Register';

function App() {
    // checking if we have a token
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwt_token'));
  	const [currentView, setCurrentView] = useState('home'); // also: 'login', 'register'

    const handleLogout = () => {
		localStorage.removeItem('jwt_token'); // getting rid of the token
		setIsLoggedIn(false); // changing the state to logged-out
		setCurrentView('home'); // returning to the home view
    };

    if (isLoggedIn) {
		return (
		<div style={{ textAlign: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
			<h1>🏛️ Ancient Bank</h1>
			<button onClick={handleLogout} style={{ marginBottom: '20px', padding: '8px', cursor: 'pointer' }}>
				Log Out
			</button>
			<Dashboard />
		</div>
		);
	}

	// else: home, login, register
	return (
		<div>
			{currentView === 'home' && <Home navigateTo={setCurrentView} />}	
			{currentView === 'login' && (
				<Login 
				onLoginSuccess={() => setIsLoggedIn(true)} 
				navigateTo={setCurrentView} // that allows Login to view home page
				/>
			)}
			{currentView === 'register' && <Register navigateTo={setCurrentView} />}
		</div>
	);
}

export default App