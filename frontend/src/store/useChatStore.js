import { create } from 'zustand'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuthStore } from './useAuthStore'
// import { useUserStore } from './useUserStore'
export const useChatStore = create((set, get) => ({
    apikey: '3nnWkLLQuX77lwk4nn-xahc6vFOirrt-Kqblu45ttsE',
    CurrentDialogId: null,
    dialogs: [],
    msg: [],
    recipient_id: null,

    createDialog: async (data) => {
        const { authUser } = useAuthStore.getState();
        const apikey = get().apikey;
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
                    'On-Behalf-Of': authUser.id,
                },
            });
            await get().getDialogs();
            set({ CurrentDialogId: response.data._id });
            toast('Dialog successfully created');
        } catch (error) {
            toast.error('Error in creating dialog');
            console.error(error);
        }
    },
    getDialogs: async () => {
        const { authUser } = useAuthStore.getState()
        const apikey = get().apikey
        try {
            const response = await axios.get('https://api.quickblox.com/chat/Dialog.json?include_unread_message_count=1&limit=100&skip=0', {
                headers: {
                    Authorization: `ApiKey ${apikey}`,
                    'On-Behalf-Of': authUser.id
                }
            })
            set({ dialogs: response.data.items })

        } catch (error) {
            toast('error in fetching dialogs')
            console.log("errors")
        }
    },
    deleteDialog: async (chat_dialog_id) => {
        const { authUser } = useAuthStore.getState()
        const apikey = get().apikey
        try {
            console.log(chat_dialog_id)
            await axios.delete(`https://api.quickblox.com/chat/Dialog/${chat_dialog_id},${chat_dialog_id}`, {
                headers: {
                    Authorization: `ApiKey ${apikey}`,
                    'On-Behalf-Of': authUser.id
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
        const apikey = get().apikey;
        try {
            await axios.post('https://api.quickblox.com/chat/Message.json', {
                "chat_dialog_id": data.chat_dialog_id,
                "message": data.message,
                "recipient_id": data.recipient_id,
                "send_to_chat": 1
            }, {
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    Authorization: `ApiKey ${apikey}`,
                    'On-Behalf-Of': authUser.id,
                }
            })
            await get().getMsg();
            toast('msg created successfully')
        } catch (error) {
            toast('error in creating message')
        }
    },
    getMsg: async (chat_dialog_id) => {
        const { authUser } = useAuthStore.getState();
        const apikey = get().apikey;
        try {
            const response = await axios.get(`https://api.quickblox.com/chat/Message.json?limit=100&skip=0&chat_dialog_id=${chat_dialog_id}`, {
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    Authorization: `ApiKey ${apikey}`,
                    'On-Behalf-Of': authUser.id,
                }
            })
            set({ msg: response.data.items, recipient_id: response.data.items[0].recipient_id })
        } catch (error) {
            toast('error in getting messages')
            set({ msg: [] })
        }
    }
}))
