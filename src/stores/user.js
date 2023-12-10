import axios from 'axios'
import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import avatarNoneUrl from '@/assets/avatar-none.png'
import { useToast } from "vue-toastification"
import { useRouter, useRoute} from 'vue-router'
import { useRefHistory } from '@vueuse/core'

export const useUserStore = defineStore('user', () => {
    const socket = inject("socket")
    const toast = useToast()

    const router = useRouter()
    const route = useRoute()
    const serverBaseUrl = inject('serverBaseUrl')

    const user = ref(null)

    const accountBalance = ref(0)
    const maxDebit = ref(0)

    const userName = computed(() => user.value?.name ?? 'Anonymous')

    const userId = computed(() => user.value?.id ?? -1)

    const userType = computed(() => user.value?.user_type ?? 'V')

    const userPhotoUrl = computed(() => 
        user.value?.photo_url
        ? serverBaseUrl + '/storage/fotos/' + user.value.photo_url
        : avatarNoneUrl)

    async function getFinantialInfo() {
        try{
            const response = await axios.get('vcards/'+user.value?.id)
            accountBalance.value = response.data.data.balance
            maxDebit.value = response.data.data.max_debit
        }   catch (error) {
            throw error
        }
    }
    async function loadUser() {
        try {
            const response = await axios.get('users/me')
            user.value = response.data.data
            if(user.value.user_type=='V'){
                getFinantialInfo()
            }
        } catch (error) {
            clearUser()
            throw error
        }
    }

    function clearUser() {
        delete axios.defaults.headers.common.Authorization
        sessionStorage.removeItem('token')
        user.value = null
    }

    async function login(credentials) {
        try {
            const response = await axios.post('login', credentials)
           
            axios.defaults.headers.common.Authorization = "Bearer " + response.data.access_token
            sessionStorage.setItem('token', response.data.access_token)
            await loadUser()
            socket.emit('loggedIn', user.value)
            return true
        }
        catch(error) {
            clearUser()
            return false
        }
    }

    async function logout () {
        try {
            await axios.post('logout')
            socket.emit('loggedOut', user.value)
            clearUser()
            return true
        } catch (error) {
            return false
        }
    }

    async function changePassword(credentials) {
        if (userId.value < 0) {
            throw 'Anonymous users cannot change the password!'
        }
        try {
            await axios.patch(`users/${user.value.id}/password`, credentials)
            return true
        } catch (error) {
            throw error
        }
    }

    async function restoreToken () {
        let storedToken = sessionStorage.getItem('token')
        if (storedToken) {
            axios.defaults.headers.common.Authorization = "Bearer " + storedToken
            await loadUser()
            socket.emit('loggedIn', user.value)
            return true
        }
        clearUser()
        return false
    }

    
    socket.on('insertedVcard', (vcard) => {
        toast.info(`vCard #${vcard.phone_number} (${vcard.name}) has registered successfully!`)
    })

    socket.on('updatedAdmin', (admin) => {
        toast.info(`Admin profile #${admin.id} (${admin.name}) has changed!`)
    })

    socket.on('updatedVcard', (vcard) => {
        if (user.value?.id == vcard.phone_number) {
            loadUser();
            if(route.name == 'blocked' && !vcard.blocked){
                toast.info('Your account has been unblocked!')
                router.push({ name: 'Vcard', params: { id: vcard.phone_number } })
                
            }
            else if(vcard.blocked){
                toast.error('Your account has been blocked!')
                router.push({ name: 'blocked' })
            }
            else{
            toast.info('Your profile has been altered!')
            }
        } 
        else {
            toast.info(`Admin profile #${updatedAdmin.id} (${updatedAdmin.name}) has changed!`)
        }
    })

    socket.on('accountDeleted', (vcard) => {
        toast.error('You account has been revoked')
        logout ()
    })

    socket.on('accountCredited', (transaction) => {
        toast.success(`You account has been credited (#${transaction.payment_type} (${transaction.payment_reference}): ${transaction.value})`)
        getFinantialInfo()
    })

    return {
        user,
        userId,
        userName,
        userType,
        userPhotoUrl,
        loadUser,
        clearUser,
        login,
        logout,
        restoreToken,
        changePassword,
        getFinantialInfo,
        accountBalance,
        maxDebit
    }
})
