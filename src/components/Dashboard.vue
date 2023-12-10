<script setup>

import { useUserStore } from '../stores/user.js'

const userStore = useUserStore()
</script>

<template>
    <div v-if="userStore.user?.user_type == 'A'" class="d-flex align-items-center justify-content-center" style="height: 100vh;">
    <button type="button"  class="btn btn-success px-4 btn-addtr" @click="addTransaction">
        <i class="bi bi-xs bi-plus-circle"></i>&nbsp; Add Transaction
      </button>
    </div>
</template>
