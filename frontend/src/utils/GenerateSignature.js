/**
 * Generate HMAC-SHA1 signature for QuickBlox API.
 * @param {Object} params - The parameters to include in the signature.
 * @param {string} secretKey - The secret key for signing.
 * @returns {Promise<string>} - The generated signature.
 */
export const generateSignature = async (params, secretKey) => {
    // Sort parameters alphabetically and create query string
    const sortedParams = Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join('&');

    // Convert strings to byte arrays
    const encoder = new TextEncoder();
    const data = encoder.encode(sortedParams);
    const key = encoder.encode(secretKey);

    // Import the key
    const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        key,
        {
            name: 'HMAC',
            hash: { name: 'SHA-1' }
        },
        false,
        ['sign']
    );

    // Generate the signature
    const signature = await window.crypto.subtle.sign(
        'HMAC',
        cryptoKey,
        data
    );

    // Convert the signature to hex string
    return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};
