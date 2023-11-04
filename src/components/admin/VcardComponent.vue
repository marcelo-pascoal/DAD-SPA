<script setup>
import { computed} from 'vue'

const props = defineProps({
    vcard: Object,
    readonly: Boolean
})

const fullDescription = computed(() => props.vcard.phone_number + ' - ' + props.vcard.email + ' :: ' + props.vcard.name)

</script>

<template>
    <li class="list-group-item" :class="{'bg-light': readonly}">
        <span :class="{ blocked: vcard.blocked }">{{ fullDescription }}</span>
    </li>
</template>

<style scoped>
.blocked {
    text-decoration: line-through;
}

</style>
