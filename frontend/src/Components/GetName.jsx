import React, { useEffect, useState } from 'react';
import { useUserStore } from '../store/useUserStore';

const GetName = ({ senderId }) => {
    const [name, setName] = useState('');
    const { getUser, user } = useUserStore();
    useEffect(() => {
        const fetchUserName = async () => {
            if (!senderId) return;
            await getUser(senderId);
        };

        fetchUserName();
    }, [senderId, getUser]);

    useEffect(() => {
        if (user && user.user.id === senderId) {
            setName(user.user.login);
        }
    }, [user, senderId]);

    return <>{name || 'Loading...'}</>;
};

export default GetName;
