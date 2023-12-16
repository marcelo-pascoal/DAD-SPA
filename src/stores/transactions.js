import axios from 'axios'
import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import { useToast } from "vue-toastification"

export const useTransactionsStore = defineStore('transactions', () => {

    const socket = inject("socket")

    const toast = useToast()

    const transactions = ref([])

    const totalTransactions = computed(() => {
        return transcations.value.length
    })

    function getTransactionsByFilter(type, vcard, min, max) {
        return transactions.value.filter( tr =>
            (!type || type == tr.type) &&
            (!vcard || vcard == tr.pair_vcard) &&
            (!min || min <= tr.value) &&
            (!max || max >= tr.value)
        )
    }

    function getTransactionsByFilterTotal(type, vcard, min, max) {
        return transactions.value.reduce((acumulador, tr) =>
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

    function clearTransactions() {
        transactions.value = []
    }

	async function loadTransactions(type = null, pair_vcard = null, min = null, max = null, category_id = null) {
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
		const response = await axios.get('transactions', {
		  params,
		});
		transactions.value = response.data.data;
		return transactions.value;
	  } catch (error) {
		clearTransactions();
		throw error;
	  }
	}
	
	async function loadAllTransactions() {
        try {
            const response = await axios.get('transactions/all');
            transactions.value = response.data.data;
            return transactions.value;
        } catch (error) {
            clearTransactions();
            throw error;
        }
    }

    async function insertTransaction(newTransaction) {
        const response = await axios.post('transactions', newTransaction)
        transactions.value.push(response.data.data)
        socket.emit('newTransaction', response.data.data)
        return response.data.data
    }

    function updateTransactionOnArray(transaction) {
        let idx = transactions.value.findIndex((t) => t.id === transaction.id)
        if (idx >= 0) {
            transactions.value[idx] = transaction
        }
    }

    async function updateTransaction(updateTransaction) {
        const response = await axios.put('transactions/' + updateTransaction.id, updateTransaction)
        updateTransactionOnArray(response.data.data)
        socket.emit('updateTransaction', response.data.data)
        return response.data.data
    }

    socket.on('accountCredited', (transaction) => {
        transactions.value.unshift(transaction)
    })

    return {
        transactions,
        totalTransactions,
        getTransactionsByFilter,
        getTransactionsByFilterTotal,
        loadTransactions,
		loadAllTransactions,
        clearTransactions,
        insertTransaction,
        updateTransaction,
    }
})