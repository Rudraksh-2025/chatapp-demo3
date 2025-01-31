// src/utils/videoClient.js
import { StreamVideoClient } from "@stream-io/video-react-sdk";

let videoClientInstance = null;

export const getVideoClient = (apiKey, user, token) => {
    if (!videoClientInstance) {
        videoClientInstance = StreamVideoClient.getOrCreateInstance({
            apiKey,
            user,
            token
        });
    }
    return videoClientInstance;
};

export const resetVideoClient = () => {
    if (videoClientInstance) {
        videoClientInstance.disconnectUser();
        videoClientInstance = null;
    }
};
