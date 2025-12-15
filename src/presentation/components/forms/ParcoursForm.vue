<script setup lang="ts">
import { ref, onBeforeMount, defineExpose, defineProps, defineEmits, toRaw, watch } from 'vue';
import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';
import { Parcours } from '@/domain/entities/Parcours';
import CustomInput from '@/presentation/components/forms/components/CustomInput.vue';
import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
import { ParcoursDAO } from '@/domain/daos/ParcoursDAO';

const currentParcours = ref<Parcours>(new Parcours(null, null, null));
const isOpen = ref(false);
const emit = defineEmits(['create:parcours', 'update:parcours']);

const formErrors = ref<{ NomParcours: string | null; AnneeFormation: string | null }>({
    NomParcours: null,
    AnneeFormation: null,
});

const saveParcours = () => {
    if (formErrors.value.NomParcours || formErrors.value.AnneeFormation) {
        return;
    }

    if (currentParcours.value.ID) {
        ParcoursDAO.getInstance()
            .update(currentParcours.value.ID, currentParcours.value)
            .then((updated) => {
                emit('update:parcours', updated);
                alert('Parcours mis a jour avec succes');
                closeForm();
            })
            .catch((ex) => {
                alert(ex.message);
            });
    } else {
        ParcoursDAO.getInstance()
            .create(currentParcours.value)
            .then((created) => {
                emit('create:parcours', created);
                alert('Parcours cree avec succes');
                closeForm();
            })
            .catch((ex) => {
                alert(ex.message);
            });
    }
};

watch(
    () => currentParcours.value.NomParcours,
    () => {
        if (!currentParcours.value.NomParcours || currentParcours.value.NomParcours.trim() === '' || currentParcours.value.NomParcours.length < 3) {
            formErrors.value.NomParcours = 'Le nom du parcours doit faire au moins 3 caracteres';
        } else {
            formErrors.value.NomParcours = null;
        }
    },
);

watch(
    () => currentParcours.value.AnneeFormation,
    () => {
        if (!currentParcours.value.AnneeFormation || currentParcours.value.AnneeFormation < 2000 || currentParcours.value.AnneeFormation > 2100) {
            formErrors.value.AnneeFormation = 'L annee de formation doit etre comprise entre 2000 et 2100';
        } else {
            formErrors.value.AnneeFormation = null;
        }
    },
);

const openForm = (parcours: Parcours | null = null) => {
    isOpen.value = true;

    if (parcours) {
        currentParcours.value = structuredClone(toRaw(parcours));
    }
};

const closeForm = () => {
    isOpen.value = false;
    currentParcours.value = new Parcours(null, null, null);
    formErrors.value = {
        NomParcours: null,
        AnneeFormation: null,
    };
};

const props = defineProps({
    parcours: {
        type: Object as () => Parcours | null,
        required: false,
        default: null,
    },
});

onBeforeMount(() => {
    if (props.parcours) {
        currentParcours.value = props.parcours;
    }
});

defineExpose({
    openForm,
    closeForm,
});
</script>

<template>
    <div v-if="isOpen" class="custom-modal">
        <div class="card new-parcours">
            <div class="card-header" style="background: #273656">
                <template v-if="currentParcours.ID"> Modification du parcours </template>
                <template v-else> Nouveau parcours </template>
            </div>
            <div class="card-body">
                <div class="card-text mt-1 mb-1">
                    <form>
                        <CustomInput v-model="currentParcours.NomParcours" id="intitule" libelle="Intitulé" type="text" placeholder="Intitulé du parcours" :error="formErrors.NomParcours" />
                        <CustomInput v-model="currentParcours.AnneeFormation" class="mt-2" id="annee" libelle="Année" type="number" placeholder="Année de formation" :error="formErrors.AnneeFormation" />
                    </form>
                </div>
                <CustomButton class="mt-1" style="margin-left: 5px" :color="BootstrapButtonEnum.danger" @click="closeForm">
                    Annuler
                </CustomButton>
                <CustomButton
                    class="mt-1"
                    style="margin-left: 5px"
                    :color="BootstrapButtonEnum.primary"
                    @click="saveParcours"
                    :disabled="currentParcours.NomParcours == null || currentParcours.AnneeFormation == null || formErrors.NomParcours || formErrors.AnneeFormation"
                >
                    Enregistrer
                </CustomButton>
            </div>
        </div>
    </div>
</template>

<style scoped>
.custom-modal {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(87, 86, 86, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.custom-modal .card {
    width: 250px;
}

.card-header {
    background: #273656;
    color: white;
    text-align: left;
}

.card-text {
    text-align: left;
}
</style>
