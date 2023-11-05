<script setup>
import config from '../../utils/config.js'
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

const toggleBlock = async (vcard) => {
    closeEdit()
    await axios.patch(`${config.baseAPI}/vcards/${vcard.phone_number}/blocked`, {blocked:!vcard.blocked}) 
    vcard.blocked = !vcard.blocked
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
                <a :href="imageUrl || 'https://via.placeholder.com/70x70'">
                <img alt="70x70" :src=" imageUrl || 'https://via.placeholder.com/70x70'" width="70" height="70">
            </a>
            <span :class="{ blocked: vcard.blocked }">{{ fullDescription }}</span>
                <div class="float-end" v-show="!readonly">
                    <button class="btn btn-secondary btn-xs" @click="toggleBlock(vcard)" v-if="vcard.blocked">
                        <i class="bi-ban" aria-hidden="true"></i>
                    </button>
                    <button class="btn btn-success btn-xs" @click="toggleBlock(vcard)" v-else>
                        <i class="bi-check-lg" aria-hidden="true"></i>
                    </button>

                    <button class="btn btn-danger btn-xs" @click="clickToDeleteCard(vcard)">
                        <i class="bi-trash" aria-hidden="true"></i>
                    </button>

                    <button class="btn btn-info btn-xs" @click="editCard(vcard)" v-if="!cardEdit">
                        <i class="bi-pencil" aria-hidden="true"></i>
                    </button>
                    <button class="btn btn-warning btn-xs" @click="closeEdit" v-else>
                        <i class="bi-arrow-up" aria-hidden="true"></i>
                    </button>
                </div>
                <div v-if="cardEdit"> <hr>
                    <VcardDetail :vcard="cardEdit" @requestUpdateCard="detailRequestedUpdateCard" @hide="closeEdit"></VcardDetail>
                </div>
            </li>
</template>

<style scoped>
.blocked {
    text-decoration: line-through;
}

</style>
