<script setup>
import {computed} from 'vue'

const props = defineProps({
    user: Object,
    readonly: Boolean
})

const emit = defineEmits([
    'requestRemoveFromList',
])

const fullDescription = computed(() => props.user.name + ' - ' + props.user.email)

const clickToDeleteUser = (user) => {
    emit('requestRemoveFromList', user)
}

</script>

<template>
    <li class="list-group-item" :class="{'bg-light': readonly}">
        <div class="card-container">
            
            <div class="float-end adminBox" v-show="!readonly">
            
            <span id="fullDescription" >{{ fullDescription }}</span>
                <button class="btn btn-danger btn-xs" @click="clickToDeleteUser(user)">
                    <i class="bi-trash" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    </li>
</template>

<style scoped>
#fullDescription {
  border: 1px solid black;
  margin: 10px;
  padding: 10px;
  flex: 1;
}
</style>