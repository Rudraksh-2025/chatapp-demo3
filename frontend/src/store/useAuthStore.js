import { create } from 'zustand'
import axios from 'axios'
import { toast } from 'react-toastify';
import { generateSignature } from '../utils/GenerateSignature';

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    isCreatingSession: true,
    appToken: null,
    userToken: localStorage.getItem('userToken'),

    createSession: async () => {
        const applicationId = '105125';
        const authKey = 'ak_gajNCMCpyCAUfht';
        const authSecret = 'as_9GqUetSXSUGgQZk';
        const timestamp = Math.floor(Date.now() / 1000);
        const nonce = Math.random().toString(36).substring(2, 15);

        const params = {
            application_id: applicationId,
            auth_key: authKey,
            timestamp: timestamp,
            nonce: nonce,
        };

        try {
            const signature = await generateSignature(params, authSecret);

            const response = await axios.post('https://api.quickblox.com/session.json', {
                signature: signature,
                nonce: nonce,
                timestamp: timestamp,
                auth_key: authKey,
                application_id: applicationId
            }, {
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json'
                }
            });

            set({ appToken: response.data.session.token });
            console.log('Application session created successfully:', response.data);
        } catch (err) {
            console.error('Error creating application session:', err.response?.data || err.message);
        } finally {
            set({ isCreatingSession: false });
        }
    },
    checkAuth: async () => {
        const userToken = get().userToken;
        if (!userToken) {
            set({ authUser: null, isCheckingAuth: false });
            return;
        }

        try {
            const response = await axios.get("https://api.quickblox.com/session.json", {
                headers: {
                    accept: 'application/json',
                    'QB-Token': userToken
                }
            });
            set({ authUser: response.data });
        } catch (err) {
            console.log("error in check auth", err);
            set({ authUser: null, userToken: null });
            if (err.response?.status === 401) {
                get().logout();
            }
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            //user with api key
            const apiKey = 'I56Jo7P7v9RZB5rLqG9wlIlAIrXSFqaT38fuCQAr5fg';
            const signupResponse = await axios.post('https://api.quickblox.com/users.json',
                { user: data },
                {
                    headers: {
                        accept: 'application/json',
                        'content-type': 'application/json',
                        Authorization: `ApiKey ${apiKey}`
                    }
                }
            );

            //user session token
            const userId = signupResponse.data.user.id;
            const userSessionResponse = await axios.post(
                `https://api.quickblox.com/users/${userId}/tokens`,
                {},
                {
                    headers: {
                        accept: 'application/json',
                        Authorization: `ApiKey ${apiKey}`
                    }
                }
            );
            localStorage.setItem('userToken', userSessionResponse.data.token)
            set({
                authUser: signupResponse.data,
                userToken: userSessionResponse.data.token
            });
            toast.success('Account created successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Signup failed');
            console.error("Signup error:", err);
        } finally {
            set({ isSigningUp: false });
        }
    },
    logout: async () => {
        const userToken = get().userToken;
        try {
            await axios.delete('https://api.quickblox.com/login.json', {
                headers: {
                    accept: 'application/json',
                    'QB-Token': userToken
                }
            });
            localStorage.removeItem('userToken')
            set({ authUser: null, userToken: null });
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error("Error logging out");
        }
    },
    login: async (login, password) => {
        set({ isLoggingIn: true });
        try {
            const appToken = get().appToken;
            const loginResponse = await axios.post('https://api.quickblox.com/login.json',
                { login, password },
                {
                    headers: {
                        accept: 'application/json',
                        'QB-Token': appToken,
                        'content-type': 'application/json'
                    }
                }
            );
            //user session token
            const userId = loginResponse.data.user.id;
            const apiKey = 'I56Jo7P7v9RZB5rLqG9wlIlAIrXSFqaT38fuCQAr5fg';
            const userSessionResponse = await axios.post(
                `https://api.quickblox.com/users/${userId}/tokens`,
                {},
                {
                    headers: {
                        accept: 'application/json',
                        Authorization: `ApiKey ${apiKey}`
                    }
                }
            );
            localStorage.setItem('authUser', JSON.stringify(loginResponse.data));
            localStorage.setItem('userToken', userSessionResponse.data.token);
            set({
                authUser: loginResponse.data,
                userToken: userSessionResponse.data.token
            });
            toast.success('Logged in successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
            console.error("Login error:", err);
        } finally {
            set({ isLoggingIn: false });
        }
    },
    uploadFile: async (file) => {
        try {
            const apiKey = 'I56Jo7P7v9RZB5rLqG9wlIlAIrXSFqaT38fuCQAr5fg';
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('https://api.quickblox.com/blobs.json', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `ApiKey ${apiKey}`,
                },
            });

            // File successfully uploaded; return blob_id
            const blobId = response.data.blob.id;
            return blobId;
        } catch (err) {
            console.error('File upload failed:', err);
            throw new Error(err.response?.data?.message || 'File upload failed');
        }
    },


}))