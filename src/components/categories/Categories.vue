<script setup>
import { useToast } from "vue-toastification"
import { ref, computed, onMounted } from 'vue'
import CategoryList from './CategoryList.vue'
import NewCategory from './NewCategory.vue'
import { useCategoriesStore } from "../../stores/categories.js"

const toast = useToast()

const filterByName = ref('')
const filterByType = ref('')
const categoriesStore = useCategoriesStore()
const categoryToDelete = ref(null)
const deleteConfirmationDialog = ref(null)

const loadCategories = async () => {
  try {
    await categoriesStore.loadCategories()
  } catch (error) {
    console.log(error)
  }
}

const deleteCategory = async (category) => {
  categoryToDelete.value = category
  deleteConfirmationDialog.value.show()
}

const deleteCategoryConfirmed = async () => {
  try {
    await categoriesStore.deleteCategory(categoryToDelete.value)
    toast.info(`Category ${categoryToDeleteDescription.value} was deleted`)
  } catch (error) {
    console.log(error)
    toast.error(`It was not possible to delete Category ${categoryToDeleteDescription.value}!`)
  }  
}

const categoryToDeleteDescription = computed(() => categoryToDelete.value
    ? `#${categoryToDelete.value.id} (${categoryToDelete.value.name})`
    : "")

const filteredCategories = computed(() =>
  categoriesStore.getCategoriesByFilter(filterByType.value, filterByName.value)
)

const totalCategories = computed(() =>
  categoriesStore.getCategoriesByFilterTotal(filterByType.value, filterByName.value)
) 

const updateCategory = async (category) => {
  try {
    await categoriesStore.updateCategory(category)
    toast.info(`Category ${categoryToDeleteDescription.value} was updated`)
  } catch (error) {
    console.log(error)
    toast.error(`It was not possible to update Category ${category.value}!`)
  }  
}

onMounted(async () => {
  loadCategories()
})

</script>

<template>
  <confirmation-dialog
    ref="deleteConfirmationDialog"
    confirmationBtn="Delete category"
    :msg="`Do you really want to delete the category ${categoryToDeleteDescription}?`"
    @confirmed="deleteCategoryConfirmed">
  </confirmation-dialog>

  <div class="container">
    <h5 class="mt-3">New Categry</h5>
    <NewCategory></NewCategory>
    <hr>
    <h5 class="mt-3">Categories</h5>
    <div class="d-flex flex-wrap justify-content-between">
      <div class="mb-3 me-3 flex-grow-1">
        <label for="selectName" class="form-label" >Filter by name:</label>
        <input id="selectName" ref="categoryinput" type="text" class="form-control" v-model="filterByName">
      </div>
      <div class="mb-3 ms-xs-3 flex-grow-1">
        <label for="selectType" class="form-label">Filter by type:</label>
        <select class="form-select" id="selectType" v-model="filterByType">
          <option :value="null"></option>
          <option value="C">Credit</option>
          <option value="D">Debit</option>
        </select>
      </div>
    </div>
    <div>
      <CategoryList :categories="filteredCategories" :readonly="false" 
          @delete="deleteCategory" @update="updateCategory">
        </CategoryList>
    </div>
  </div>
</template>

<style>
  .error {
    font-size: small;
    display: block;
    color: red;
    margin: 3px 0 5px 8px;
    /* margin: -15px 0 6px 16px; */
  }

  span.error {
    font-size: small;
    display: block;
    color: red;
  }

</style>