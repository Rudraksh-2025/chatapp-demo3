import { create } from 'zustand'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuthStore } from './useAuthStore'
// import { useUserStore } from './useUserStore'
export const useChatStore = create((set, get) => ({
    apikey: import.meta.env.VITE_QB_CHAT_API_KEY,
    CurrentDialogId: null,
    dialogs: [],
    msg: [],
    isSendingMsg: false,
    recipient_id: null,
    isLoadingMsg: false,
    unReadCount: 0,



    createDialog: async (data) => {
        const { authUser } = useAuthStore.getState();
        const apikey = get().apikey;
        const userId = authUser.session.user_id
        const payload = {
            occupants_ids: data.checked,
            type: data.type,
        };
        if (data.type === 2) {
            payload.name = data.name;
        }

        try {
            const response = await axios.post('https://api.quickblox.com/chat/Dialog.json', payload, {
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    Authorization: `ApiKey ${apikey}`,
                    'On-Behalf-Of': userId.toString(),
                },
            });
            await get().getDialogs();
            set({ CurrentDialogId: response.data._id });
        } catch (error) {
            console.error(error);
        }
    },
    getDialogs: async () => {
        const { authUser } = useAuthStore.getState()
        const apikey = get().apikey
        try {
            const userId = authUser.session.user_id
            const response = await axios.get('https://api.quickblox.com/chat/Dialog.json?include_unread_message_count=1&limit=100&skip=0', {
                headers: {
                    accept: 'application/json',
                    Authorization: `ApiKey ${apikey}`,
                    'On-Behalf-Of': userId.toString()
                }
            })
            set({ dialogs: response.data.items })
        } catch (error) {
            console.log(error)
        }
    },
    deleteDialog: async (chat_dialog_id) => {
        const { authUser } = useAuthStore.getState()
        const userId = authUser.session.user_id
        const apikey = get().apikey
        try {
            await axios.delete(`https://api.quickblox.com/chat/Dialog/${chat_dialog_id},${chat_dialog_id}`, {
                headers: {
                    // "QB-Token": userToken,
                    Authorization: `ApiKey ${apikey}`,
                    'On-Behalf-Of': userId.toString()
                }
            })
            await get().getDialogs()
            console.log('deleted successfully')
        } catch (error) {
            toast('error in deleting dialog')
        }
    },
    createMsg: async (data) => {
        const { authUser } = useAuthStore.getState();
        const userId = authUser.session.user_id
        const apikey = get().apikey;
        try {
            set({ isSendingMsg: true })
            await axios.post('https://api.quickblox.com/chat/Message.json', {
                "chat_dialog_id": data.chat_dialog_id,
                "message": data.message,
                "recipient_id": data.recipient_id,
                "send_to_chat": 1,
                attachments: { N: { id: data.attachments.id, type: 'image', name: data.attachments.name, 'content-type': data.attachments.content_type } }
            }, {
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    // "QB-Token": userToken,
                    Authorization: `ApiKey ${apikey}`,
                    'On-Behalf-Of': userId.toString(),
                }
            })
            // await get().getDialogs();
            await get().getMsg(data.chat_dialog_id);
            // toast('msg created successfully')
        } catch (error) {
            toast('error in creating message')
            console.log(error)
        }
        finally {
            set({ isSendingMsg: false })
        }
    },
    getMsg: async (chat_dialog_id) => {
        const { authUser } = useAuthStore.getState();
        const userId = authUser.session.user_id
        const apikey = get().apikey;
        try {
            const response = await axios.get(`https://api.quickblox.com/chat/Message.json?limit=100&skip=0&chat_dialog_id=${chat_dialog_id}`, {
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    // "QB-Token": userToken,
                    Authorization: `ApiKey ${apikey}`,
                    'On-Behalf-Of': userId.toString(),
                }
            })
            const messages = response.data.items || [];
            set({
                msg: messages,
                recipient_id: messages.length > 0 ? messages[0].recipient_id : null,
            });
        } catch (error) {
            // toast('error in getting messages')
            set({ msg: [] })
        }

    },
    clearDialogs: () => {
        set({ dialogs: [] });
    },
    clearMsg: () => {
        set({ msg: [] })
    },
    setDialogUser: (selectedDialogId) => {
        set({ CurrentDialogId: selectedDialogId })
    },
    clearDialogUser: () => set({ CurrentDialogId: null }),
    getUnreadCount: async (dialogIds) => {
        const apikey = get().apikey;
        const { authUser } = useAuthStore.getState();
        const userId = authUser.session.user_id
        try {
            // const dialogIdsString = dialogIds.join(',');
            const response = await axios.get(`https://api.quickblox.com/chat/Message/unread.json?chat_dialog_ids=${dialogIds}`, {
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    Authorization: `ApiKey ${apikey}`,
                    'On-Behalf-Of': userId.toString(),
                }
            })
            return response.data;
        } catch (error) {
            console.log(error)
        }
    },
    createFile: async (file, modifiedBase64String) => {
        const { userToken } = useAuthStore.getState();
        try {
            const response = await axios.post('https://api.quickblox.com/blobs.json', {
                blob: { public: 'false', content_type: file.type.toString(), name: file.name.toString(), tag_list: 'string' }
            }, {
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    'QB-Token': userToken,
                }
            });

            const uploadUrl = response.data.blob.blob_object_access.params;
            const key = response.data.blob.uid;
            const id = response.data.blob.id;
            await axios.post(uploadUrl, {
                key: key.toString(),
                file: modifiedBase64String
            }, {
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json'
                }
            });

            return {
                id: id,
                name: file.name,
                content_type: file.type
            };
        } catch (error) {
            console.error('Error creating file:', error);
            throw error;
        }
    },
}))
