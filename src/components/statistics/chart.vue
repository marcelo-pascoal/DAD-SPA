<script setup>
import { Bar, Line, Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PieController, ArcElement, DoughnutController, LineController, LineElement, PointElement } from 'chart.js';
import { useStatisticsStore } from "../../stores/statistics.js";
import { useUserStore } from '../../stores/user.js';
import { useCategoriesStore } from "../../stores/categories.js";
import ChartsAdmin from './chartAdmin.vue';
import { ref, onMounted, watchEffect } from 'vue';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  DoughnutController,
  LineController,
  LineElement,
  PointElement
);

const statisticsStore = useStatisticsStore();
const userStore = useUserStore();
const categoriesStore = useCategoriesStore();

const loaded = ref(false);
const chartDataTotal = ref(null);
const chartDataCredit = ref(null);
const chartDataDebit = ref(null);
const chartDataPie = ref(null);
const chartDataBalanceOverTime = ref(null);
const chartDataCategories = ref(null);
const chartDataVCardPairs = ref(null);

watchEffect(() => {
  loadChartData();
});

onMounted(() => {
  loadChartData();
});

async function loadChartData() {
  loaded.value = false;

  try {
    if (userStore.userType !== 'A') {
      const defaultFilters = {};

      // Load statistics
      await statisticsStore.loadStatistics(defaultFilters);
      const totalStatistics = statisticsStore.statistics;

      // Load categories
      await categoriesStore.loadCategories();
      const allCategories = categoriesStore.categories;

	  const statisticsPerCategory = allCategories.reduce((acc, category) => {
		  const categoryStatistics = totalStatistics.filter(
			(statistic) => statistic.category_id === category.id
		  );
		  acc[category.name] = categoryStatistics.length;
		  return acc;
	  }, {});

      chartDataCategories.value = {
        labels: Object.keys(statisticsPerCategory),
        datasets: [{
          label: 'Transactions per Category',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          data: Object.values(statisticsPerCategory),
        }],
      };

      // Load vCard pairs
      const vCardPairs = [...new Set(totalStatistics.map(statistic => statistic.pair_vcard))];

      const statisticsPerVCardPair = vCardPairs.reduce((acc, pair_vcard) => {
        const pairStatistics = totalStatistics.filter(
          (statistic) => statistic.pair_vcard === pair_vcard
        );
        acc[pair_vcard || 'N/A'] = pairStatistics.length;
        return acc;
      }, {});

      chartDataVCardPairs.value = {
        labels: Object.keys(statisticsPerVCardPair),
        datasets: [{
          label: 'Transactions per vCard Pair',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          data: Object.values(statisticsPerVCardPair),
        }],
      };

      const groupedByType = totalStatistics.reduce((acc, statistic) => {
        const type = statistic.type;
        if (!acc[type]) {
          acc[type] = { count: 0, value: 0 };
        }
        acc[type].count++;
        acc[type].value += parseFloat(statistic.value);
        return acc;
      }, {});

      chartDataTotal.value = {
        labels: ['Total Transactions'],
        datasets: [{
          label: 'Total Transactions',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          data: [totalStatistics.length],
        }],
      };

      // Define filters based on API parameters
      const filtersCredit = { type: 'C' };
      const filtersDebit = { type: 'D' };

      // Load credit and debit statistics separately
      await statisticsStore.loadStatistics(filtersCredit);
      const creditStatistics = statisticsStore.statistics;

      await statisticsStore.loadStatistics(filtersDebit);
      const debitStatistics = statisticsStore.statistics;

      chartDataCredit.value = {
        labels: ['Credit Transactions'],
        datasets: [{
          label: 'Credit Transactions',
          backgroundColor: 'rgba(144, 238, 144, 0.2)',
          borderColor: 'rgba(144, 238, 144, 1)',
          borderWidth: 1,
          data: [creditStatistics.length],
        }],
      };

      chartDataDebit.value = {
        labels: ['Debit Transactions'],
        datasets: [{
          label: 'Debit Transactions',
          backgroundColor: 'rgba(255, 255, 0, 0.2)',
          borderColor: 'rgba(255, 255, 0, 1)',
          borderWidth: 1,
          data: [debitStatistics.length],
        }],
      };

      chartDataPie.value = {
        labels: ['Credit', 'Debit'],
        datasets: [{
          label: 'Total Value €',
          backgroundColor: ['rgba(144, 238, 144, 0.2)', 'rgba(255, 255, 0, 0.2)'],
          borderColor: ['rgba(144, 238, 144, 1)', 'rgba(255, 255, 0, 1)'],
          borderWidth: 1,
          data: [
            groupedByType['C'] ? groupedByType['C'].value.toFixed(2) : 0,
            groupedByType['D'] ? groupedByType['D'].value.toFixed(2) : 0,
          ],
        }],
      };

    // Get dates and balances for the vCard over time
	const vCardBalanceOverTime = totalStatistics.reduce((acc, statistic) => {
	  const dateParts = statistic.datetime.split(/[- :]/);
	  const statisticDate = new Date(
		dateParts[0],
		dateParts[1] - 1,
		dateParts[2],
		dateParts[3],
		dateParts[4],
		dateParts[5]
	  );

	  const date = statisticDate.toLocaleDateString();
	  const balanceChange = parseFloat(statistic.value);
	  acc[date] = (acc[date] || 0) + balanceChange;
	  return acc;
	}, {});

      chartDataBalanceOverTime.value = {
        labels: Object.keys(vCardBalanceOverTime),
        datasets: [{
          label: 'vCard Balance Over Time',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: false,
          data: Object.values(vCardBalanceOverTime),
        }],
      };
    } else {
      // User is an admin
      chartDataTotal.value = null;
      chartDataCredit.value = null;
      chartDataDebit.value = null;
      chartDataPie.value = null;
      chartDataBalanceOverTime.value = null;
	  chartDataCategories.value = null;
	  chartDataVCardPairs.value = null;
    }

    loaded.value = true;
  } catch (e) {
    console.error(e);
  }
}
</script>

<template>
  <div class="container">
    <template v-if="userStore.userType === 'V'">
      <Bar v-if="loaded" :data="chartDataTotal" />
      <Bar v-if="loaded" :data="chartDataCredit" />
      <Bar v-if="loaded" :data="chartDataDebit" />
      <Pie v-if="loaded" :data="chartDataPie" />
      <Line v-if="loaded" :data="chartDataBalanceOverTime" />
	  <Bar v-if="loaded" :data="chartDataCategories" />
	  <Bar v-if="loaded" :data="chartDataVCardPairs" />
    </template>
	<ChartsAdmin v-else />
  </div>
</template>
