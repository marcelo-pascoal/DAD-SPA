<script setup>
import config from '../utils/config.js'
import User from './admin/User.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios';

const users = ref([])

const fetchUsers = async () => {
    const response = await axios.get(`${config.baseAPI}/users`)
    users.value = response.data.data
}

const deleteUser = async (user) => {
    await axios.delete(`${config.baseAPI}/users/${user.id}`);
    refresh();
}

const refresh = () => {
  fetchUsers()
}

onMounted(() => {
  refresh()
})

</script>

<template>
    <br>
    <div class="container border">
        <div class="d-flex">
            <div class="flex-grow-1">
                <h4 class="mt-3">[AdminUsers.vue]</h4>
            </div>
            <div class="flex-grow-0 d-flex flex-column justify-content-end">
                <button type="button" class="btn btn-dark" @click="refresh">
                    <i class="bi-repeat" aria-hidden="true"></i> Refresh
                </button>
            </div>
        </div>
        <hr>
        <div>
        <ul class="list-group">
            <User v-for="user in users" :key="user.id" 
                :user="user" 
                @requestRemoveFromList="deleteUser"></User>
        </ul>
    </div>
    </div>
</template>
