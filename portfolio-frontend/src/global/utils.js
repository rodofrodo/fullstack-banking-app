// global utils

export const formatAccountNumber = (val) => {
    if (!val) return '';

    // we remove all whitespaces
    const clean = val.replace(/\s/g, '').toUpperCase();

    // if not starts with PL, we continue typing in
    if (!clean.startsWith('PL')) return clean;

    // the algorithm
    const parts = [];
    parts.push(clean.substring(0, 2)); // PL
    if (clean.length > 2) parts.push(clean.substring(2, 4));
    for (let i = 4; i < clean.length; i += 4)
        parts.push(clean.substring(i, i + 4));

    return parts.join(' ').substring(0, 35);
};

export const formatBalance = (amount) => {
    if (amount == null || amount === undefined) return '0.00';
    return Number(amount).toFixed(2);
};
