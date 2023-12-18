<script setup>
import { ref, onMounted, watchEffect , inject} from 'vue';
import { Bar, Line, Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PieController, LineController, LineElement, PointElement } from 'chart.js';
import { useStatisticsStore } from '../../stores/statistics.js';

const axios = inject("axios")

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PieController,
  LineController,
  LineElement,
  PointElement
);

const loaded = ref(false);
const chartDataVCardBalances = ref(null);
const chartDataStatistics = ref(null);
const chartDataActiveVcards = ref(null);
const chartDataStatisticTypes = ref(null);
const chartDataPaymentTypes = ref(null);
const chartDataStatisticDates = ref(null);
const statisticStore = useStatisticsStore();

watchEffect(() => {
  loadChartData();
});

onMounted(() => {
  loadChartData();
});

async function loadChartData() {
  loaded.value = false;

  try {
    const response = await axios.get('/vcards');
    const vCards = response.data.data;

    const totalBalances = vCards.reduce((total, vcard) => total + parseFloat(vcard.balance), 0);

    chartDataVCardBalances.value = {
      labels: ['Total vCard Balances'],
      datasets: [{
        label: 'Total vCard Balances',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data: [totalBalances.toFixed(2)],
      }],
    };
	
    // Calculate the total count of active vCards
    const activeVCardCount = vCards.filter(vcard => !vcard.blocked).length;

    chartDataActiveVcards.value = {
      labels: ['Total number of vCards', 'Active vCards'],
      datasets: [{
        label: 'Total number of vCards',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data: [vCards.length, null],
      }, {
        label: 'Active vCards',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
        data: [null, activeVCardCount],
      }],
    };

    // Load statistics for all users (admin)
    await statisticStore.loadAllStatistics();
    const statistics = statisticStore.statistics;

	// Calculate the count of statistics per type
	const statisticTypes = statistics.reduce((types, statistic) => {
	  const type = statistic.type === 'C' ? 'Credit' : 'Debit';
	  types[type] = (types[type] || 0) + 1;
	  return types;
	}, {});

	chartDataStatisticTypes.value = {
	  labels: Object.keys(statisticTypes),
	  datasets: [{
		data: Object.values(statisticTypes),
		backgroundColor: [
		  'rgba(255, 99, 132, 0.7)',
		  'rgba(54, 162, 235, 0.7)',
		],
		borderColor: [
		  'rgba(255, 99, 132, 1)',
		  'rgba(54, 162, 235, 1)',
		],
		borderWidth: 1,
	  }],
	};
	
	// Calculate the count of statistics per payment type
    const paymentTypes = statistics.reduce((types, statistic) => {
      const type = statistic.payment_type;
      types[type] = (types[type] || 0) + 1;
      return types;
    }, {});

    chartDataPaymentTypes.value = {
      labels: Object.keys(paymentTypes),
      datasets: [{
        data: Object.values(paymentTypes),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      }],
    };
	
	// Calculate the count of transactions per date
    const statisticDates = statistics.reduce((dates, statistic) => {
      const date = statistic.datetime.split(' ')[0]; // Extract the date part
      dates[date] = (dates[date] || 0) + 1;
      return dates;
    }, {});

    chartDataStatisticDates.value = {
      labels: Object.keys(statisticDates),
      datasets: [{
        label: 'Number of Transactions per Date (Current Month)',
        data: Object.values(statisticDates),
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      }],
    };
	

    loaded.value = true;
  } catch (e) {
    console.error(e);
  }
}
</script>

<template>
  <div class="container">
    <h1 class="page-title">Statistics</h1>
    <div class="grid-container">
      <div class="grid-item bordered-item">
        <Bar v-if="loaded" :data="chartDataVCardBalances" />
      </div>
      <div class="grid-item bordered-item">
        <Bar v-if="loaded" :data="chartDataActiveVcards" />
      </div>
      <div class="grid-item bordered-item">
        <Pie v-if="loaded" :data="chartDataStatisticTypes" />
      </div>
      <div class="grid-item bordered-item">
        <Pie v-if="loaded" :data="chartDataPaymentTypes" />
      </div>
      <div class="grid-item bordered-item">
        <Line v-if="loaded" :data="chartDataStatisticDates" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.grid-item {
}

.bordered-item {
  border: 1px solid #555;
}

.page-title {
  text-align: center;
  margin-bottom: 20px;
}

.grid-item:nth-child(5) {
  grid-column: span 2;
  text-align: center;
}
</style>
