<script setup>
import config from '../utils/config.js'
import Vcard from './admin/Vcard.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios';

const vcards = ref([])

const fetchCards = async () => {
    const response = await axios.get(`${config.baseAPI}/vcards`)
    vcards.value = response.data.data
}

const deleteCard = async (vcard) => {
    await axios.delete(`${config.baseAPI}/vcards/${vcard.phone_number}`);
    refresh();
}

const updateCard = async (vcard) => {
  await axios.put(`${config.baseAPI}/vcards/${vcard.phone_number}`, vcard)
  refresh()
}

const refresh = () => {
  fetchCards()
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
                <h4 class="mt-3">[AdminVcards.vue]</h4>
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
            <Vcard v-for="vcard in vcards" :key="vcard.phone_number" 
                :vcard="vcard" 
                @requestRemoveFromList="deleteCard"
                @requestUpdateCard="updateCard"></Vcard>
        </ul>
    
    </div>
</div>
</template>
