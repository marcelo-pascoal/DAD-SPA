<script setup>
import { ref, onMounted, computed} from 'vue'

const props = defineProps({
  vcard: Object
})

const emit = defineEmits(['hide', 'requestUpdateCard'])

const editCard = ref(Object.assign({}, props.vcard))

const save = () => {
  emit('requestUpdateCard', editCard.value)
  emit('hide')
}

const cancel = () => {
  emit('hide')
}

onMounted(() => {
})
</script>

  <template>
    <form action="#" class="d-flex">
      <div class="me-3">
        <div class="form-check mt-2 block">
          <label class="form-check-label" for="blockCheckbox"><h5>Blocked</h5></label>
          <input class="form-check-input" type="checkbox" id="blockCheckbox" v-model="editCard.blocked">
        </div>
      </div>
      <div class="me-3 flex-grow-1 ">
        <div class="d-flex align-items-center">
          <label for="maxDebit" class="mt-3"><h5>Maximum Debit&nbsp</h5></label>
          <input type="number" class="mt-2 form-control maxDebit" id="maxDebit" ref="maxDebit"
                placeholder="Enter max Debit Value" v-model="editCard.max_debit">
        </div>
      </div>
      <div class="submitBox">
        <button type="submit" class="btn btn-primary mt-2" @click.prevent="save" 
                              :disabled="props.vcard.blocked === editCard.blocked 
                                && props.vcard.max_debit == editCard.max_debit">
            <i class="bi-check-lg" aria-hidden="true"></i> Save
        </button>
        <button type="button" class="btn btn-secondary mt-2" @click="cancel">
              <i class="bi-x-lg" aria-hidden="true"></i> Cancel
        </button>
      </div>
    </form>
  </template>

<style scoped>

.maxDebit{
    width: 90px;
    text-align: center;
}

.btn-secondary{
  margin-left: 5px;
}
#maxDebit {
    background-color: lightgoldenrodyellow;
}
.block{
  background-color: lightgrey;
  padding: 5px 10px 0px 30px;
}
@media (max-width:770px){
  .submitBox{
  margin-right: -10px;
  
  }
}

</style>