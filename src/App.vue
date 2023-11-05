<script setup>
import config from './utils/config.js'
import { ref, onMounted } from 'vue'
import axios from 'axios';
import VcardList from './components/admin/VcardList.vue'

const vcards = ref([])

const fetchCards = async () => {
    const response = await axios.get(`${config.baseAPI}/vcards`)
    vcards.value = response.data.data
}

const deleteCard = async (vcard) => {
    await axios.delete(`${config.baseAPI}/vcards/${vcard.phone_number}`);
    refresh();
}

const updateCard = async (vcard) => {
  await axios.put(`${config.baseAPI}/vcards/${vcard.phone_number}`, vcard)
  refresh()
}

const refresh = () => {
  fetchCards()
}

onMounted(() => {
  refresh()
})

</script>

<template>
  <div class="container">
    <div class="d-flex">
      <div class="flex-grow-1">
        <h1 class="mt-3">Vcard list</h1>
      </div>
      <div class="flex-grow-0 d-flex flex-column justify-content-end">
        <button type="button" class="btn btn-dark" @click="refresh">
            <i class="bi-repeat" aria-hidden="true"></i> Refresh
        </button>
      </div>
    </div>
    <hr>
    <div>
      <VcardList :vcards="vcards" :readonly="false"
          @requestRemoveFromList="deleteCard"
          @requestUpdateCard="updateCard"
          ></VcardList>
    </div>
  </div>
</template>

<style>
  .error {
    font-size: small;
    display: block;
    color: red;
    margin: 3px 0 5px 8px;
    /* margin: -15px 0 6px 16px; */
  }

  span.error {
    font-size: small;
    display: block;
    color: red;
  }

  .errors {
    font-size: small;
    display: block;
    color: red;
  }

</style>