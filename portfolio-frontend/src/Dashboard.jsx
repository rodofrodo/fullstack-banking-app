import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { formatAccountNumber, formatBalance } from './global/utils';
import { useNavigate } from 'react-router-dom';
import mastercardLogo from './assets/mastercard-logo.png';
import './Dashboard.css';

function Dashboard() {
    const [accounts, setAccounts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();

    // new states
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const fetchAccounts = async () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return;

        try {
            const response = await axios.get(
                'http://localhost:8080/api/accounts/my',
                { headers: { Authorization: 'Bearer ' + token } }
            );
            setAccounts(response.data);

            // we choose the first account automatically
            if (response.data.length > 0)
                setCurrentPage(0);
        } catch (error) {
            console.error("Cannot download the accounts: ", error);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const hasAnyCard = accounts.some(acc => acc.paymentCard != null);

    const getAccountTypeName = (type) => {
        switch (type) {
            case 'PERSONAL': return 'Personal account';
            case 'BUSINESS': return 'Business account';
            case 'POCKET': return 'Pocket account';
            case 'SAVINGS': return 'Savings account';
            case 'BONDS': return 'Bonds account';
            default: return 'Standard account';
        };
    };

    const getAccountGradient = (type) => {
        switch (type) {
            case 'PERSONAL': return 'linear-gradient(135deg, #FF828235, #008CFF35)';
            case 'BUSINESS': return 'linear-gradient(135deg, #FF45DD35, #002BFF35)';
            case 'POCKET': return 'linear-gradient(135deg, #00FFE135, #1EFF0035)';
            case 'SAVINGS': return 'linear-gradient(135deg, #82FFF035, #008CFF35)';
            case 'BONDS': return 'linear-gradient(135deg, #FB00FF35, #FF6A0035)';
            default: return 'linear-gradient(135deg, #f4f7fb, #e2e8f0)';
        };
    };

    const handleCardClick = (acc) => {
        // Blokujemy nawigację, jeśli użytkownik tylko przesuwał karuzelę
        navigate(`/u/account/${acc.id}`, { state: { account: acc } });
    };

    const itemsToDisplay = [...accounts, { isNewAccountButton: true, id: 'add-new-btn' }];
    const itemsPerPage = 3;
    const totalPages = Math.ceil(itemsToDisplay.length / itemsPerPage);
    const currentItems = itemsToDisplay.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div className='dashboard-container'>
            <div className='bank-accounts-section'>
                <h2 className='section-title'>
                    Bank accounts
                </h2>

                {/* carousel container with scroll and mouse events */}
                <div style={{ 
                        display: 'flex', 
                        gap: '15px',
                    }}
                >
                    {currentItems.map((item) => {
                        if (item.isNewAccountButton) {
                            return (
                                <div 
                                    className='account-card new-account-card'
                                    onClick={() => { if (!isDragging) navigate('/u/create-account'); }}
                                    style={{
                                        
                                    }}
                                >
                                    <div style={{ fontSize: '36px', fontWeight: '300', marginBottom: '10px' }}>+</div>
                                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Open new account</div>
                                </div>
                            );
                        }

                        const acc = item;
                        const mainWallet = acc.wallets && acc.wallets.length > 0 ? acc.wallets[0] : { balance: 0, currency: 'PLN' };
                        const bg = getAccountGradient(acc.accountType);

                        return (
                            <div 
                                className='account-card'
                                key={acc.id} 
                                onClick={() => handleCardClick(acc)}
                                style={{ background: bg }}
                            >
                                <div className='account-card-info'>
                                    <div className='account-card-label'>
                                        {getAccountTypeName(acc.accountType)}
                                    </div>
                                    <div className='account-card-balance'>
                                        {formatBalance(mainWallet.balance)} 
                                        {` ${mainWallet.currency}`}
                                    </div>
                                </div>
                                
                                <div className='payment-card'>
                                    {acc.paymentCard ? (
                                        <div className='payment-card-info'>
                                            <img src={mastercardLogo} alt="Mastercard Logo" width="32"
                                                style={{ marginTop: '4px' }}
                                            />
                                            <p className='payment-card-number'>
                                                **** {acc.paymentCard.cardNumber.slice(-4)}
                                            </p>
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: '12px', color: '#555' }}></div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    
                </div>
            
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '6px', 
                    marginTop: '20px',
                    minHeight: '6px',
                    visibility: totalPages > 1 ? 'visible' : 'hidden'
                    }}>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <div 
                            key={idx}
                            onClick={() => setCurrentPage(idx)}
                            style={{ 
                                width: '6px', 
                                height: '6px', 
                                borderRadius: '50%', 
                                cursor: 'pointer',
                                backgroundColor: currentPage === idx ? '#4a67ff' : '#aebcfc',
                                transition: 'background-color 0.2s ease'
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
