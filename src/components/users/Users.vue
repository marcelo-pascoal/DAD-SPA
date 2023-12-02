<script setup>
  import axios from 'axios'
  import { useToast } from "vue-toastification"
  import { useRouter } from 'vue-router'
  import { ref, computed, onMounted, inject } from 'vue'
  import UserTable from "./UserTable.vue"

  const toast = useToast()
  const router = useRouter()
  const socket = inject('socket')

  const userToDelete = ref(null)
  const deleteConfirmationDialog = ref(null)

  const users = ref([])

  const totalUsers = computed(() => {
    return users.value.length
  })

  const loadUsers = async () => {
      try {
        const response = await axios.get('users')
      users.value = response.data.data

    } catch (error) {
      console.log(error)
    }
  }

  const addUser = () => {
      router.push({ name: 'NewUser' })
  }

  const editUser = (user) => {
    router.push({ name: 'User', params: { id: user.id } })
  }

  const deleteUser = (user) => {
    userToDelete.value = user
    deleteConfirmationDialog.value.show()
  }

  const deleteUserConfirmed = async () => {
    try {
      await axios.delete(`/users/${userToDelete.value.id}`);
      toast.info(`Project ${userToDeleteDescription.value} was deleted`)
      loadUsers()
    } catch (error) {
      console.log(error)
      toast.error(`It was not possible to delete Administrator ${userToDeleteDescription.value}!`)
    }  
  }

  const userToDeleteDescription = computed(() => userToDelete.value
      ? `#${userToDelete.value.id} (${userToDelete.value.name})`
      : "")

  onMounted (() => {
    loadUsers()
  })

  socket.on('insertedUser', () => {
    loadUsers()
  })

  socket.on('updatedUser', () => {
    loadUsers()
  })
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
  <user-table
    :users="users"
    :showId="false"
    @edit="editUser"
    @delete="deleteUser"
  ></user-table>
</template>

<style scoped>
.filter-div {
  min-width: 12rem;
}
.total-filtro {
  margin-top: 2.3rem;
}
</style>

