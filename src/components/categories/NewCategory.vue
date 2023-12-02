<script setup>
import { ref, onMounted, inject } from 'vue'

const newCategory = ref('')
const showErrors = ref(false) // just for testing the errors presentation/layout

const categoryinput = ref(null)

const emit = defineEmits([
    'add'
])

const addCategory = () => {
    if (newCategory.value.trim()) {
        emit('add', {
            name: newCategory.value,
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
        <div>New Category</div>
        <div class="d-flex mb-4">
            <div class="flex-grow-1">
                <div class="input-group">
                    <input ref="categoryinput" type="text" class="form-control" placeholder="Enter the new category's name"
                        aria-label="Enter the new category's name" aria-describedby="button-new-category" v-model="newCategory">
                    <button id="button-new-category" type="submit" class="btn btn-primary" @click.prevent="addCategory">
                        <i class="bi-plus-lg" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="error" v-show="showErrors">Show error if necessary</div>
            </div>
        </div>

    </form>
</template>