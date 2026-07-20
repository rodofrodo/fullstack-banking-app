import { useEffect, useEffectEvent, useState } from 'react';
import axios from 'axios';
import CurrencyWidget from './CurrencyWidget';

function Dashboard() {
    const [fromAccount, setFromAccount] = useState('');
    const [toAccount, setToAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [accountMessage, setAccountMessage] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [currency, setCurrency] = useState('PLN');

    const fetchAccounts = async () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return;

        try {
            const response = await axios.get(
                'http://localhost:8080/api/accounts/my',
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            );
            setAccounts(response.data);
        } catch (error) {
            console.error("Cannot download the accounts: ", error);
        }
    };

    // downloading the history from backend
    const fetchHistory = async (accountNum) => {
        if (!accountNum) return;
        const token = localStorage.getItem('jwt_token');

        try {
            const response = await axios.get(
                `http://localhost:8080/api/accounts/transactions/${accountNum}`,
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            );

            if (Array.isArray(response.data))
                setTransactions(response.data);
        } catch (error) {
            console.error("Cannot download the history: ", error);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    useEffect(() => {
        fetchHistory(fromAccount);
    }, [fromAccount]);

    // creating a bank account
    const handleCreateAccount = async () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            setMessage('❌ No token! You need to sign in first.');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8080/api/accounts/create',
                {},
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            );

            setAccountMessage('✅ ' + response.data);
            fetchAccounts();
        } catch (error) {
            if (error.response) {
                setMessage('❌ Denied: ' + error.response.data);
            } else {
                setMessage('❌ Server connection error.');
            }
        }
    };

    // transfering money
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
                    amount: parseFloat(amount),
                    currency: currency
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + token // we add token to the inquiry
                    }
                }
            );

            // success - server has received data
            setMessage('✅ ' + response.data);
            setAmount('');

            // update
            fetchAccounts();
            fetchHistory(fromAccount);
        
        } catch (error) {
            if (error.response) {
                setMessage('❌ Denied: ' + error.response.data);
            } else {
                setMessage('❌ Server connection error.');
            }
        }
    };

    // method for formatting in a browser
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' });
    };

    return (
        <div style={{ maxWidth: '600px', margin: '20px auto', fontFamily: 'sans-serif' }}>

            <CurrencyWidget/>

            {/* Account Creation Panel (NOWY BLOK) */}
            <div style={{ 
                border: '1px solid #ffc107', 
                padding: '20px', 
                borderRadius: '8px', 
                maxWidth: '400px', 
                margin: '20px auto', 
                backgroundColor: '#fffdf6' 
            }}>
                <h2 style={{ color: '#d39e00', marginTop: 0 }}>My Accounts</h2>

                {/* list of accounts */}
                {accounts.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                        {accounts.map(acc => (
                            <div 
                                key={acc.id} 
                                // trick: after clicking an account, its number is going to be set in the form!
                                onClick={() => setFromAccount(acc.accountNumber)}
                                style={{ 
                                    padding: '12px', 
                                    border: '2px solid #ffeeba', 
                                    borderRadius: '8px', 
                                    backgroundColor: '#fff',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}>
                                <div style={{ textAlign: 'left' }}>
                                    <span style={{ display: 'block', fontSize: '12px', color: '#888' }}>Account number</span>
                                    <strong style={{ fontSize: '14px', color: '#333' }}>{acc.accountNumber}</strong>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '2px' }}>Balances</span>
                                    {/* we iterate over the wallets array instead of the removed acc.balance */}
                                    {acc.wallets && acc.wallets.map(wallet => (
                                        <strong key={wallet.currency} style={{ display: 'block', fontSize: '16px', color: '#28a745' }}>
                                            {wallet.balance} {wallet.currency}
                                        </strong>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: '#666', fontStyle: 'italic' }}>You don't have any accounts yet.</p>
                )}

                <button 
                    onClick={handleCreateAccount} 
                    style={{ 
                        cursor: 'pointer', 
                        padding: '10px 15px', 
                        backgroundColor: '#ffc107', 
                        color: '#333', 
                        border: 'none', 
                        borderRadius: '5px',
                        fontWeight: 'bold',
                        width: '100%'
                    }}>
                    ➕ Open new bank account
                </button>
                {accountMessage && <p style={{ marginTop: '15px', fontWeight: 'bold', color: accountMessage.includes('✅') ? 'green' : 'red' }}>{accountMessage}</p>}
            </div>

            {/* Transfer Panel */}
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
                        placeholder="Amount" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required 
                    />

                    {/* --- Currency Selection --- */}
                    <select 
                        value={currency} 
                        onChange={(e) => setCurrency(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="PLN">PLN</option>
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                        <option value="CHF">CHF</option>
                        <option value="GBP">GBP</option>
                    </select>

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

            {/* History Panel */}
            <div style={{ 
                border: '1px solid #28a745', 
                padding: '20px', 
                borderRadius: '8px', 
                backgroundColor: '#fafffa' 
            }}>
                <h3 style={{ color: '#28a745', marginTop: 0 }}>📋 History of transactions for this account</h3>
                
                {transactions.length === 0 ? (
                    <p style={{ color: '#666', fontStyle: 'italic' }}>No registered transactions or wrong account number.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', textAlign: 'left' }}>
                        <thead>
                        <tr style={{ borderBottom: '2px solid #28a745', color: '#555' }}>
                            <th style={{ padding: '8px' }}>Date</th>
                            <th style={{ padding: '8px' }}>Type</th>
                            <th style={{ padding: '8px' }}>Associated account</th>
                            <th style={{ padding: '8px', textAlign: 'right' }}>Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.map((t) => {
                            // checking whether the transfer was outgoing or incoming to our account
                            const isOutgoing = t.senderAccountNumber === fromAccount;
                            return (
                            <tr key={t.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '8px', fontSize: '14px' }}>{formatDate(t.timestamp)}</td>
                                <td style={{ padding: '8px', fontWeight: 'bold', color: isOutgoing ? '#dc3545' : '#28a745' }}>
                                {isOutgoing ? 'OUTGOING' : 'INCOMING'}
                                </td>
                                <td style={{ padding: '8px', fontSize: '14px', color: '#555' }}>
                                {isOutgoing ? `To: ${t.receiverAccountNumber}` : `From: ${t.senderAccountNumber}`}
                                </td>
                                <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold', color: isOutgoing ? '#dc3545' : '#28a745' }}>
                                {isOutgoing ? `-${t.amount}` : `+${t.amount}`} {t.currency}
                                </td>
                            </tr>
                            );
                        })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
