<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  category: Object
})

const emit = defineEmits(['hide', 'update'])

const editCategory = ref(Object.assign({}, props.category))

const inputName = ref(null)
const showErrors = ref(false) // just for testing the errors presentation/layout

const save = () => {
  emit('update', editCategory.value)
  emit('hide')
}

const cancel = () => {
  emit('hide')
}

onMounted(() => {
  inputName.value.focus()
})

</script>

<template>
    <form action="#" class="d-flex">
      <div class="me-3 flex-grow-1">
        <div class="">
          <label for="inputName" class="form-label mb-0">Name</label>
          <input type="text" class="form-control" id="inputName" ref="inputName"
                placeholder="Enter the category name" v-model="editCategory.name">
        </div>
        <div class="error" v-show="showErrors">Show error if necessary</div>
      </div>

      <div class="me-0">
        <div class="d-flex flex-column">
            <button type="submit" class="btn btn-primary" @click.prevent="save">
                <i class="bi-check-lg" aria-hidden="true"></i> Save
            </button>
          <button type="button" class="btn btn-secondary mt-2" @click="cancel">
                <i class="bi-x-lg" aria-hidden="true"></i> Cancel
          </button>
        </div>
      </div>
    </form>
</template>
