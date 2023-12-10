<script setup>
import config from '../../../utils/config.js'
import VcardDetail from './VcardDetail.vue'
import {ref, computed} from 'vue'
import axios from 'axios';

const cardEdit = ref(null)

const props = defineProps({
    vcard: Object,
    readonly: Boolean
})

const fullDescription = computed(() => props.vcard.phone_number + ' - ' + props.vcard.email + ' :: ' + props.vcard.name)
const imageUrl = computed( () => config.baseURL + '/storage/fotos/' + props.vcard.photo_url)

const emit = defineEmits([
    'requestRemoveFromList',
    'requestUpdateCard'
])

const clickToDeleteCard = (vcard) => {
    emit('requestRemoveFromList', vcard)
}

const editCard = (vcard) => {
    cardEdit.value = vcard
}

const closeEdit = () => {
    cardEdit.value = null
}

const detailRequestedUpdateCard = (vcard) => {
    cardEdit.value = null
    emit('requestUpdateCard', vcard)
}
</script>

<template>
    <li class="list-group-item" :class="{'bg-light': readonly}">
        <div class="card-container">
            <a :href="imageUrl || 'https://via.placeholder.com/70x70'">
                <img alt="70x70" :src=" imageUrl || 'https://via.placeholder.com/70x70'" width="70" height="70">
            </a>
            <span id="fullDescription" :class="{ blocked: vcard.blocked }">{{ fullDescription }}</span>
            <span id="balance" :class="{ blocked: vcard.blocked }">{{ props.vcard.balance }}€</span>

            <div class="float-end adminBox" v-show="!readonly">
                <button class="btn btn-danger disabled btn-xs" v-if="vcard.balance>0">
                    <i class="bi-trash" aria-hidden="true"></i>
                </button>

                <button class="btn btn-danger btn-xs" @click="clickToDeleteCard(vcard)" v-else>
                    <i class="bi-trash" aria-hidden="true"></i>
                </button>

                <button class="btn btn-info btn-xs" @click="editCard(vcard)" v-if="!cardEdit">
                    <i class="bi-pencil" aria-hidden="true"></i>
                </button>
                <button class="btn btn-warning btn-xs" @click="closeEdit" v-else>
                    <i class="bi-arrow-up" aria-hidden="true"></i>
                </button>
            </div>
        </div>
        <div v-if="cardEdit"> 
            <VcardDetail :vcard="cardEdit" @requestUpdateCard="detailRequestedUpdateCard" @hide="closeEdit"></VcardDetail>
        </div>
    </li>
</template>

<style scoped>
.blocked {
    text-decoration: line-through;
    background-color: lightgrey;
}

.card-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

#fullDescription {
  border: 1px solid black;
  margin: 10px;
  padding: 10px;
  flex: 1;
}

#balance {
    width: 85px;
    min-width: 85px;
    margin: 10px;
    padding: 10px;
    text-align: right;
    background-color: lightblue;
}

button{
    margin: 2px;
}

@media (max-width:770px){
    #fullDescription {
        width: 195px;
        min-width: 195px;
    }
    .adminBox{
        width: 33px;
    }
}
</style>
