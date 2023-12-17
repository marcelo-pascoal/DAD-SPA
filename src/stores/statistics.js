import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'

export const useStatisticsStore = defineStore('statistics', () => {

    const axios = inject("axios")

    const statistics = ref([])

    const totalStatistics = computed(() => {
        return transcations.value.length
    })

    function getStatisticsByFilter(type, vcard, min, max) {
        return statistics.value.filter( tr =>
            (!type || type == tr.type) &&
            (!vcard || vcard == tr.pair_vcard) &&
            (!min || min <= tr.value) &&
            (!max || max >= tr.value)
        )
    }

    function getStatisticsByFilterTotal(type, vcard, min, max) {
        return statistics.value.reduce((acumulador, tr) =>
            (
                (!type || type == tr.type) &&
                (!vcard || vcard == tr.pair_vcard) &&
                (!min || min <= tr.value) &&
                (!max || max >= tr.value)
                )
                ? acumulador + 1
                : acumulador
            , 0)
    }

    function clearStatistics() {
      statistics.value = []
    }

	async function loadStatistics(type = null, pair_vcard = null, min = null, max = null, category_id = null) {
	  try {
		const params = {};
		if (type !== null) {
		  params.type = type;
		}
		if (pair_vcard !== null) {
		  params.pair_vcard = pair_vcard;
		}
		if (min !== null) {
		  params.min = min;
		}
		if (max !== null) {
		  params.max = max;
		}
		if (category_id !== null) {
		  params.category_id = category_id;
		}
		const response = await axios.get('statistics', {
		  params,
		});
		statistics.value = response.data.data;
		return statistics.value;
	  } catch (error) {
		clearStatistics();
		throw error;
	  }
	}
	
	async function loadAllStatistics() {
        try {
            const response = await axios.get('statistics/all');
            statistics.value = response.data.data;
            return statistics.value;
        } catch (error) {
            clearStatistics();
            throw error;
        }
    }

    return {
      statistics,
        totalStatistics,
        getStatisticsByFilter,
        getStatisticsByFilterTotal,
        loadStatistics,
	      loadAllStatistics,
        clearStatistics,
    }
})
