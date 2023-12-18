<script setup>
import { useToast } from "vue-toastification"
import Vcard from './Vcard.vue'
import { ref, inject, onMounted, computed, watch } from 'vue'

const axios = inject("axios")
const socket = inject("socket")

const toast = useToast()

const vcards = ref([])
const filterByBlocked = ref(null)
const filterByName = ref(null)
const filterByEmail = ref(null)
const filterByPhoneNumber = ref(null);

const filteredVcards = computed(() => {
  let filtered = vcards.value;

  if (filterByBlocked.value !== null) {
    filtered = filtered.filter(vcard => vcard.blocked === (filterByBlocked.value === 'true'));
  }

  if (filterByName.value !== null) {
    const filterValue = filterByName.value.toLowerCase();
    filtered = filtered.filter(vcard => vcard.name.toLowerCase().includes(filterValue));
  }

  if (filterByEmail.value !== null) {
    const filterValue = filterByEmail.value.toLowerCase();
    filtered = filtered.filter(vcard => vcard.email.toLowerCase().includes(filterValue));
  }
  
  if (filterByPhoneNumber.value !== null) {
    filtered = filtered.filter(vcard => vcard.phone_number.includes(filterByPhoneNumber.value));
  }

  return filtered;
});

const fetchCards = async () => {
  try {
    const params = {};

    if (filterByBlocked.value !== null) {
      params.blocked = filterByBlocked.value;
    }

    if (filterByName.value !== null) {
      params.name = filterByName.value;
    }

    if (filterByEmail.value !== null) {
      params.email = filterByEmail.value;
    }
	
	if (filterByPhoneNumber.value !== null) {
      params.email = filterByEmail.value;
    }

    const response = await axios.get('/vcards', { params });
    vcards.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
}

const updateCard = async (vcard) => {
  await axios.put(`/update/vcards/${vcard.phone_number}`, vcard);
  toast.info(`vCard ${vcard.phone_number} was updated`);
  socket.emit('updatedVcard', vcard);
  fetchCards();
}

const deleteCard = async (vcard) => {
  await axios.delete(`/vcards/${vcard.phone_number}`);
  toast.info(`vCard ${vcard.phone_number} was deleted`);
  socket.emit('deletedVcard', vcard);
  fetchCards();
}

onMounted(() => {
  fetchCards();
});

watch([filterByBlocked, filterByName, filterByEmail, filterByPhoneNumber], () => {
  fetchCards();
});

socket.on('updatedVcard', () => {
  toast.info("vCard list has been altered");
  fetchCards();
});

socket.on('insertedVcard', (insertedVcard) => {
  fetchCards();
});

</script>

<template>
  <div class="container">
    <h3 class="mt-5 mb-3">vCards</h3>

    <div class="mb-3 d-flex justify-content-between align-items-end flex-wrap">
      <div class="mx-1 mt-1">
        <label for="inputBlocked" class="form-label">Blocked</label>
        <select class="form-select pe-5" id="inputBlocked" v-model="filterByBlocked">
          <option :value="null">Show All</option>
          <option value="true">Blocked</option>
          <option value="false">Not Blocked</option>
        </select>
      </div>

      <div class="mx-1 mt-1">
        <label for="inputName" class="form-label">Name</label>
        <input type="text" class="form-control" id="inputName" v-model="filterByName" />
      </div>

      <div class="mx-1 mt-1">
        <label for="inputEmail" class="form-label">Email</label>
        <input type="text" class="form-control" id="inputEmail" v-model="filterByEmail" />
      </div>
	  <div class="mx-1 mt-1">
		<label for="inputPhoneNumber" class="form-label">Phone Number</label>
		<input type="text" class="form-control" id="inputPhoneNumber" v-model="filterByPhoneNumber" />
	  </div>
    </div>

    <div>
      <ul class="list-group">
        <Vcard v-for="vcard in filteredVcards" :key="vcard.phone_number" class="vcard"
          :vcard="vcard"
          @requestRemoveFromList="deleteCard"
          @requestUpdateCard="updateCard">
        </Vcard>
      </ul>
    </div>
  </div>
</template>
