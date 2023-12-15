<script setup>
import { ref } from 'vue'
const props = defineProps({
    cancelBtn: {
        type: String,
        default: "Cancel",
    },
    confirmationBtn: {
        type: String,
        default: "Confirm",
    },
    title: {
        type: String,
        default: "Confirmation",
    },
    msg: {
        type: String,
        default: "",
    }, 
    showPassword: {
        type: Boolean,
        default: true,
    }, 
    showCode: {
        type: Boolean,
        default: true,
    }
})

const emit = defineEmits(["show", "hide", "confirmed"])

const credentials = ref({
      password: '',
      confirmation_code: ''
  })

const hiddenButtonToShowDialog = ref(null)
const hiddenButtonToHideDialog = ref(null)

const show = () => {
    // Show the modal:
    hiddenButtonToShowDialog.value.click()
    emit("show")
}
const hide = () => {
    // Hide the modal:
    hiddenButtonToHideDialog.value.click()
    emit("hide")
}
const clickConfirm = () => {
    hide()
    emit("confirmed", credentials.value)
}

// Properties/Methods that are exposed to the outside when
// the public instance of the component is retrieved via template refs
defineExpose({ show, hide })
</script>


<template>
    <!-- Button trigger to Show modal - HIDDEN -->
    <button ref="hiddenButtonToShowDialog" type="button" class="d-none" data-bs-toggle="modal"
        data-bs-target="#confirmationModalId"></button>

    <!-- Modal -->
    <div class="modal fade" id="confirmationModalId" tabindex="-1" aria-labelledby="confirmationModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <!-- Button trigger to Hide modal - HIDDEN -->
            <button ref="hiddenButtonToHideDialog" type="button" class="d-none" data-bs-dismiss="modal"></button>

            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="confirmationModalLabel">{{ title }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    {{ msg }}
                    <div class="d-flex">
                        <div v-if="showPassword">
                            <hr>
                            <label for="inputPassword" class="form-label">Password</label>
                            <input id="inputPassword" type="password" class="form-control"
                                v-model="credentials.password"/>
                        </div>
                        <div v-if="showPassword">
                            <hr>
                            <label for="inputConfirmationCode" class="form-label">Secret Code</label>
                            <input id="inputConfirmationCode" type="password" class="form-control"
                                v-model="credentials.confirmation_code"/>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        {{ cancelBtn }}
                    </button>
                    
                    <button type="button" class="btn btn-primary" @click="clickConfirm">
                        {{ confirmationBtn }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
