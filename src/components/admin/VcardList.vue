<script setup>
import VcardComponent from './VcardComponent.vue'

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
            <VcardComponent v-for="vcard in vcards" :key="vcard.phone_number" 
                :vcard="vcard" 
                :readonly="readonly" 
                @requestRemoveFromList="handleRequestToRemoveCard"
                @requestUpdateCard="updateCard"></VcardComponent>
        </ul>
    </div>
</template>
