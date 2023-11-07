<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  vcard: Object
})

const emit = defineEmits(['hide', 'requestUpdateCard'])

const editCard = ref(Object.assign({}, props.vcard))

const showErrors = ref(false) // just for testing the errors presentation/layout

const save = () => {
  emit('requestUpdateCard', editCard.value)
  emit('hide')
}

const cancel = () => {
  emit('hide')
}

onMounted(() => {
})
</script>

<template>
    <form action="#" class="d-flex">
      <div class="me-3">
        <div class="form-check mt-4">
          <input class="form-check-input" type="checkbox" id="blockCheckbox" v-model="editCard.blocked">
          <label class="form-check-label" for="blockCheckbox">Blocked</label>
        </div>
        <div class="error" v-show="showErrors">Show error if necessary</div>
      </div>

      <div class="me-3 flex-grow-1">
        <div class="">
          <label for="maxDebit" class="form-label mb-0 maxDebit">Max Debit</label>
          <input type="text" class="form-control maxDebit" id="maxDebit" ref="maxDebit"
                placeholder="Enter max Debit Value" v-model="editCard.max_debit">
        </div>
        <div class="error" v-show="showErrors">Show error if necessary</div>
      </div>
      <div class="me-0">
        <div class="d-flex flex-column submitBox">
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

<style>

.maxDebit{
    width: 90px;
    text-align: center;
}

#maxDebit {
    background-color: lightgoldenrodyellow;
}

@media (max-width:770px)
{
  .btn.btn-primary , .btn-secondary{
  font-size: 0;
  }
  .btn.btn-primary i , .btn-secondary i{
  font-size: 1rem;
  }  
}
</style>