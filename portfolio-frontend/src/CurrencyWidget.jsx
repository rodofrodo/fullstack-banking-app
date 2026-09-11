import React from 'react';

function CurrencyWidget({ rates, loading, error }) {
    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>⏳ Loading exchange rates...</div>;
    if (error) return <div style={{ padding: '10px', textAlign: 'center', color: '#dc3545' }}>{error}</div>;

    const targetCurrencies = ['EUR', 'USD', 'GBP', 'CHF'];
    const filteredRates = rates.filter(rate => targetCurrencies.includes(rate.code));

    return (
        <div style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '20px',
            backgroundColor: '#fcfcfc',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#000000', fontSize: '18px' }}>
                💱 Live Exchange Rates
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '15px' }}>
                {filteredRates.map(rate => (
                    <div key={rate.code} style={{ textAlign: 'center', minWidth: '80px' }}>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#0066ff' }}>
                            {rate.code}
                        </div>
                        <div style={{ fontSize: '15px', color: '#666666', marginTop: '4px', marginBottom: '4px' }}>
                            {rate.mid.toFixed(2)} PLN
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CurrencyWidget;
