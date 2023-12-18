<script setup>
import { useToast } from "vue-toastification"
import Vcard from './Vcard.vue'
import { ref, inject, onMounted } from 'vue'

const axios = inject("axios")
const socket = inject("socket")
const toast = useToast()
const vcards = ref([])

const fetchCards = async () => {
    try {
        const response = await axios.get('/vcards')
        vcards.value = response.data.data
    } catch (error) {
        console.log(error)
  }
}

const updateCard = async (vcard) => {
  await axios.put(`/update/vcards/${vcard.phone_number}`, vcard)
    toast.info(`vCard ${vcard.phone_number} was updated`)
    socket.emit('updatedVcard', vcard)
  fetchCards()
}

const deleteCard = async (vcard) => {
    await axios.delete(`/vcards/${vcard.phone_number}`);
    toast.info(`vCard ${vcard.phonoe_number} was deleted`)
    socket.emit('deletedVcard', vcard)
    fetchCards();
}

onMounted(() => {
    fetchCards()
})

socket.on('updatedVcard', () => {
    toast.info("vCard list has been altered")
    fetchCards()
})
socket.on('insertedVcard', (insertedVcard) => {
    toast.info("vCard list has been altered")
    fetchCards()
})

</script>

<template>
    <br>
    <div class="container">
        <h3 class="mt-5 mb-3">vCards</h3>
            <div>
        <ul class="list-group">
            <Vcard v-for="vcard in vcards" :key="vcard.phone_number" class="vcard"
                :vcard="vcard" 
                @requestRemoveFromList="deleteCard"
                @requestUpdateCard="updateCard"></Vcard>
        </ul>
    
    </div>
</div>
</template>

<style scoped>
.vcard{
    margin-bottom: 10px;
}
</style>

