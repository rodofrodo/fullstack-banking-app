import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CurrencyWidget from './CurrencyWidget';

function Exchange() {
    const [accounts, setAccounts] = useState([]);
    const [fromAccount, setFromAccount] = useState('');
    const [exchangeSourceCurrency, setExchangeSourceCurrency] = useState('PLN');
    const [exchangeTargetCurrency, setExchangeTargetCurrency] = useState('EUR');
    const [exchangeAmount, setExchangeAmount] = useState('');

    // fetch user's accounts when the component mounts
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const token = localStorage.getItem('jwt_token');
                const response = await axios.get('http://localhost:8080/api/accounts/my', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setAccounts(response.data);
                if (response.data.length > 0)
                    setFromAccount(response.data[0].accountNumber);
            } catch (error) {
                console.error("Could not fetch accounts:", error);
            }
        };
        fetchAccounts();
    }, []);

    // handle the exchange form submission
    const handleExchange = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('jwt_token');
            const response = await axios.post('http://localhost:8080/api/accounts/exchange', {
                accountNumber: fromAccount,
                sourceCurrency: exchangeSourceCurrency,
                targetCurrency: exchangeTargetCurrency,
                amount: exchangeAmount
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            alert(response.data);
            setExchangeAmount('');
        } catch (error) {
            alert(error.response?.data || 'Exchange error');
        }
    };

    return (
        <div style={{ border: '2px solid #ffc107', borderRadius: '8px', padding: '25px', marginTop: '20px', backgroundColor: '#fffdf6', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h2 style={{ color: '#d39e00', marginTop: 0, textAlign: 'center', marginBottom: '25px' }}>💱 Currency Exchange</h2>
            
            <CurrencyWidget />

            <form onSubmit={handleExchange} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                {/* List of user's accounts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left' }}>
                    <label style={{ fontSize: '13px', color: '#555', fontWeight: 'bold' }}>Select your bank account:</label>
                    <select 
                        value={fromAccount} 
                        onChange={(e) => setFromAccount(e.target.value)}
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' }}
                        required
                    >
                        <option value="" disabled>Choose account...</option>
                        {accounts.map(acc => (
                            <option key={acc.id} value={acc.accountNumber}>
                                {acc.accountNumber}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Amount to sell */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left' }}>
                    <label style={{ fontSize: '13px', color: '#555', fontWeight: 'bold' }}>Amount to sell:</label>
                    <input 
                        type="number" 
                        step="0.01"
                        placeholder="e.g. 100.00" 
                        value={exchangeAmount} 
                        onChange={(e) => setExchangeAmount(e.target.value)} 
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        required
                    />
                </div>
                
                {/* Currency pairs */}
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, textAlign: 'left' }}>
                        <label style={{ fontSize: '13px', color: '#555', fontWeight: 'bold' }}>From Currency:</label>
                        <select 
                            value={exchangeSourceCurrency} 
                            onChange={(e) => setExchangeSourceCurrency(e.target.value)}
                            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' }}
                        >
                            <option value="PLN">PLN</option>
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                            <option value="CHF">CHF</option>
                            <option value="GBP">GBP</option>
                        </select>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, textAlign: 'left' }}>
                        <label style={{ fontSize: '13px', color: '#555', fontWeight: 'bold' }}>To Currency:</label>
                        <select 
                            value={exchangeTargetCurrency} 
                            onChange={(e) => setExchangeTargetCurrency(e.target.value)}
                            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' }}
                        >
                            <option value="PLN">PLN</option>
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                            <option value="CHF">CHF</option>
                            <option value="GBP">GBP</option>
                        </select>
                    </div>
                </div>

                <button type="submit" style={{ padding: '12px', backgroundColor: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px', fontSize: '16px' }}>
                    Exchange Now
                </button>
            </form>
        </div>
    );
}

export default Exchange;
