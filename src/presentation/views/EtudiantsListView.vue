<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import CustomTable from '../components/tables/CustomTable.vue';
import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';
import EtudiantForm from '@/presentation/components/forms/EtudiantForm.vue';
import { Etudiant } from '@/domain/entities/Etudiant';
import { EtudiantDAO } from '@/domain/daos/EtudiantDAO';
import { ParcoursDAO } from '@/domain/daos/ParcoursDAO';

const etudiantForm = ref<InstanceType<typeof EtudiantForm> | null>(null);
const etudiants = ref<Etudiant[]>([]);
const parcoursById = ref<Record<number, string>>({});

const formatterEdition = () => '<i class="bi bi-pen-fill text-primary"></i>';
const formatterSuppression = () => '<i class="bi bi-trash-fill text-danger"></i>';
const formatterParcours = (etudiant: Etudiant) => {
  if (!etudiant.Parcours) {
    return '';
  }
  if (typeof etudiant.Parcours === 'object') {
    return etudiant.Parcours.NomParcours ?? '';
  }
  return parcoursById.value[etudiant.Parcours] ?? String(etudiant.Parcours);
};

const onEtudiantCreated = (newEtudiant: Etudiant) => {
  etudiants.value.unshift(newEtudiant);
};

const onEtudiantUpdated = (updatedEtudiant: Etudiant) => {
  etudiants.value = etudiants.value.map((item) =>
    item.ID === updatedEtudiant.ID ? updatedEtudiant : item
  );
};

const onDeleteEtudiant = (etudiant: Etudiant) => {
  Swal.fire({
    title: 'Etes-vous sur de vouloir supprimer cet etudiant ?',
    showCancelButton: true,
    confirmButtonText: 'Supprimer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      EtudiantDAO.getInstance()
        .delete(etudiant.ID!)
        .then(() => {
          etudiants.value = etudiants.value.filter((item) => item.ID !== etudiant.ID);
        })
        .catch(() => {
          alert('Une erreur est survenue lors de la suppression de l etudiant');
        });
    }
  });
};

const columns = [
  {
    field: 'EditionEtudiant',
    label: 'Edition',
    formatter: formatterEdition,
    onClick: (etudiant: Etudiant) => etudiantForm.value?.openForm(etudiant),
    style: 'width: 32px;text-align:center;'
  },
  { field: 'ID', label: 'ID', formatter: null, onClick: null, style: null },
  { field: 'Nom', label: 'Nom', formatter: null, onClick: null, style: null },
  { field: 'Prenom', label: 'Prenom', formatter: null, onClick: null, style: null },
  { field: 'Parcours', label: 'Parcours', formatter: formatterParcours, onClick: null, style: null },
  {
    field: 'DeleteEtudiant',
    label: 'Suppression',
    formatter: formatterSuppression,
    onClick: onDeleteEtudiant,
    style: 'width: 32px;text-align:center;'
  }
];

onMounted(() => {
  Promise.all([ParcoursDAO.getInstance().list(), EtudiantDAO.getInstance().list()]).then(
    ([parcours, etudiantsList]) => {
      const map: Record<number, string> = {};
      parcours.forEach((p) => {
        if (p.ID !== null) {
          map[p.ID] = p.NomParcours ?? '';
        }
      });
      parcoursById.value = map;
      etudiants.value = etudiantsList;
    }
  );
});
</script>

<template>
  <div class="container-fluid">
    <div class="card mt-5">
      <div class="card-header">
        <div class="card-title">
          <h4>Liste des etudiants</h4>
        </div>
        <CustomButton :color="BootstrapButtonEnum.info" @click="() => etudiantForm?.openForm()">
          Ajouter un etudiant
        </CustomButton>
      </div>

      <div class="card-body">
        <CustomTable idAttribute="ID" :columns="columns" :data="etudiants" />
      </div>
    </div>

    <EtudiantForm
      ref="etudiantForm"
      @create:etudiant="onEtudiantCreated"
      @update:etudiant="onEtudiantUpdated"
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
