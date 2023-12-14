<script setup>
import axios from 'axios'
import { useToast } from "vue-toastification"
import { useUserStore } from "../../stores/user.js"
import { useTransactionsStore } from "../../stores/transactions.js"
import { useRouter, onBeforeRouteLeave } from 'vue-router'

import { ref, watch, computed, inject, onMounted} from 'vue'
import TransactionDetail from "./TransactionDetail.vue"


const socket = inject("socket")

const toast = useToast()
const router = useRouter()
const userStore = useUserStore()
const transactionsStore = useTransactionsStore()

const newTransaction = () => { 
  return {
    vcard: null,
    type: null,
    value: null,
    payment_type:null,
    payment_reference:null,
    category_id:null,
    description:'',
  }
}

const transaction = ref(newTransaction())
const errors = ref(null)
const confirmationLeaveDialog = ref(null)

let originalValueStr = JSON.stringify(transaction.value)

const loadTransaction = async (id) => {
    originalValueStr = ''
    errors.value = null
    if (!id || (id < 0)) {
      transaction.value = newTransaction()
      originalValueStr = JSON.stringify(transaction.value)
    } else {
      try {
        const response = await axios.get('transactions/' + id)
        transaction.value = response.data.data
        originalValueStr = JSON.stringify(transaction.value)
      } catch (error) {
        console.log(error)
      }      
    }
  }

const save = async () => {
  errors.value = null
  if (operation.value == 'insert') {
    try {
      
      transaction.value.type = userStore.userType == 'V' ? 'D' : 'C'
      transaction.value = await transactionsStore.insertTransaction(transaction.value)
      originalValueStr = JSON.stringify(transaction.value)
      toast.success('Transaction #' + transaction.value.id + ' was created successfully.')
      router.back()
    } catch (error) {
      console.log(error)
      if (error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error('Transaction was not created due to validation errors!')
      } else {
        toast.error('Transaction was not created due to unknown server error!')
      }
    }
  } else {
    try {
      transaction.value = await transactionsStore.updateTransaction(transaction.value)
      originalValueStr = JSON.stringify(transaction.value)
      toast.success('Transaction #' + transaction.value.id + ' was updated successfully.')
      router.back()
    } catch (error) {
      if (error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error('Transaction #' + props.id + ' was not updated due to validation errors!')
      } else {
        toast.error('Transaction #' + props.id + ' was not updated due to unknown server error!')
      }
    }
  }
}    

const cancel = () => {
  originalValueStr = JSON.stringify(transaction.value)
  router.back()
}

const props = defineProps({
    id: {
      type: Number,
      default: null
    }
  })

const operation = computed(() => {
  return (!props.id || props.id < 0) ? 'insert' : 'update'
})

watch(
  () => props.id, 
  (newValue) => {
        loadTransaction(newValue)
  }, {
    immediate: true,
  }
)

let nextCallBack = null
const leaveConfirmed = () => {
  if (nextCallBack) {
    nextCallBack()
  }
}

onBeforeRouteLeave((to, from, next) => {
  nextCallBack = null
  let newValueStr = JSON.stringify(transaction.value)
  if (userStore.userId != -1 && originalValueStr != newValueStr) {
    // Some value has changed - only leave after confirmation
    nextCallBack = next
    confirmationLeaveDialog.value.show()
  } else { 
    // No value has changed, so we can leave the component without confirming
    next()
  }
}) 

onMounted(() =>{
  originalValueStr=JSON.stringify(transaction.value)
})

</script>

<template>
  <confirmation-dialog
    ref="confirmationLeaveDialog"
    confirmationBtn="Discard changes and leave"
    msg="Do you really want to leave? You have unsaved changes!"
    @confirmed="leaveConfirmed">
  </confirmation-dialog>
  <TransactionDetail :operationType="operation" :transaction="transaction"
    :errors="errors" @save="save" @cancel="cancel">
  </TransactionDetail>
</template>
