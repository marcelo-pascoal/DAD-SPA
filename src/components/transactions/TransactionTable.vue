<script setup>
  const props = defineProps({
    transactions: {
      type: Array,
      default: () => [],
    }
  })

  const emit = defineEmits(['edit'])

  const editClick = (transaction) => {
      emit('edit', transaction)
  }
</script>

<template>
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
      <tr
        v-for="transaction in transactions"
        :key="transaction.id"
      >
        <td>{{ transaction.id }}</td>
        <td>{{ transaction.datetime }}</td>
        <td>{{ transaction.type }}</td>
        <td>{{ transaction.value }}</td>
        <td>{{ transaction.new_balance }}</td>
        
        <td class="text-end">
          <div class="d-flex justify-content-end">
            <button class="btn btn-xs btn-light" @click="editClick(transaction)">
              <i class="bi bi-xs bi-pencil"></i>
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
button {
  margin-left: 3px;
  margin-right: 3px;
}
</style>
