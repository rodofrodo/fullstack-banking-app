import { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
    // here React "remembers" what we type in
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    // this launches after clicking "log in"
    const handleLogin = async (e) => {
        e.preventDefault(); // blocks refreshing the website by the browser

        try {
            // we send inquiry to Java
            const response = await axios.post('http://localhost:8080/api/users/login', {
                email: email,
                password: password
            });

            // if login is successful, we receive JWT and store it in localStorage
            const token = response.data;
            localStorage.setItem('jwt_token', token);

            // success on the screen
            setMessage('✅ Successfully logged in! (token saved)');
            onLoginSuccess();
        } catch (error) {
            setMessage('❌ Login error: Check email and password.');
        }
    };

    return (
        <div style={{
            border: '1px solid #ccc',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '300px',
            margin: '20px auto'
        }}>
            <h2>Logowanie</h2>
            <form onSubmit={handleLogin} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type='submit' style={{ cursor: 'pointer', padding: '8px' }}>
                    Sign In
                </button>
            </form>
            {/* message (if need be) */}
            { message && <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{message}</p> }
        </div>
    );
}

export default Login;
