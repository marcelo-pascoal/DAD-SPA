<script setup>
import { useUserStore } from "../../stores/user.js"

const userStore = useUserStore()

const props = defineProps({
  users: {
    type: Array,
    default: () => [],
  },
  showId: {
    type: Boolean,
    default: true,
  },
  showEmail: {
    type: Boolean,
    default: true,
  },
  showEditButton: {
    type: Boolean,
    default: true,
  },
  showDeleteButton: {
      type: Boolean,
      default: true,
  }
})

const emit = defineEmits(['edit', 'delete'])

const editClick = (user) => {
  emit("edit", user)  
}

const deleteClick = (user) => {
      emit('delete', user)
}

const canViewUserDetail = (userId) => {
  if (!userStore.user) {
    return false
  }
  return userStore.user.type == 'A' || userStore.user.id == userId
}
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th v-if="showId" class="align-middle">#</th>
        <th class="align-middle">Name</th>
        <th v-if="showEmail" class="align-middle">Email</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users" :key="user.id">
        <td v-if="showId" class="align-middle">{{ user.id }}</td>
        <td class="align-middle">{{ user.name }}</td>
        <td v-if="showEmail" class="align-middle">{{ user.email }}</td>
        <td class="text-end align-middle" v-if="showEditButton">
          <div class="d-flex justify-content-end">
            <div  v-if="canViewUserDetail(user.id)">
              <button
                class="btn btn-xs btn-light"
                @click="editClick(user)"
                v-if="showEditButton">
                <i class="bi bi-xs bi-pencil"></i>
              </button>
            </div>
            <button
              class="btn btn-xs btn-light"
              @click="deleteClick(user)"
              v-if="showDeleteButton"
            ><i class="bi bi-xs bi-x-square-fill"></i>
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

.img_photo {
  width: 3.2rem;
  height: 3.2rem;
}
</style>
