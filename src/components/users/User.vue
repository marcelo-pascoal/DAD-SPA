<script setup>
import { useToast } from "vue-toastification"
import { useUserStore } from '../../stores/user.js'
import { ref, watch, inject, onMounted} from 'vue'
import UserDetail from "./UserDetail.vue"
import { useRouter, onBeforeRouteLeave } from 'vue-router'

const toast = useToast()
const socket = inject("socket")
const axios = inject("axios")
const router = useRouter()
const userStore = useUserStore()

const props = defineProps({
    id: {
      type: Number,
      default: null
    },
    type: {
      type: String,
      default: null
    }
})

const newUser = () => {
    return {
      id: null,
      phone_number: '',
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone_number: '',
      photo_url: null,
      confirmation_code: '',
      confirmation_code_conf: '',
    }
}

const user = ref(newUser())
const errors = ref(null)
const confirmationLeaveDialog = ref(null)
const confirmationBtn = ref('')
const msg= ref('')
const vcardConfirmation = ref(false)
const confirmedHandler = ref('')

let originalValueStr = ''

const inserting = (id) => !id || (id < 0)
const loadUser = async (id) => {
  originalValueStr = ''
  errors.value = null
  if (inserting(id)) {
    user.value = newUser()
  } else {
      try {
        const response = await axios.get('users/' + id)
        user.value = response.data.data
        originalValueStr = JSON.stringify(user.value)
      } catch (error) {
        console.log(error)
      }
  }
}

const save = async (userToSave) => {
  errors.value = null
  let response = null
  if (inserting(props.id)) {
    try {
      originalValueStr = JSON.stringify(user.value)
      if (props.type=='admin'){
        response = await axios.post('users', userToSave)
        socket.emit('insertedAdmin', response.data.data)
        toast.success('New admin account created.')
        router.back()
      }
      else {
        const credentials = {
            username: userToSave.phone_number,
            password: userToSave.password
        }
        response = await axios.post('vcards', userToSave)
        socket.emit('insertedVcard', response.data.data)
        toast.success('Registration successfull.')
        if (await userStore.login(credentials)) {
          toast.success('User ' + userStore.user.name + ' has entered the application.')
        } else {
          toast.error('Login failed!')
        }
        user
        router.push({ name: 'home' })
      }      
    } catch (error) {
      console.log(error)
      if (error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error('Registration not possible due to validation errors!')
      } else {
        toast.error('Registration not possible due to unknown server error!')
      }
    }
  } else {
    try {

      if (props.type=='admin'){
        response = await axios.put('users/' + props.id, userToSave)
        await userStore.loadUser()
        socket.emit('updatedAdmin', user.value)
      }else{
        response = await axios.put('vcards/' + props.id, userToSave)
        await userStore.loadUser()
        socket.emit('updatedVcard', user.value)
      }
      originalValueStr = JSON.stringify(user.value)
      toast.success('Updated successfull.')
      router.back()
    } catch (error) {
      if (error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error('Update not possible due to validation errors!')
      } else {
        toast.error('Update not possible due to unknown server error!')
      }
    }
  }
}

const cancel = () => {
  originalValueStr = JSON.stringify(user.value)
  router.back()
}

watch(
  () => props.id,
  (newValue) => {
      loadUser(newValue)
    },
  {immediate: true}
)

let nextCallBack = null

const leaveConfirmed = async (credentials) => {
  if (confirmedHandler.value=='leave'){
      if (nextCallBack) {
      nextCallBack()
    }
  }else{
    try {
    originalValueStr = JSON.stringify(user.value)
    await axios.delete(`/vcards/${userStore.userId}`, { params: credentials });
    toast.warning(`You account has been deleted!`)
    socket.emit('deletedVcard', userStore.user)
    userStore.clearUser()
    router.push({ name: 'home' })
    } catch (error) {
      console.log(error)
      toast.error(`It was not possible to delete your Account!`)
    } 
  }
}

const deleteAccount = () => {
    confirmedHandler.value='delete'
    confirmationBtn.value ='Delete account'
    msg.value='Do you really want to delete your account?'
    vcardConfirmation.value=true
    confirmationLeaveDialog.value.show()
}

onBeforeRouteLeave((to, from, next) => {
  
  nextCallBack = null
  let newValueStr = JSON.stringify(user.value)
  if (userStore.userId != -1 && originalValueStr != newValueStr) {
    confirmedHandler.value='leave'
    confirmationBtn.value ='Discard changes and leave'
    msg.value='Do you really want to leave? You have unsaved changes!' 
    nextCallBack = next
    vcardConfirmation.value=false
    confirmationLeaveDialog.value.show()
  } else {
    next()
  }
})

onMounted(() =>{
  originalValueStr=JSON.stringify(user.value)
})


</script>

<template>
  <confirmation-dialog
    ref="confirmationLeaveDialog"
    :confirmationBtn=confirmationBtn
    :msg=msg
    @confirmed="leaveConfirmed"
    :showPassword=vcardConfirmation
    :showCode=vcardConfirmation
  >
  </confirmation-dialog>

  <user-detail
    :user="user"
    :type="type"
    :errors="errors"
    :inserting="inserting(id)"
    @save="save"
    @cancel="cancel"
    @delete="deleteAccount"
  ></user-detail>
</template>
