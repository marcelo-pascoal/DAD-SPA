<script setup>
import { ref, onMounted, watchEffect , inject} from 'vue';
import { Bar, Line, Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PieController, LineController, LineElement, PointElement } from 'chart.js';
import { useTransactionsStore } from '../../stores/transactions.js';

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
const chartDataTransactions = ref(null);
const chartDataActiveVcards = ref(null);
const chartDataTransactionTypes = ref(null);
const chartDataPaymentTypes = ref(null);
const chartDataTransactionDates = ref(null);
const transactionsStore = useTransactionsStore();

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

    // Load transactions for all users (admin)
    await transactionsStore.loadAllTransactions();
    const transactions = transactionsStore.transactions;

	// Calculate the count of transactions per type
	const transactionTypes = transactions.reduce((types, transaction) => {
	  const type = transaction.type === 'C' ? 'Credit' : 'Debit';
	  types[type] = (types[type] || 0) + 1;
	  return types;
	}, {});

	chartDataTransactionTypes.value = {
	  labels: Object.keys(transactionTypes),
	  datasets: [{
		data: Object.values(transactionTypes),
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
	
	// Calculate the count of transactions per payment type
    const paymentTypes = transactions.reduce((types, transaction) => {
      const type = transaction.payment_type;
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
    const transactionDates = transactions.reduce((dates, transaction) => {
      const date = transaction.datetime.split(' ')[0]; // Extract the date part
      dates[date] = (dates[date] || 0) + 1;
      return dates;
    }, {});

    chartDataTransactionDates.value = {
      labels: Object.keys(transactionDates),
      datasets: [{
        label: 'Number of Transactions per Date',
        data: Object.values(transactionDates),
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
  <div>
    <Bar v-if="loaded" :data="chartDataVCardBalances" />
	<Bar v-if="loaded" :data="chartDataActiveVcards" />
	<Pie v-if="loaded" :data="chartDataTransactionTypes" />
	<Pie v-if="loaded" :data="chartDataPaymentTypes" />
	<Line v-if="loaded" :data="chartDataTransactionDates" />
  </div>
</template>
