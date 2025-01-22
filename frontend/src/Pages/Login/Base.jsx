import React, { useState } from 'react';

const Base = () => {
    const [base64String, setBase64String] = useState(null);
    // Function to convert image to Base64
    // const convertToBase64 = (file) => {
    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file); // Read file as data URL
    //         reader.onload = () => resolve(reader.result); // Resolve with Base64 string
    //         reader.onerror = (error) => reject(error); // Reject on error
    //     });
    // };

    // Handle file upload
    const handleFileUpload = async (event) => {
        const file = event.target.files[0]; // Get the uploaded file
        if (file) {
            try {
                setBase64String(localStorage.getItem('baseString')) // Update state with Base64 string
            } catch (error) {
                console.error('Error converting to Base64:', error);
            }
        }
    };

    return (
        <div style={{ textAlign: 'center', margin: '20px' }}>
            <h1>Upload an Image</h1>
            <input type="file" accept="image/*" onChange={handleFileUpload} />
            {base64String && (
                <div>
                    <h2>Base64 Image:</h2>
                    <img
                        src={base64String}
                        alt="Base64 Preview"
                        style={{ maxWidth: '100%', height: 'auto', marginTop: '20px' }}
                    />
                </div>
            )}
        </div>
    );
};

export default Base;
