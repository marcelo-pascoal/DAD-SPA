<script setup>
import Vcard from './Vcard.vue'

const props = defineProps({
    vcards: Array,
    readonly: Boolean
})

const emit = defineEmits([
    'requestRemoveFromList',
    'requestUpdateCard'
])

const handleRequestToRemoveCard = (vcard) => {
    emit('requestRemoveFromList', vcard)
}

const updateCard = (vcard) => {
    emit("requestUpdateCard", vcard)
}
</script>

<template>
    <div>
        <ul class="list-group">
            <Vcard v-for="vcard in vcards" :key="vcard.phone_number" 
                :vcard="vcard" 
                :readonly="readonly" 
                @requestRemoveFromList="handleRequestToRemoveCard"
                @requestUpdateCard="updateCard"></Vcard>
        </ul>
    </div>
</template>
