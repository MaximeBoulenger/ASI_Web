<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import Swal from 'sweetalert2';
    import CustomTable from '../components/tables/CustomTable.vue';
    import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
    import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';
    import UEForm from '@/presentation/components/forms/UEForm.vue';
    import { UE } from '@/domain/entities/UE';
    import { UEDAO } from '@/domain/daos/UEDAO';
    
    const ueForm = ref<InstanceType<typeof UEForm> | null>(null);
        const ues = ref<UE[]>([]);
        
        const formatterEdition = () => '<i class="bi bi-pen-fill text-primary"></i>';
        const formatterSuppression = () => '<i class="bi bi-trash-fill text-danger"></i>';
        
        const onUECreated = (newUE: UE) => {
            ues.value.unshift(newUE);
        };
        
        const onUEUpdated = (updatedUE: UE) => {
            ues.value = ues.value.map((ueItem) => (ueItem.ID === updatedUE.ID ? updatedUE : ueItem));
        };
        
        const onDeleteUE = (ue: UE) => {
            Swal.fire({
                title: 'Etes-vous sur de vouloir supprimer cette UE ?',
                showCancelButton: true,
                confirmButtonText: 'Supprimer',
                cancelButtonText: 'Annuler'
            }).then((result) => {
                if (result.isConfirmed) {
                    UEDAO.getInstance()
                    .delete(ue.ID!)
                    .then(() => {
                        ues.value = ues.value.filter((item) => item.ID !== ue.ID);
                    })
                    .catch(() => alert('Une erreur est survenue lors de la suppression de l UE'));
                }
            });
        };
        
        const columns = [
        {
            field: 'EditionUE',
            label: 'Edition',
            formatter: formatterEdition,
            onClick: (ue: UE) => ueForm.value?.openForm(ue),
            style: 'width: 32px;text-align:center;'
        },
        { field: 'ID', label: 'ID', formatter: null, onClick: null, style: null },
        { field: 'NumeroUe', label: 'Numero', formatter: null, onClick: null, style: null },
        { field: 'Intitule', label: 'Intitule', formatter: null, onClick: null, style: null },
        {
            field: 'DeleteUE',
            label: 'Suppression',
            formatter: formatterSuppression,
            onClick: onDeleteUE,
            style: 'width: 32px;text-align:center;'
        }
        ];
        
        onMounted(() => {
            UEDAO.getInstance()
            .list()
            .then((data) => {
                ues.value = data;
            });
        });
    </script>
    
    <template>
        <div class="container-fluid">
            <div class="card mt-5">
                <div class="card-header">
                    <div class="card-title">
                        <h4>Liste des UEs</h4>
                    </div>
                    <CustomButton :color="BootstrapButtonEnum.info" @click="() => ueForm?.openForm()">
                        Ajouter une UE
                    </CustomButton>
                </div>
                
                <div class="card-body">
                    <CustomTable idAttribute="ID" :columns="columns" :data="ues" />
                </div>
            </div>
        </div>
        <UEForm ref="ueForm" @create:ue="onUECreated" @update:ue="onUEUpdated" />
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
    
