<script setup>
import { ref, onMounted} from 'vue'

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
            <div class="d-flex flex-wrap justify-content-between justify-content-end align-items-end">
                <div class="mx-1 mt-1 ">
                    <label for="3">Type:</label>
                    <select class="form-select" v-model="newCategoryType">
                        <option value="D">Debit</option>
                        <option value="C">Credit</option>
                    </select>
                </div>
                <div class="mx-1 mt-1 flex-grow-1">
                    <label for="newCategory">Name:</label>
                    <input ref="categoryinput" type="text" class="form-control" 
                        placeholder="Enter the new category's name" aria-label="Enter the new category's name" 
                        aria-describedby="button-new-category" v-model="newCategory">
                </div>
                <div class="mx-1 mt-1 ">
                    <button id="button-new-category" type="button" class="btn btn-success px-4 btn-addtr"
                        @click.prevent="addCategory"><i class="bi bi-xs bi-plus-circle"></i>&nbsp; Add Category
                    </button>
                </div>
            </div>
            <div class="error" v-show="showErrors">Show error if necessary</div>
        </div>
    </form>
</template>