<script setup>
import { ref, onMounted, computed } from 'vue'
import IconSelectModal from "../IconSelectModal.vue"

const props = defineProps({
  category: Object
})

const emit = defineEmits(['hide', 'update'])

const editCategory = ref(Object.assign({}, props.category))

const inputName = ref(null)
const imputIcon = ref(null)

const isModalOpened = ref(false);

const openModal = () => {
  isModalOpened.value = true;
};
const closeModal = () => {
  isModalOpened.value = false;
};

const submitHandler = (selection)=>{
  editCategory.value.icon = "bi-"+selection;
    isModalOpened.value = false;
};



const showErrors = ref(false) // just for testing the errors presentation/layout

const save = () => {
  emit('update', editCategory.value)
  emit('hide')
}

const cancel = () => {
  emit('hide')
}

const iconStyle = computed (() =>
  editCategory.value.type=='C' ? 'btn-success' : 'btn-warning'
)

onMounted(() => {
  inputName.value.focus()
})

</script>

<template>
  <div class="editor">
    <form action="#" class="d-flex align-items-center">
      &nbsp
      <div class="">
            <button :class=" iconStyle +' btn btn-secondary d-block ' + editCategory.icon" @click.prevent=openModal>
            </button>
        </div>
        &nbsp
      <div class="me-3 flex-grow-1">
        <div class="">
          <input id="inputName" type="text" class="form-control" ref="inputName"
                placeholder="Enter the category name" v-model="editCategory.name">
        </div>
        <div class="error" v-show="showErrors">Show error if necessary</div>
      </div>
      <div class="me-0">
        <div class="d-flex flex-wrap">
            <button type="submit" class="btn btn-primary" @click.prevent.stop="save">
                <i class="bi-check-lg" aria-hidden="true"></i> Save
            </button>
          <button type="button" class="btn btn-secondary" @click.stop="cancel">
                <i class="bi-x-lg" aria-hidden="true"></i> Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
  
  <div>
      <IconSelectModal :isOpen="isModalOpened" @modal-close="closeModal" @select="submitHandler" name="first-modal">
      </IconSelectModal>
  </div>
</template>