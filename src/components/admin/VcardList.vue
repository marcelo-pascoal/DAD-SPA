<script setup>
import VcardComponent from './VcardComponent.vue'

const props = defineProps({
    vcards: Array,
    readonly: Boolean
})

</script>

<template>
    <div>
        <ul class="list-group">
            <VcardComponent v-for="vcard in vcards" :key="vcard.phone_number" 
                :vcard="vcard" 
                :readonly="readonly" ></VcardComponent>
        </ul>
    </div>
</template>
