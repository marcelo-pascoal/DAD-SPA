<script setup>
import { useToast } from "vue-toastification"
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'

const toast = useToast()
const router = useRouter()
const userStore = useUserStore()

const logout = async () => {
  if (await userStore.logout()) {
    toast.success('User has logged out of the application.')
    clickMenuOption()
    router.push({ name: 'home' })
  } else {
    toast.error('There was a problem logging out of the application!')
  }
}

const clickMenuOption = () => {
  const domReference = document.getElementById('buttonSidebarExpandId')
  if (domReference) {
    if (window.getComputedStyle(domReference).display !== "none") {
      domReference.click()
    }
  }
}
</script>

<template>
  <div class="d-flex row justify-content-center" style="height: 100vh; align-items: center;">
    <h1>Account Blocked</h1>
    <h3>Your account has been blocked by administration</h3>
    <button id="button-logout" type="button" class="btn btn-warning px-4 btn-addtr"
                        @click.prevent="logout"><i class="bi bi-xs bi-plus-circle"></i>&nbsp; Logout
                    </button>
                  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
