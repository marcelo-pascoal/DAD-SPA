<script setup>
import {computed} from 'vue'

const props = defineProps({
    category: Object,
    readonly: Boolean
})

const fullDescription = computed(() => props.category.name + ' - ' + props.category.type)

const emit = defineEmits([
    'requestRemoveFromList',
    'requestUpdateCategory'
])

const clickToDeleteCategory = (category) => {
    emit('requestRemoveFromList', category)
}

</script>

<template>
    <li class="list-group-item" :class="{'bg-light': readonly}">
        <div class="card-container">
            
            <span id="fullDescription">{{ fullDescription }}</span>

            <div class="float-end adminBox" v-show="!readonly">
                

                <button class="btn btn-danger btn-xs" @click="clickToDeleteCategory(category)">
                    <i class="bi-trash" aria-hidden="true"></i>
                </button>

            </div>
        </div>
        
    </li>
</template>

<style scoped>

.card-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

#fullDescription {
  border: 1px solid black;
  margin: 10px;
  padding: 10px;
  flex: 1;
}

button{
    margin-right: 2px;
}

@media (max-width:770px){
    #fullDescription {
        width: 195px;
        min-width: 195px;
    }
    .adminBox{
        width: 33px;
    }
}
</style>
