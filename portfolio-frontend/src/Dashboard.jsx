import { useState } from 'react';
import axios from 'axios';

function Dashboard() {
    const [fromAccount, setFromAccount] = useState('');
    const [toAccount, setToAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');

    const handleTransfer = async (e) => {
        e.preventDefault();

        // we get our token from localStorage
        const token = localStorage.getItem('jwt_token');

        if (!token) {
            setMessage('❌ No token! You need to sign in first.');
            return;
        }

        try {
            // transfering money
            const response = await axios.post(
                'http://localhost:8080/api/accounts/transfer',
                {
                    fromAccountNumber: fromAccount,
                    toAccountNumber: toAccount,
                    amount: parseFloat(amount)
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + token // we add token to the inquiry
                    }
                }
            );

        // success - server has received data
        setMessage('✅ ' + response.data);
        
        } catch (error) {
            if (error.response) {
                setMessage('❌ Denied: ' + error.response.data);
            } else {
                setMessage('❌ Server connection error.');
            }
        }
    };

    return (
        <div style={{ 
            border: '1px solid #007bff', 
            padding: '20px', 
            borderRadius: '8px', 
            maxWidth: '400px', 
            margin: '20px auto', 
            backgroundColor: '#f9fcfb' 
        }}>
            <h2 style={{ color: '#007bff', marginTop: 0 }}>Transfer Dashboard</h2>
            
            <form onSubmit={handleTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                    type="text" 
                    placeholder="From (your bank account number)" 
                    value={fromAccount}
                    onChange={(e) => setFromAccount(e.target.value)}
                    required 
                />
                <input 
                    type="text" 
                    placeholder="To (receiver's bank account number)" 
                    value={toAccount}
                    onChange={(e) => setToAccount(e.target.value)}
                    required 
                />
                <input 
                    type="number" 
                    step="0.01"
                    placeholder="Amount (PLN)" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required 
                />
                <button type="submit" style={{ 
                    cursor: 'pointer', 
                    padding: '10px', 
                    backgroundColor: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px' 
                }}>
                    Transfer money
                </button>
            </form>

            {message && <p style={{ marginTop: '15px', fontWeight: 'bold', color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}
        </div>
    );
}

export default Dashboard;
