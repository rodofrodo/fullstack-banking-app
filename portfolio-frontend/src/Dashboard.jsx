import { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
    const [accountMessage, setAccountMessage] = useState('');
    const [accounts, setAccounts] = useState([]);

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

    useEffect(() => {
        fetchAccounts();
    }, []);

    // creating a bank account
    const handleCreateAccount = async () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            setAccountMessage('❌ No token! You need to sign in first.');
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
                setAccountMessage('❌ Denied: ' + error.response.data);
            } else {
                setAccountMessage('❌ Server connection error.');
            }
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '20px auto', fontFamily: 'sans-serif' }}>

            {/* Account Creation Panel */}
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
                                style={{ 
                                    padding: '12px', 
                                    border: '2px solid #ffeeba', 
                                    borderRadius: '8px', 
                                    backgroundColor: '#fff',
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
        </div>
    );
}

export default Dashboard;
