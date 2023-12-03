<script setup>
  import { ref, watch, computed } from 'vue'
  import { useCategoriesStore } from "../../stores/categories.js"

  import { useUserStore } from "../../stores/user.js"

  const categoriesStore = useCategoriesStore()
  const userStore = useUserStore()
  
  const props = defineProps({
    transaction: {
      type: Object,
      required: true
    },
    operationType: {
      type: String,
      default: 'insert'
    },
    errors: {
      type: Object,
      required: false,
    },
  })

  const emit = defineEmits(['save', 'cancel'])

  const editingTransaction = ref(props.transaction)

  watch(() => props.transaction, (newTransaction) => { 
      editingTransaction.value = newTransaction 
    }
  )

  const transactionTitle = computed(()=>{
    if (!editingTransaction.value) {
        return ''
      }
      return props.operationType == 'insert' ? 'New Transaction' : 'Transaction #' + editingTransaction.value.id
  })

  const save = () => {
      emit('save', editingTransaction.value)
  }

  const cancel = () => {
      emit('cancel', editingTransaction.value)
  }

</script>

<template>
  <form
    class="row g-3 needs-validation"
    novalidate
    @submit.prevent="save"
  >
    <h3 class="mt-5 mb-3">{{ transactionTitle }}</h3>
    <hr>

    <div class="d-flex flex-wrap justify-content-between">
      <div class="mb-3 ms-xs-3 flex-grow-1">
        <label for="inputType" class="form-label" >Type</label>
        <div>
          <button class="btn btn-xs btn-light" disabled>
                <i class="bi bi-xs bi-cash" v-if="!editingTransaction.value && userStore.userType === 'A' || editingTransaction.value === 'C'" ></i>
                <i class="bi bi-xs bi-cart3" v-else></i>
          </button>
        </div>
      </div>
      <div class="mb-3 me-3 flex-grow-1">
        <label for="inputValue" class="form-label">Value</label>
        <input type="number" class="form-control" :class="{ 'is-invalid': errors ? errors['value'] : false }"
          id="inputValue" placeholder=0 required v-model="editingTransaction.value">
        <field-error-message :errors="errors" fieldName="value"></field-error-message>
      </div>
    </div>

  </form>
</template>

<style scoped>
.total_price {
  width: 26rem;
}
.checkBilled {
  margin-top: 0.4rem;
  min-height: 2.375rem;
}
</style>
