<script setup>
  import { ref, watch, computed, onMounted } from 'vue'
  import { useCategoriesStore } from "../../stores/categories.js"

  import { useUserStore } from "../../stores/user.js"

  const categoriesStore = useCategoriesStore()
  categoriesStore.loadCategories()
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
    let method = ""
    if(props.operationType == 'insert'){
      if(userStore.userType == 'V') method = 'Debit'
      else method = 'Credit'
    }else method = editingTransaction.value.type === 'C' ? 'Credit' : 'Debit'
    
    if (!editingTransaction.value) {
        return ''
      }
      return props.operationType == 'insert' ? 'New ' + method + ' Transaction' : method + ' Transaction #' + editingTransaction.value.id
  })

  const save = () => {
      emit('save', editingTransaction.value)
  }

  const cancel = () => {
      emit('cancel', editingTransaction.value)
  }

  const isValidReference = computed(()=>{
    if(editingTransaction.value.value >= 0.01 && editingTransaction.value.value <= userStore.accountBalance && editingTransaction.value.value <= userStore.maxDebit){
      const reference = editingTransaction.value.payment_reference;

      switch (editingTransaction.value.payment_type) {
        case "VCARD":
          return /^9\d{8}$/.test(reference);
        case "MBWAY":
          return /^9\d{8}$/.test(reference);
        case "PAYPAL":
          return /^xx/.test(reference) && /\S+@\S+\.\S+/.test(reference);
        case "IBAN":
          return /^XX/.test(reference);
        case "MB": 
          return /^9\d+/.test(reference);
        case "VISA":
          return /^40\d+/.test(reference);
      }
    }
    return false
  })

  onMounted(async () => {
    if(!editingTransaction.value && userStore.userType == 'A' || editingTransaction.value.type == 'C'){
        editingTransaction.value.type = 'C'
      }
      else{
        editingTransaction.value.type = 'D'
      }
  })
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
      <div class="mb-3 me-3 flex-grow-1">
        <label for="inputMethod" class="form-label">{{userStore.userType=='V' ? 'Destination' : 'Origin'}}</label>
        <select class="form-select" 
        :class="{ 'is-invalid': errors ? errors['payment_type'] : false }"
          id="inputMethod" v-model="editingTransaction.payment_type">
          <option v-if="userStore.userType=='V'"  value="VCARD">vCard</option>
          <option value="MBWAY">MBWAY</option>
          <option value="PAYPAL">PayPal</option>
          <option value="IBAN">Transfer</option>
          <option value="MB">Multibanco</option>
          <option value="VISA">VISA</option>
        </select>
        <field-error-message :errors="errors" fieldName="status"></field-error-message>
      </div>
      <div class="mb-3 ms-xs-3 flex-grow-1">
        <label for="inputReference" class="form-label">Reference</label>
        <input type="text" class="form-control" :class="{ 'is-invalid': errors ? errors['payment_reference'] : false }"
          id="inputReference" required
          v-model="editingTransaction.payment_reference">
          
        <field-error-message :errors="errors" fieldName="reference"></field-error-message>
      </div>
    </div>
    <div class="d-flex flex-wrap justify-content-between">
      <div class="mb-3 me-3 flex-grow-1" v-if="userStore.userType=='V'">
        <label for="inputCategory" class="form-label">Category</label>
        <select class="form-select pe-2" :class="{ 'is-invalid': errors ? errors['category'] : false }"
          id="inputCategory" v-model="editingTransaction.category_id">
          <option :value="null">-- No Category --</option>
          <option v-for="category in categoriesStore.categories.filter(
            category => category.type == editingTransaction.type)"
            :key="category.id" :value="category.id">{{category.name}}
          </option>
        </select>
        <field-error-message :errors="errors" fieldName="category_id"></field-error-message>
      </div>
      <!--vcard destino-->
      <div class="mb-3 me-3 flex-grow-1" v-else>
        <label for="inputVcard" class="form-label">Destination vCard</label>
        <input type="text" class="form-control" :class="{ 'is-invalid': errors ? errors['vcard'] : false }"
          id="inputVcard" required
          v-model="editingTransaction.vcard">
        <field-error-message :errors="errors" fieldName="category_id"></field-error-message>
      </div>
      <div class="mb-3 me-3 flex-grow-1">
        <label for="inputValue" class="form-label">Value</label>
        <input type="number" class="form-control" :class="{ 'is-invalid': errors ? errors['value'] : false }"
          id="inputValue" placeholder=0 required v-model="editingTransaction.value">
        <field-error-message :errors="errors" fieldName="value"></field-error-message>
      </div>
    </div>
    
    <div class="mb-3">
      <label
        for="inputDescription"
        class="form-label"
      >Description</label>
      <textarea rows="5" class="form-control" :class="{ 'is-invalid': errors ? errors['description'] : false }"
        id="inputDescription" placeholder="Description" v-model="editingTransaction.description">
      </textarea>
      <field-error-message :errors="errors" fieldName="description"></field-error-message>
    </div>
    <div class="mb-3 d-flex justify-content-end">
      <button :disabled="!isValidReference"
        type="button"
        class="btn btn-primary px-5"
        @click="save"
      >Save</button>
      <button
        type="button"
        class="btn btn-light px-5"
        @click="cancel"
      >Cancel</button>
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
