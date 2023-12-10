<script setup>
import axios from 'axios'
import { useToast } from "vue-toastification"
import { useUserStore } from '../../stores/user.js'
import { ref, watch, inject} from 'vue'
import UserDetail from "./UserDetail.vue"
import { useRouter, onBeforeRouteLeave } from 'vue-router'

const toast = useToast()
const socket = inject("socket")
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
      photo_url: '',
      confirmation_code: '',
      confirmation_code_conf: '',
    }
}

const user = ref(newUser())
const errors = ref(null)
const confirmationLeaveDialog = ref(null)

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
      if (props.type=='admin'){
        response = await axios.post('users', userToSave)
        socket.emit('insertedUser', response.data.data)
      }
      else {
        response = await axios.post('vcards', userToSave)
        socket.emit('insertedVcard', response.data)
      }
      user.value = response.data.data
      originalValueStr = JSON.stringify(user.value)
      toast.success('Registration successfull.')
      router.back()
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
      /////////////
      response = await axios.put('users/' + props.id, userToSave)
      user.value = response.data.data
      /////////////
      originalValueStr = JSON.stringify(user.value)
      toast.success('Updated successfull.')
      if (user.value.id == userStore.userId) {
        await userStore.loadUser()
      }
      socket.emit('updatedUser', user.value)
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
const leaveConfirmed = () => {
  if (nextCallBack) {
    nextCallBack()
  }
}

onBeforeRouteLeave((to, from, next) => {
  nextCallBack = null
  let newValueStr = JSON.stringify(user.value)
  if (originalValueStr != newValueStr) {
    nextCallBack = next
    confirmationLeaveDialog.value.show()
  } else {
    next()
  }
})

</script>

<template>
  <confirmation-dialog
    ref="confirmationLeaveDialog"
    confirmationBtn="Discard changes and leave"
    msg="Do you really want to leave? You have unsaved changes!"
    @confirmed="leaveConfirmed"
  >
  </confirmation-dialog>

  <user-detail
    :user="user"
    :type="type"
    :errors="errors"
    :inserting="inserting(id)"
    @save="save"
    @cancel="cancel"
  ></user-detail>
</template>
