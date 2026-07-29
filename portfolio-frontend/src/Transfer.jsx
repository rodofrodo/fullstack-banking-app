import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatAccountNumber } from './global/utils';

function Transfer() {
    // transfer form states
    const [accounts, setAccounts] = useState([]);
    const [fromAccount, setFromAccount] = useState('');
    const [toAccount, setToAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('PLN');

    // we use 'useEffect' to fetch the user's accounts when the component mounts
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const token = localStorage.getItem('jwt_token');
                const response = await axios.get('http://localhost:8080/api/accounts/my', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setAccounts(response.data);
                // Ustawiamy domyślnie pierwsze konto na liście jako nadawcę
                if (response.data.length > 0)
                    setFromAccount(response.data[0].accountNumber);
            } catch (error) {
                console.error("Could not fetch accounts:", error);
            }
        };
        fetchAccounts();
    }, []);

    // handle the transfer form submission
    const handleTransfer = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('jwt_token');
            const response = await axios.post('http://localhost:8080/api/accounts/transfer', {
                fromAccountNumber: fromAccount,
                toAccountNumber: toAccount.replace(/\s/g, ''), // IMPORTANT
                amount: amount,
                currency: currency
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            alert(response.data);
            setAmount('');
            setToAccount('');
            
            // refresh the website
            setSearchAccount(fromAccount); 
            window.location.reload(); 
        } catch (error) {
            alert(error.response?.data || 'Transfer error');
        }
    };

    return (
        <div style={{ maxWidth: '850px', margin: '20px auto', fontFamily: 'sans-serif' }}>
            <div style={{ border: '1px solid #007bff', borderRadius: '8px', padding: '20px', marginTop: '20px', backgroundColor: '#f8fbff' }}>
                <h2 style={{ color: '#007bff', marginTop: 0, textAlign: 'center' }}>Transfer Dashboard</h2>
                <form onSubmit={handleTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>              
                    {/* List of user's accounts */}
                    <select 
                        value={fromAccount} 
                        onChange={(e) => setFromAccount(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        required
                    >
                        <option value="" disabled>Select your account to send from...</option>
                        {accounts.map(acc => (
                            <option key={acc.id} value={acc.accountNumber}>
                                {formatAccountNumber(acc.accountNumber)}
                            </option>
                        ))}
                    </select>

                    <input 
                        type="text" 
                        placeholder="To (receiver's bank account number)" 
                        value={toAccount} 
                        onChange={(e) => {
                            const formatted = formatAccountNumber(e.target.value);
                            setToAccount(formatted);
                        }} 
                        required
                    />
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            type="number" 
                            step="0.01"
                            placeholder="Amount" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            style={{ flex: '2', padding: '8px' }}
                            required
                        />
                        <select 
                            value={currency} 
                            onChange={(e) => setCurrency(e.target.value)}
                            style={{ flex: '1', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="PLN">PLN</option>
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                            <option value="CHF">CHF</option>
                            <option value="GBP">GBP</option>
                        </select>
                    </div>

                    <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Transfer money
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Transfer;
