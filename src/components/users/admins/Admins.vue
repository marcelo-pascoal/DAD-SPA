<script setup>
import { useToast } from "vue-toastification";
import { useRouter } from 'vue-router';
import { ref, computed, onMounted, inject, watch } from 'vue';
import AdminTable from "./AdminTable.vue";

const toast = useToast();
const router = useRouter();
const socket = inject('socket');
const axios = inject("axios");

const userToDelete = ref(null);
const deleteConfirmationDialog = ref(null);
const users = ref([]);

const filterByName = ref(null);
const filterByEmail = ref(null);

const filteredUsers = computed(() => {
  let filtered = users.value;

  if (filterByName.value !== null) {
    const filterValue = filterByName.value.toLowerCase();
    filtered = filtered.filter(user => user.name.toLowerCase().includes(filterValue));
  }

  if (filterByEmail.value !== null) {
    const filterValue = filterByEmail.value.toLowerCase();
    filtered = filtered.filter(user => user.email.toLowerCase().includes(filterValue));
  }

  return filtered;
});

const totalUsers = computed(() => {
  return filteredUsers.value.length;
});

const loadUsers = async () => {
  try {
    const response = await axios.get('users');
    users.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
};

const addUser = () => {
  router.push({ name: 'NewUser', params: { type: 'admin' }});
};

const editUser = (user) => {
  router.push({ name: 'Admin', params: { id: user.id } });
};

const deleteUser = (user) => {
  userToDelete.value = user;
  deleteConfirmationDialog.value.show();
};

const deleteUserConfirmed = async () => {
  try {
    await axios.delete(`/users/${userToDelete.value.id}`);
    toast.info(`Administrator ${userToDeleteDescription.value} was deleted`);
    socket.emit('deletedAdmin', userToDelete.value);
    loadUsers();
  } catch (error) {
    console.log(error);
    toast.error(`It was not possible to delete Administrator ${userToDeleteDescription.value}!`);
  }  
};

const userToDeleteDescription = computed(() => userToDelete.value
  ? `#${userToDelete.value.id} (${userToDelete.value.name})`
  : "");

onMounted (() => {
  loadUsers();
});

socket.on('adminsUpdated', () => {
  toast.info("Admin list has been changed");
  loadUsers();
});

watch([filterByName, filterByEmail], () => {
  loadUsers();
});
</script>

<template>
  <confirmation-dialog
    ref="deleteConfirmationDialog"
    confirmationBtn="Delete administrator"
    :msg="`Do you really want to delete the administrator ${userToDeleteDescription}?`"
    @confirmed="deleteUserConfirmed"
  >
  </confirmation-dialog>
  <h3 class="mt-5 mb-3">Administrators</h3>

  <div class="mb-3 d-flex justify-content-between flex-wrap">
    <div class="mx-2 mt-2 flex-grow-1 total-filtro">
      <h5 class="mt-4">Total: {{ totalUsers }}</h5>
    </div>
    <div class="mx-2 mt-2">
      <button
        type="button"
        class="btn btn-success px-4 btn-addprj"
        @click="addUser"
      ><i class="bi bi-xs bi-plus-circle"></i>&nbsp; Add Administrator</button>
    </div>
  </div>
  <hr>
  <div class="mb-3 d-flex justify-content-between align-items-end  flex-wrap">
    <div class="mx-1 mt-1">
      <label for="inputName" class="form-label">Name</label>
      <input type="text" class="form-control" id="inputName" v-model="filterByName" />
    </div>
    <div class="mx-1 mt-1">
      <label for="inputEmail" class="form-label">Email</label>
      <input type="text" class="form-control" id="inputEmail" v-model="filterByEmail" />
    </div>
  </div>

  <admin-table
    :users="filteredUsers"
    :showId="false"
    @edit="editUser"
    @delete="deleteUser"
  ></admin-table>
</template>

<style scoped>
.filter-div {
  min-width: 12rem;
}
.total-filtro {
  margin-top: 2.3rem;
}
</style>
