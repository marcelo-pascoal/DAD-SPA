<script setup>
import { useRouter } from 'vue-router'
import { ref, computed, onMounted, inject } from 'vue'

const axios = inject('axios')
const router = useRouter()

const filterByType = ref(null)
const filterByPair = ref(null)
const filterByMin = ref(null)
const filterByMax = ref(null)

const transactions = ref([]);
const currentPage = ref(1);

const loadTransactions = async () => {
  try {
    const response = await axios.get('transactions', {
  params: {
    page: currentPage.value
  }
});

    transactions.value = response
    return transactions.value
  } catch (error) {
    clearTransactions();
    throw error;
  }
}
function clearTransactions() {
  transactions.value = []
}

const addTransaction = () => {
    router.push({ name: 'NewTransaction' })
}

const editTransaction = (transaction) => {
  router.push({ name: 'Transaction', params: { id: transaction.id } })
}

const goToPage = async (item) => {
  currentPage.value = item;
  await loadTransactions()
}

const backPage = () => {
  currentPage.value--;
  loadTransactions()
}

const nextPage = async () => {
  currentPage.value++;
  await loadTransactions()
}
onMounted( async () => {
  await loadTransactions()
})

</script>

<template>
  <div class="d-flex justify-content-between">
    <div class="mx-2">
      <h3 class="mt-4">Transactions</h3>
    </div>
  </div>
  <div class="mb-3 d-flex justify-content-between flex-wrap">
    <div class="mx-2 mt-2">
      <button type="button"  class="btn btn-success px-4 btn-addtr" @click="addTransaction">
        <i class="bi bi-xs bi-plus-circle"></i>&nbsp; Add Transaction
      </button>
    </div>
  </div>
  <div v-if="transactions.data">
  <table class="table">
    <thead>
      <tr>
        <th>#</th>
        <th>Date</th>
        <th>Type</th>
        <th>Value</th>
        <th>Balance</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="transaction in transactions.data.data" :key="transaction.id">
        <td>{{ transaction.id }}</td>
        <td>{{ transaction.datetime }}</td>
        <td>{{ transaction.type }}</td>
        <td>{{ transaction.value }}</td>
        <td>{{ transaction.new_balance }}</td>
        <td class="text-end">
          <div class="d-flex justify-content-end">
            <button class="btn btn-xs btn-light" @click="editTransaction(transaction)">
              <i class="bi bi-xs bi-pencil"></i>
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <button @click="backPage()" :disabled="currentPage==1">prev</button>
  <button
    v-for="item in transactions.data.meta.last_page"
    :key="item"
    @click="() => goToPage(item)"
    :class="{ selected: item === currentPage }"
    :disabled="item==currentPage"
  >
    {{ item }}
  </button>
  <button @click="nextPage()" :disabled="currentPage==transactions.data.meta.last_page">next</button>
</div>
  
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
.selected {
  background-color: grey
}
</style>
