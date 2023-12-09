<script setup>
import { ref } from 'vue'

import CategoryDetail from './CategoryDetail.vue'

const categoryEdit = ref(null)

const closed = ref('closed')
const props = defineProps({
    category: Object,
})

const emit = defineEmits([
    'delete',
    'update'
])

const deleteCategory = (category) => {
    emit('delete', category)
}

const editCategory = (category) => {
    closed.value=('open')
    categoryEdit.value = category
}

const closeEdit = () => {
    closed.value=('closed')
    categoryEdit.value = null
}

const updateCategory = (category) => {
    categoryEdit.value = null
    emit('update', category)
}

</script>

<template>
    <div>
    <li :class="'list-group-item '+ closed" >
        <div @click="!categoryEdit && editCategory(category)">
            <button :class="'btn ' + (category.type==='D' ? 'btn-warning' : 'btn-success') + ' btn-xs'" @click="closeEdit">
                    <i :class=category.icon aria-hidden="true"></i>
                </button>
                &nbsp
            <span>{{ category.name }}</span>
            <div class="float-end">
                <button class="btn btn-danger btn-xs" @click="deleteCategory(category)">
                    <i class="bi-trash" aria-hidden="true"></i>
                </button>
            </div>
        </div>
        <div v-if="categoryEdit" class="editor">
            <hr>
            <CategoryDetail :category="categoryEdit" @update="updateCategory" @hide="closeEdit"></CategoryDetail>
            <hr>
        </div>
    </li>
</div>
</template>

<style scoped>

button.btn {
    margin-left: 5px;
}


.list-group-item.closed:hover{
    background-color: lightgrey
}
.list-group-item.open{
    background-color:  lightgrey
}
</style>
