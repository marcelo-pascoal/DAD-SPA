<script setup>
    import { Bar } from 'vue-chartjs'
    import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
    import { useTransactionsStore } from "../../stores/transactions.js"
    import { ref, onMounted } from 'vue'

    const transactionsStore = useTransactionsStore()
  
    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

    const loaded = ref(false);
    const chartData = ref(null);
    const name = ref('BarChart');
    const components = ref({ Bar });


  onMounted(async() => {
    loaded.value = false
  
      try {
        await transactionsStore.loadTransactions()
        chartData.value = transactionsStore.transactions
        loaded.value = true
      } catch (e) {
        console.error(e)
      }
})

</script>
<template>
    <div class="container">
      <Bar v-if="loaded" :data="chartData" />
    </div>
  </template>