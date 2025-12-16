<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';
import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
import ParcoursForm from '@/presentation/components/forms/ParcoursForm.vue';
import CustomTable from '../components/tables/CustomTable.vue';
import { Parcours } from '@/domain/entities/Parcours';
import { ParcoursDAO } from '@/domain/daos/ParcoursDAO';
import Swal from 'sweetalert2';

const parcoursForm = ref<InstanceType<typeof ParcoursForm> | null>(null);
const parcours = ref<Parcours[]>([]);

const formatterEdition = () => {
  return '<i class="bi bi-pen-fill text-primary"></i>';
};

const formatterSuppression = () => {
  return '<i class="bi bi-trash-fill text-danger"></i>';
};

const onParcoursCreated = (newParcours: Parcours) => {
  parcours.value.unshift(newParcours);
};

const onParcoursUpdated = (updatedParcours: Parcours) => {
  parcours.value = parcours.value.map((parcoursItem) =>
    parcoursItem.ID === updatedParcours.ID ? updatedParcours : parcoursItem
  );
};

const onDeleteParcours = (p: Parcours) => {
  Swal.fire({
    title: 'Etes-vous sur de vouloir supprimer ce parcours ?',
    showCancelButton: true,
    confirmButtonText: 'Supprimer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      ParcoursDAO.getInstance()
        .delete(p.ID!)
        .then(() => {
          parcours.value = parcours.value.filter((parcoursItem) => parcoursItem.ID !== p.ID);
        })
        .catch(() => {
          alert('Une erreur est survenue lors de la suppression du parcours');
        });
    }
  });
};

const columns = [
  {
    field: 'EditionParcours',
    label: 'Edition',
    formatter: formatterEdition,
    onClick: (p: Parcours) => parcoursForm.value?.openForm(p),
    style: 'width: 32px;text-align:center;'
  },
  { field: 'ID', label: 'ID', formatter: null, onClick: null, style: null },
  { field: 'NomParcours', label: 'Intitule', formatter: null, onClick: null, style: null },
  { field: 'AnneeFormation', label: 'Annee', formatter: null, onClick: null, style: null },
  {
    field: 'DeleteParcours',
    label: 'Suppression',
    formatter: formatterSuppression,
    onClick: onDeleteParcours,
    style: 'width: 32px;text-align:center;'
  }
];

onMounted(() => {
  ParcoursDAO.getInstance()
    .list()
    .then((data) => {
      parcours.value = data;
    });
});
</script>

<template>
  <div class="container-fluid">
    <div class="card mt-5">
      <div class="card-header">
        <div class="card-title">
          <h4>Liste des parcours</h4>
        </div>
        <CustomButton :color="BootstrapButtonEnum.info" @click="() => parcoursForm?.openForm()">
          Ajouter un parcours
        </CustomButton>
      </div>

      <div class="card-body">
        <CustomTable idAttribute="ID" :columns="columns" :data="parcours" />
      </div>
    </div>

    <ParcoursForm
      ref="parcoursForm"
      @create:parcours="onParcoursCreated"
      @update:parcours="onParcoursUpdated"
    />
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title,
h4 {
  margin-bottom: 0 !important;
}
</style>
