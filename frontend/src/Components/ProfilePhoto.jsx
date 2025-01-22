import React, { useState, useEffect } from 'react';
import { Avatar } from '@mui/material';
import { useChatStore } from '../store/useChatStore';
import pp1 from '../assets/ProfilePhotos/pp1.jpg';
import pp2 from '../assets/ProfilePhotos/pp2.jpg';
import pp3 from '../assets/ProfilePhotos/pp3.jpg';
import pp4 from '../assets/ProfilePhotos/pp4.jpg';
import pp5 from '../assets/ProfilePhotos/pp5.jpg';
import pp6 from '../assets/ProfilePhotos/pp6.jpg';
import pp7 from '../assets/ProfilePhotos/pp7.jpg';
import pp8 from '../assets/ProfilePhotos/pp8.jpg';
import pp9 from '../assets/ProfilePhotos/pp9.jpg';
import pp10 from '../assets/ProfilePhotos/pp10.jpg';
import pp11 from '../assets/ProfilePhotos/pp11.jpg';

const availablePhotos = [pp1, pp2, pp3, pp4, pp5, pp6, pp7, pp8, pp9, pp10, pp11];

const ProfilePhoto = ({ dialogId }) => {
    const { dialogs } = useChatStore();
    const [photoMap, setPhotoMap] = useState(() => {
        // Initialize photoMap with already existing dialog photo mappings if any
        const initialMap = {};
        dialogs.forEach((dialog, index) => {
            if (!initialMap[dialog._id]) {
                initialMap[dialog._id] = availablePhotos[index % availablePhotos.length];
            }
        });
        return initialMap;
    });

    useEffect(() => {
        if (dialogId && !photoMap[dialogId]) {
            // If the dialog ID is not mapped yet, assign the next available photo
            setPhotoMap((prevMap) => {
                const nextPhoto = availablePhotos[Object.keys(prevMap).length % availablePhotos.length];
                return { ...prevMap, [dialogId]: nextPhoto };
            });
        }
    }, [dialogId, photoMap]);

    const dialog = dialogs.find((dialog) => dialog._id === dialogId);

    const profileImage = photoMap[dialogId] || pp1; // Use mapped photo or fallback default

    return <Avatar alt={dialog?.name || 'User'} src={profileImage} />;
};

export default ProfilePhoto;
