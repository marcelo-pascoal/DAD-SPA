<script setup>
import { ref, watch, onMounted} from 'vue'
import IconSelectModal from "../IconSelectModal.vue"
import { useCategoriesStore } from "../../stores/categories.js"


const categoriesStore = useCategoriesStore()

const showErrors = ref(false) // just for testing the errors presentation/layout

const newCategoryName = ref('')
const newCategoryIcon = ref('bi-cash')
const newCategoryType = ref('')

const emit = defineEmits([
    'add'
])

const iconStyle = ref('btn-secondary')

const isModalOpened = ref(false);

const openModal = () => {
  isModalOpened.value = true;
};
const closeModal = () => {
  isModalOpened.value = false;
};

const submitHandler = (selection)=>{
    newCategoryIcon.value = "bi-"+selection;
    isModalOpened.value = false;
};

watch(newCategoryType, (newValue) => {
    if (!newValue) iconStyle.value = 'btn-secondary'
      if (newValue=='C') iconStyle.value = 'btn-success'
      else iconStyle.value = 'btn-warning'
    });
    
const addCategory = async () => {
    const newCategory = {
            id: null,
            type: newCategoryType.value,
            name: newCategoryName.value,
            icon: newCategoryIcon.value,
        }
    try {
    await categoriesStore.insertCategory(newCategory)
    toast.success('Category #' + newCategory.id + ' was created successfully.')
    }catch (error) {
        console.log(error)
    }
    newCategoryName.value = ''
    newCategoryIcon.value = 'bi-cash'
}


onMounted(() => {
})

</script>

<template>
    <form action="#">
        <h5>New Category</h5>
        <div>
            <div class="d-flex flex-wrap justify-content-between justify-content-end align-items-end">
                
                <div>
                    <label for="2" >Icon:</label>
                    <button id="2" :class=" iconStyle +' btn btn-secondary d-block ' + newCategoryIcon" @click.prevent=openModal>
                    </button>
                </div>

                <div class="mx-1 mt-1 ">
                    <label for="3">Type:</label>
                    <select id="3" class="form-select" v-model="newCategoryType">
                        <option value="D">Debit</option>
                        <option value="C">Credit</option>
                    </select>
                </div>
                <div class="mx-1 mt-1 flex-grow-1">
                    <label for="newCategoryName">Name:</label>
                    <input id="newCategoryName" type="text" class="form-control" 
                        placeholder="Enter the new category's name" aria-label="Enter the new category's name" 
                        aria-describedby="button-new-category" v-model="newCategoryName">
                </div>
                <div class="mx-1 mt-1 ">
                    <button id="button-new-category" type="button" class="btn btn-success px-4 btn-addtr"
                        @click.prevent="addCategory"><i class="bi bi-xs bi-plus-circle"></i>&nbsp; Add Category
                    </button>
                </div>
            </div>
            <div class="error" v-show="showErrors">Show error if necessary</div>
        </div>
        <div>
            <IconSelectModal :isOpen="isModalOpened" @modal-close="closeModal" @select="submitHandler" name="first-modal">
            </IconSelectModal>
        </div>
    </form>
</template>

<style>
.errors {
    font-size: small;
    display: block;
    color: red;
  }
</style>