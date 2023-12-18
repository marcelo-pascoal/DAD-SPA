<script setup>
import { useToast } from "vue-toastification"
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user.js'
import { ref } from 'vue'

const toast = useToast()
const router = useRouter()
const userStore = useUserStore()
const passwords = ref({
  current_password: '',
  confirmation_code: '',
  confirmation_code_confirmation: ''
})

const errors = ref(null)

const emit = defineEmits(['changedConfirmationCode'])

const changeConfirmationCode = async () => {
  try {
    await userStore.changeConfirmationCode(passwords.value)
    toast.success('Confirmation Code has been changed.')
    emit('changedConfirmationCode')
    router.back()
  } catch (error) {
    if (error.response.status == 422) {
      errors.value = error.response.data.errors
      toast.error('Confirmation Code has not been changed due to validation errors!')
    } else {
      toast.error('Confirmation Code has not been changed due to unknown server error!')
    }
  }
}
</script>

<template>
  <form class="row g-3 needs-validation" novalidate @submit.prevent="changeConfirmationCode">
    <h3 class="mt-5 mb-3">Change Secret Code</h3>
    <hr>
    <div class="mb-3">
      <div class="mb-3">
        <label for="inputCurrentPassword" class="form-label">vCard Password</label>
        <input type="password" class="form-control" id="inputCurrentPassword" required
          v-model="passwords.current_password">
        <field-error-message :errors="errors" fieldName="current_password"></field-error-message>
      </div>
    </div>
    <div class="mb-3">
      <div class="mb-3">
        <label for="inputPassword" class="form-label">New Secret Code</label>
        <input type="password" class="form-control" id="inputPassword" required v-model="passwords.password">
        <field-error-message :errors="errors" fieldName="confirmation_code"></field-error-message>
      </div>
    </div>
    <div class="mb-3">
      <div class="mb-3">
        <label for="inputPasswordConfirm" class="form-label">Confirm Code</label>
        <input type="password" class="form-control" id="inputPasswordConfirm" required
          v-model="passwords.password_confirmation">
        <field-error-message :errors="errors" fieldName="confirmation_code_confirmation"></field-error-message>
      </div>
    </div>
    <div class="mb-3 d-flex justify-content-center">
      <button type="button" class="btn btn-primary px-5" @click="changeConfirmationCode">Change Secret Code</button>
    </div>
  </form>
</template>

