import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Podpięcie nowego pliku ze stylami

function Register() {
    const navigate = useNavigate();

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
        <div className="split-layout">
            {/* Lewa strona - Branding */}
            <div className="split-left">
                <div className="split-logo">Ancient Bank</div>
            </div>

            {/* Prawa strona - Formularz rejestracji */}
            <div className="split-right">
                <div className="form-wrapper">
                    
                    <div className="form-header">
                        <h2>Create your account</h2>
                        <p>Let's get you started. We'll ask for a few details to create and secure your account.</p>
                    </div>

                    <form onSubmit={handleRegister} className="auth-form">
                        <div className="input-group">
                            <label>Username</label>
                            <input 
                                type="text" 
                                placeholder="Enter your username" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required 
                            />
                        </div>

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

                        <button type="submit" className="btn-submit">
                            Create Account
                        </button>
                    </form>

                    {message && <p className="error-message">{message}</p>}

                    <div className="form-footer">
                        Already have an account? <span className="link-text" onClick={() => navigate('/login')}>Log in</span>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Register;
