import { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login({ onLoginSuccess, navigateTo }) {
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
        <div className="split-layout">
            {/* left side - branding */}
            <div className="split-left">
                <div className="split-logo">Ancient Bank</div>
            </div>

            {/* right side - log in form */}
            <div className="split-right">
                <div className="form-wrapper">
                    
                    <div className="form-header">
                        <h2>Sign into your account</h2>
                        <p>Every great goal begins with one login.</p>
                    </div>

                    <form onSubmit={handleLogin} className="auth-form">
                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="forgot-password">
                            <span className="link-text">Forgot password?</span>
                        </div>

                        <button type="submit" className="btn-submit">
                            Sign in
                        </button>
                    </form>

                    {message && <p className="error-message">{message}</p>}

                    <div className="help-links">
                        Can't sign in? <span className="link-text">Reset password</span>
                    </div>

                    <div className="form-footer">
                        Don't have an account? <span className="link-text" onClick={() => navigateTo('register')}>Sign up</span>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Login;
