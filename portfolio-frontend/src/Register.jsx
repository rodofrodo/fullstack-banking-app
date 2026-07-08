import { useState } from 'react';
import axios from 'axios';

function Register({ navigateTo }) {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:8080/api/users', {
				username: username,
				email: email,
				password: password
            });

            setMessage('✅ Account created! You can log in now.');
            setUsername('');
            setEmail('');
            setPassword('');
          
        } catch (error) {
            if (error.response) {
              setMessage('❌ Error: ' + (error.response.data || 'check data.'));
            } else {
              setMessage('❌ Network error.');
            }
        }
    };

    return (
		<div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', maxWidth: '300px', margin: '20px auto', fontFamily: 'sans-serif' }}>
			<h2>Sign-up Page</h2>
			
			<form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
			<input 
				type="text" 
				placeholder="Username" 
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				required 
			/>
			<input 
				type="email" 
				placeholder="Email" 
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required 
			/>
			<input 
				type="password" 
				placeholder="Password" 
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required 
			/>
			<button type="submit" style={{ cursor: 'pointer', padding: '8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
				Sign Up
			</button>
			</form>

			{message && <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{message}</p>}

			<button 
				onClick={() => navigateTo('home')} 
				style={{ marginTop: '20px', cursor: 'pointer', background: 'none', border: 'none', color: '#007bff', textDecoration: 'underline' }}>
				⬅️ Go back to Home Page
			</button>
		</div>
    );
}

export default Register;
