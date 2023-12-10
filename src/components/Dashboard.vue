<script setup>

import { useUserStore } from '../stores/user.js'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const addTransaction = () => {
    router.push({ name: 'NewTransaction' })
}
</script>

<template>
    <div v-if="userStore.user?.user_type == 'A'" class="d-flex align-items-center justify-content-center" style="height: 100vh;">
    <button type="button"  class="btn btn-success px-4 btn-addtr" @click="addTransaction">
        <i class="bi bi-xs bi-plus-circle"></i>&nbsp; Add Transaction
      </button>
    </div>
</template>
