<script setup>
import { useToast } from "vue-toastification"
import { ref, computed, onMounted } from 'vue'
import CategoryList from './CategoryList.vue'
import NewCategory from './NewCategory.vue'
import { useCategoriesStore } from "../../stores/categories.js"

const toast = useToast()

const filterByName = ref('')
const filterByType = ref('')

const newCategory = () => { 
  return {
    id: null,
    type: '',
    name: '',
  }
}

const category = ref(newCategory())
const categoriesStore = useCategoriesStore()
const errors = ref(null)
const categoryToDelete = ref(null)
const deleteConfirmationDialog = ref(null)

const loadCategories = async () => {
  try {
    await categoriesStore.loadCategories()
  } catch (error) {
    console.log(error)
  }
}

const addCategory = async (newCategory) => {
  errors.value = null
  if (newCategory) {
    try {
      category.value = await categoriesStore.insertCategory(newCategory)
      toast.success('Category #' + category.value.id + ' was created successfully.')
    }catch (error) {
      if (error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error('Category was not created due to validation errors!')
      } else {
        toast.error('Category was not created due to unknown server error!')
      }
    }
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

const refresh = async () => {
  loadCategories()
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
    <h1>Categories</h1>
    <NewCategory @add="addCategory"></NewCategory>
    <div class="d-flex">
      <div class="flex-grow-1">
        <h3 class="mt-3">Category List</h3>
      </div>
      <div class="flex-grow-0 d-flex flex-column justify-content-end">
        <button type="button" class="btn btn-dark" @click="refresh">
            <i class="bi-repeat" aria-hidden="true"></i> Refresh
        </button>
      </div>
    </div>
    <hr>
    <div class="d-flex flex-wrap justify-content-between">
      <div class="mb-3 me-3 flex-grow-1">
        <label for="selectName" class="form-label" >Filter by name:</label>
        <input ref="categoryinput" type="text" class="form-control" v-model="filterByName">
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
      <hr>
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

  .errors {
    font-size: small;
    display: block;
    color: red;
  }

</style>