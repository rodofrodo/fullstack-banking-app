import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CreateAccount() {
    const navigate = useNavigate();

    // form states
    const [accountType, setAccountType] = useState('PERSONAL');
    const [isMultiCurrency, setIsMultiCurrency] = useState(false);
    const [baseCurrency, setBaseCurrency] = useState('PLN');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt_token');
        if (!token) return;

        try {
            const payload = {
                accountType,
                isMultiCurrency,
                baseCurrency
            };

            // POST request to create a new account
            const response = await axios.post(
                'http://localhost:8080/api/accounts/create',
                payload,
                { headers: { Authorization: 'Bearer ' + token } }
            );
            
            alert('Account created successfully');
            navigate('/u/dashboard'); // Redirect to dashboard after successful account creation

        } catch (error) {
            console.error("Error creating account: ", error);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h2 style={{ textAlign: 'center', color: '#004085', marginBottom: '10px' }}>Open a new account</h2>
            <p style={{ textAlign: 'center', color: '#6c757d', marginBottom: '30px' }}>Choose the product that best fits your needs.</p>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <label style={{ fontWeight: 'bold' }}>
                    Account type:
                    <select 
                        value={accountType} 
                        onChange={e => setAccountType(e.target.value)} 
                        style={{ width: '100%', padding: '10px', marginTop: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="PERSONAL">Personal Account (debit card)</option>
                        <option value="BUSINESS">Business Account (low interest rates on loans)</option>
                        <option value="POCKET">Pocket Account (0.1% monthly profit)</option>
                        <option value="SAVINGS">Savings Account (3% annually)</option>
                        <option value="BONDS">Bonds Account (5% + inflation, frozen for 5 years)</option>
                    </select>
                </label>

                <label style={{ fontWeight: 'bold' }}>
                    Base Currency:
                    <select 
                        value={baseCurrency} 
                        onChange={e => setBaseCurrency(e.target.value)} 
                        style={{ width: '100%', padding: '10px', marginTop: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="PLN">PLN - Polish Złoty</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="CHF">CHF - Swiss Franc</option>
                        <option value="GBP">GBP - British Pound</option>
                    </select>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                    <input 
                        type="checkbox" 
                        checked={isMultiCurrency} 
                        onChange={(e) => setIsMultiCurrency(e.target.checked)} 
                        style={{ width: '20px', height: '20px' }}
                    />
                    Multi-Currency Account (allows free exchange at the exchange office)
                </label>

                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                    <button 
                        type="button" 
                        onClick={() => navigate('/u/dashboard')} 
                        style={{ flex: 1, padding: '12px', backgroundColor: '#f8f9fa', color: '#333', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        style={{ flex: 2, padding: '12px', backgroundColor: '#ffc107', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Open an account
                    </button>
                </div>
            </form>
        </div>
    );
};
