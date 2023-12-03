<script setup>
  import { ref, watch, computed } from 'vue'
  import { useCategoriesStore } from "../../stores/categories.js"

  const categoriesStore = useCategoriesStore()
  
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
