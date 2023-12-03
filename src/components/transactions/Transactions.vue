<script setup>
import { useToast } from "vue-toastification"
import { useRouter } from 'vue-router'
import { useTransactionsStore } from "../../stores/transactions.js"
import { ref, computed, onMounted } from 'vue'
import TransactionTable from "./TransactionTable.vue"

const toast = useToast()
const router = useRouter()
const transactionsStore = useTransactionsStore()

const filterByType = ref(null)
const filterByPair = ref(null)
const filterByMin = ref(null)
const filterByMax = ref(null)

const loadTransactions = async () => {
  try {
    await transactionsStore.loadTransactions()
  } catch (error) {
    console.log(error)
  }
}

const addTransaction = () => {
    router.push({ name: 'NewTransaction' })
}

const editTransaction = (transaction) => {
  router.push({ name: 'Transaction', params: { id: transaction.id } })
}

const filteredTransactions = computed(() =>
  transactionsStore.getTransactionsByFilter(filterByType.value, filterByPair.value, filterByMin.value, filterByMax.value)
)

const totalTransactions = computed(() =>
  transactionsStore.getTransactionsByFilterTotal(filterByType.value, filterByPair.value, filterByMin.value, filterByMax.value)
)

onMounted(() => {
  loadTransactions()
})

</script>

<template>
  <div class="d-flex justify-content-between">
    <div class="mx-2">
      <h3 class="mt-4">Transactions</h3>
    </div>
    <div class="mx-2 total-filtro">
      <h5 class="mt-4">Total: {{ totalTransactions }}</h5>
    </div>
  </div>
  <hr>
  <div class="mb-3 d-flex justify-content-between flex-wrap">
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label for="selectType" class="form-label">Filter by type:</label>
      <select class="form-select" id="selectType" v-model="filterByType">
        <option :value="null"></option>
        <option value="C">Credit</option>
        <option value="D">Debit</option>
      </select>
    </div>
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label for="selectPair" class="form-label">Filter by Pair:</label>
      <input type="text" class="form-control" id="selectPair"
        v-model="filterByPair" placeholder="Enter vCard pair"/>
    </div>
    <div class="mx-2 mt-2">
      <button type="button"  class="btn btn-success px-4 btn-addtr" @click="addTransaction">
        <i class="bi bi-xs bi-plus-circle"></i>&nbsp; Add Transaction
      </button>
    </div>
  </div>
  <transaction-table :transactions="filteredTransactions" @edit="editTransaction"> </transaction-table>
</template>

<style scoped>
.filter-div {
  min-width: 12rem;
}
.total-filtro {
  margin-top: 0.35rem;
}
.btn-addtr {
  margin-top: 1.85rem;
}
</style>
