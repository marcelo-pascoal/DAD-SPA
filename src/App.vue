<script setup>
import AdminVcards from './components/AdminVcards.vue';
import AdminUsers from './components/AdminUsers.vue';
import AdminCategories from './components/AdminCategories.vue';
import { ref } from 'vue';

const selectedComponent = ref(); // Initialize with the default component

const switchToComponent = (component) => {
  selectedComponent.value = component;
};
</script>

<template>
  <div>
    <div>
      <template v-if="selectedComponent === 'AdminVcards'">
        <div class="button-container">
          <button @click="switchToComponent('AdminCategories')">AdminCategories</button>
          &nbsp;
          <button @click="switchToComponent('AdminUsers')">AdminUsers</button>
          &nbsp;
          <button type="submit" class="btn btn-danger" @click="switchToComponent(null)">
              <i class="bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>
        <AdminVcards />
      </template>

      <template v-else-if="selectedComponent === 'AdminCategories'">
        <div class="button-container">
          <button @click="switchToComponent('AdminVcards')">AdminVcards</button> 
          &nbsp;
          <button @click="switchToComponent('AdminUsers')">AdminUsers</button>
          &nbsp;
          <button type="submit" class="btn btn-danger" @click="switchToComponent(null)">
              <i class="bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>
        <AdminCategories />
      </template>

      <template v-else-if="selectedComponent === 'AdminUsers'">
        <div class="button-container">
          <button @click="switchToComponent('AdminVcards')">AdminVcards</button> 
          &nbsp;
          <button @click="switchToComponent('AdminCategories')">AdminCategories</button>
          &nbsp;
          <button type="submit" class="btn btn-danger" @click="switchToComponent(null)">
              <i class="bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>
        <AdminUsers />
      </template>

      <template v-else>
        <div class="menu-container button-container">
          <button @click="switchToComponent('AdminVcards')">AdminVcards</button>
          <br>
          <button @click="switchToComponent('AdminCategories')">AdminCategories</button>
          <br>
          <button @click="switchToComponent('AdminUsers')">AdminUsers</button>
        </div>
      </template>

    </div>
  </div>
</template>

<style>

.button-container {
  display: flex;
  align-items: center; /* Center horizontally */
  justify-content: center; /* Center vertically */
}
.menu-container {
  flex-direction: column;
  height: 100vh; /* Full viewport height */
}
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

  
  .btn-close , .btn-secondary{
  font-size: 0;
  }
  .btn-close i , .btn-secondary i{
  font-size: 1rem;
  }  
</style>