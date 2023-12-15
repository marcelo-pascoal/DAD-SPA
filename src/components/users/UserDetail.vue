<script setup>
import { ref, watch, computed, inject } from "vue";
import avatarNoneUrl from '@/assets/avatar-none.png'

const serverBaseUrl = inject("serverBaseUrl");

const props = defineProps({
  type: {
      type: String,
      default: null
  },
  user: {
    type: Object,
    required: true,
  },
  inserting: {
    type: Boolean,
    default: false,
  },
  errors: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits(["save", "cancel", "delete"]);

const editingUser = ref(props.user)

const inputPhotoFile = ref(null)
const editingImageAsBase64 = ref(null)
const deletePhotoOnTheServer = ref(false)

watch(
  () => props.user,
  (newUser) => {
    editingUser.value = newUser
  },
  { immediate: true }
)

const photoFullUrl = computed(() => {
  if (deletePhotoOnTheServer.value) {
    return avatarNoneUrl
  }
  if (editingImageAsBase64.value) {
    return editingImageAsBase64.value
  } else {
    return editingUser.value.photo_url
      ? serverBaseUrl + "/storage/fotos/" + editingUser.value.photo_url
      : avatarNoneUrl
  }
})

const userTitle = computed(()=>{
  if (!editingUser.value) {
    return ''
  }
  return props.inserting ? 'Register a new ' + props.type : props.type + ' Profile'
})

const save = () => {
  const userToSave = editingUser.value
  console.log(userToSave)
  userToSave.deletePhotoOnServer = deletePhotoOnTheServer.value
  userToSave.base64ImagePhoto = editingImageAsBase64.value
  if(!props.inserting){
    userToSave.phone_number=editingUser.value.id
  }
  emit("save", userToSave);
}

const cancel = () => {
  emit("cancel", editingUser.value);
}

const deleteAccount = () => { 
  emit("delete",)
}

const changePhotoFile = () => {
  try {
    const file = inputPhotoFile.value.files[0]
    if (!file) {
      editingImageAsBase64.value = null
    } else {
      const reader = new FileReader()
      reader.addEventListener(
          'load',
          () => {
            // convert image file to base64 string
            editingImageAsBase64.value = reader.result
            deletePhotoOnTheServer.value = false
          },
          false,
      )
      if (file) {
        reader.readAsDataURL(file)
      }
    }
  } catch (error) {
    editingImageAsBase64.value = null
  }
}

const resetToOriginalPhoto = () => {
  deletePhotoOnTheServer.value = false
  inputPhotoFile.value.value = ''
  changePhotoFile()
}

const cleanPhoto = () => {
  deletePhotoOnTheServer.value = true
}

</script>

<template>
  <form class="row g-3 needs-validation" novalidate @submit.prevent="save">
    <h3 class="mt-5 mb-3">{{ userTitle }}</h3>
    <hr/>
    <div class="d-flex flex-wrap justify-content-between">
      <div class="w-75 pe-4">
        <div class="d-flex">
          <div v-if="props.type=='vcard'" class="mb-3">
            <label for="inputPhoneNumber" class="form-label">Phone Number</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': errors ? errors['phone_number'] : false }"
              id="inputPhoneNumber" 
            :placeholder="editingUser.id" required v-model="editingUser.phone_number" :disabled="!inserting">
            <field-error-message :errors="errors" fieldName="phone_number"></field-error-message>
          </div>
          <div class="mb-3 flex-grow-1">
            <label for="inputName" class="form-label">Name</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': errors ? errors['name'] : false }"
              id="inputName" required v-model="editingUser.name"/>
            <field-error-message :errors="errors" fieldName="name"></field-error-message>
          </div>
        </div>
        <div class="mb-3 px-1">
          <label for="inputEmail" class="form-label">Email</label>
          <input type="email" class="form-control" :class="{ 'is-invalid': errors ? errors['email'] : false }"
            id="inputEmail" required v-model="editingUser.email"/>
          <field-error-message :errors="errors" fieldName="email"></field-error-message>
        </div>
        <div class="d-flex">
          <div class="mb-3 flex-grow-1" v-if="inserting">
            <label for="inputPassword" class="form-label">Password</label>
            <input type="password" class="form-control" :class="{ 'is-invalid': errors ? errors['password'] : false }"
                id="inputPassword" v-model="editingUser.password"/>
            <field-error-message :errors="errors" fieldName="password"></field-error-message>
            <label for="inputPasswordConfirmation" class="form-label">Password Confirmation</label>
            <input type="password" class="form-control" id="inputPasswordConfirmation" v-model="editingUser.password_confirmation"/>
            <field-error-message :errors="errors" fieldName="password_confirmation"></field-error-message>
          </div>
          <div class="mb-3 flex-grow-1" v-if="inserting && props.type=='vcard'">
            <label for="inputConfirmationCode" class="form-label">Secret Code</label>
            <input type="password" class="form-control" :class="{ 'is-invalid': errors ? errors['confirmation_code'] : false }"
                id="inputConfirmationCode" v-model="editingUser.confirmation_code"/>
            <field-error-message :errors="errors" fieldName="confirmation_code"></field-error-message>
            <label for="inputConfirmationCodeConfirmation" class="form-label">Confirm Code</label>
            <input type="password" class="form-control" id="inputConfirmationCodeConfirmation" 
              v-model="editingUser.confirmation_code_confirmation"/>
            <field-error-message :errors="errors" fieldName="confirmation_code_confirmation"></field-error-message>
          </div>
        </div>
      </div>
      <div class="w-25" v-if="props.type=='vcard'">
        <div class="d-flex flex-column">
          <label class="form-label">Photo</label>
          <div class="form-control text-center" >
            <img :src="photoFullUrl" class="w-100" />
          </div>
          <div class="mt-3 d-flex justify-content-between flex-wrap">
            <label for="inputPhoto" class="btn btn-dark flex-grow-1 mx-1">Upload</label>
            <button class="btn btn-secondary flex-grow-1 mx-1" @click.prevent="resetToOriginalPhoto" 
              v-if="editingUser.photo_url">Reset</button>
            <button class="btn btn-danger flex-grow-1 mx-1" @click.prevent="cleanPhoto" 
              v-show="editingUser.photo_url || editingImageAsBase64">Delete</button>
          </div>
          <div>
            <field-error-message :errors="errors" fieldName="base64ImagePhoto"></field-error-message>
          </div>
        </div>
      </div>
    </div>
    <hr/>
    <div class="mt-2 d-flex justify-content-end" >
      <button type="button" class="btn btn-danger px-5 mx-2" @click="deleteAccount" v-if="!props.inserting && props.type=='vcard'">Delete Account</button>
      <button type="button" class="btn btn-primary px-5 mx-2" @click="save">Save</button>
      <button type="button" class="btn btn-light px-5 mx-2" @click="cancel">Cancel</button>
    </div>
  </form>
  <input type="file" style="visibility:hidden;" id="inputPhoto" ref="inputPhotoFile" @change="changePhotoFile" />
</template>

<style scoped>
.total_hours {
  width: 26rem;
}
</style>
