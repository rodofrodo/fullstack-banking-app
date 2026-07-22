import React, { useState, useEffect } from 'react';
import axios from 'axios';

function History() {
    // vars
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [searchAccount, setSearchAccount] = useState('');

    // downloading user's accounts when the component mounts
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const token = localStorage.getItem('jwt_token');
                const response = await axios.get('http://localhost:8080/api/accounts/my', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setAccounts(response.data);
                // bla bla
                if (response.data.length > 0)
                    setFromAccount(response.data[0].accountNumber);
            } catch (error) {
                console.error("Could not fetch accounts:", error);
            }
        };
        fetchAccounts();
    }, []);

    // downloading transactions for the selected account when searchAccount changes
    useEffect(() => {
        const fetchTransactions = async () => {
            if (!searchAccount) return;
            try {
                const token = localStorage.getItem('jwt_token');
                const response = await axios.get(`http://localhost:8080/api/accounts/transactions/${searchAccount}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (typeof response.data === 'string') {
                    setTransactions([]); // Obsługa błędów tekstowych z backendu
                } else {
                    setTransactions(response.data);
                }
            } catch (error) {
                setTransactions([]);
            }
        };
        fetchTransactions();
    }, [searchAccount]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div>
            <div style={{ border: '1px solid #28a745', borderRadius: '8px', padding: '20px', marginTop: '20px', backgroundColor: '#f9fff9' }}>
                <h3 style={{ color: '#28a745', marginTop: 0 }}>📋 History of transactions for this account</h3>
                
                {/* account selection */}
                <select 
                    value={searchAccount} 
                    onChange={(e) => setSearchAccount(e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', marginBottom: '15px' }}
                >
                    <option value="" disabled>Select account to view history...</option>
                    {accounts.map(acc => (
                        <option key={acc.id} value={acc.accountNumber}>
                            {acc.accountNumber}
                        </option>
                    ))}
                </select>

                {transactions.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#e9ecef' }}>
                                <th style={{ padding: '8px' }}>Date</th>
                                <th style={{ padding: '8px' }}>Type</th>
                                <th style={{ padding: '8px' }}>Details</th>
                                <th style={{ padding: '8px', textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((t) => {
                                const isOutgoing = t.senderAccountNumber === searchAccount;
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
                ) : (
                    <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center' }}>No registered transactions.</p>
                )}
            </div>
        </div>
    );
}

export default History;
