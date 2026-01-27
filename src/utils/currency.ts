/**
 * Returns the currency symbol for a given currency code.
 * Falls back to the code itself if no symbol is found or if the input is already a symbol.
 */
export const getCurrencySymbol = (currencyCode: string): string => {
    try {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
        });

        // Format 0 and extract the symbol parts
        const parts = formatter.formatToParts(0);
        const symbolPart = parts.find(part => part.type === 'currency');

        return symbolPart ? symbolPart.value : currencyCode;
    } catch {
        // Fallback for invalid codes or if the code is already a symbol (though our app stores codes)
        return currencyCode;
    }
};
