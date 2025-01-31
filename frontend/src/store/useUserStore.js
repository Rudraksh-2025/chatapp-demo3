import { create } from 'zustand'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuthStore } from './useAuthStore'
export const useUserStore = create((set, get) => ({
    user: null,
    users: [],
    isUpdating: false,
    isDeleting: false,
    isFetching: false,
    selectedUser: null,
    username: null,

    getUsers: async () => {
        set({ isFetching: true })
        try {
            const { userToken } = useAuthStore.getState()
            const response = await axios.get('https://api.quickblox.com/users.json?page=1&per_page=10', {
                headers: {
                    'QB-Token': userToken
                }
            })
            set({ users: response.data.items, isFetching: false })
        } catch (error) {
            toast.error("error in fetching users")
            console.log(error)
        }
        finally {
            set({ isFetching: false })
        }
    },
    getUser: async (userId) => {
        set({ isFetching: true })
        try {
            const { userToken } = useAuthStore.getState()
            const response = await axios.get(`https://api.quickblox.com/users/${userId}.json`, {
                headers: {
                    'QB-Token': userToken
                }
            })
            set({ user: response.data, isFetching: false })
            return response.data
        } catch (error) {
            // toast.error("error in fetching user")
            console.log(error)
        }
        finally {
            set({ isFetching: false })
        }
    },
    updateUser: async (userId, userData) => {
        set({ isUpdating: true })
        try {
            const { userToken } = useAuthStore.getState()
            const response = await axios.put(
                `https://api.quickblox.com/users/${userId}.json`,
                { user: userData },
                {
                    headers: {
                        'QB-Token': userToken,
                        'Content-Type': 'application/json'
                    }
                }
            )
            set({ user: response.data, isUpdating: false })
            toast.success('User updated successfully')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating user')
            console.error('Update user error:', error)
        } finally {
            set({ isUpdating: false })
        }
    },
    deleteUser: async (userId) => {
        set({ isDeleting: true })
        try {
            const { userToken } = useAuthStore.getState()
            await axios.delete(
                `https://api.quickblox.com/users/${userId}.json`,
                {
                    headers: {
                        'QB-Token': userToken
                    }
                }
            )
            const currentUsers = get().users
            set({
                users: currentUsers.filter(user => user.id !== userId),
                user: get().user?.id === userId ? null : get().user
            })

            toast.success('User deleted successfully')
            return true
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting user')
            console.error('Delete user error:', error)
            return false
        } finally {
            set({ isDeleting: false })
        }
    },
    getUserName: async (userId) => {
        try {
            const { userToken } = useAuthStore.getState();
            const response = await axios.get(`https://api.quickblox.com/users/${userId}.json`, {
                headers: {
                    'QB-Token': userToken,
                },
            });
            const user = response.data.user;
            set({ username: user.login })
            return user.login
        } catch (error) {
            console.error('Error fetching user name:', error);
        }
    }

}))