import { useState, useEffect } from 'react';
import axios from 'axios';

export function useCurrencyRates() {
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const token = localStorage.getItem('jwt_token');
                const response = await axios.get('http://localhost:8080/api/currency/rates', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setRates(response.data[0].rates);
                setLoading(false);
            } catch (err) {
                setError('❌ Failed to retrieve current exchange rates.');
                setLoading(false);
            }
        };

        fetchRates();
    }, []);

    return { rates, loading, error };
}
