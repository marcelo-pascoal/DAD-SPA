<script setup>
import { ref, onMounted, inject } from 'vue'

const newCategory = ref('')
const newCategoryType = ref('')
const showErrors = ref(false) // just for testing the errors presentation/layout

const categoryinput = ref(null)

const emit = defineEmits([
    'add'
])

const addCategory = () => {
    if (newCategory.value.trim()) {
        emit('add', {
            name: newCategory.value,
            type: newCategoryType.value,
            //owner_id: config.userId,
        })
    }
    newCategory.value = ""
    categoryinput.value.focus()
}

onMounted(() => {
    categoryinput.value.focus()
})

</script>

<template>
    <form action="#">
        <h3>New Category</h3>
        <div>
            <div class="d-flex flex-wrap justify-content-between">
                <div class="mb-3 me-3 ">
                    <label for="newCategoryType">Type:</label>
                    <select class="form-select" v-model="newCategoryType">
                        <option value="D">Debit</option>
                        <option value="C">Credit</option>
                    </select>
                </div>
                <div class="flex-grow-1">
                    <label for="newCategory">Name:</label>
                    <input ref="categoryinput" type="text" class="form-control" placeholder="Enter the new category's name"
                        aria-label="Enter the new category's name" aria-describedby="button-new-category" v-model="newCategory">
                </div>
                <button id="button-new-category" type="submit" class="btn btn-primary" @click.prevent="addCategory">
                    <i class="bi-plus-lg" aria-hidden="true"></i>
                </button>
            </div>
            <div class="error" v-show="showErrors">Show error if necessary</div>
        </div>
    </form>
</template>