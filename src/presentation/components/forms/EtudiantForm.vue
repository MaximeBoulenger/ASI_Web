<script setup lang="ts">
	import { ref, onBeforeMount, defineExpose, defineProps, toRaw, watch } from 'vue';
	import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';
	import { Etudiant } from '@/domain/entities/Etudiant';
	import CustomInput from '@/presentation/components/forms/components/CustomInput.vue';
	import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
	import CustomModal from '@/presentation/components/modals/CustomModal.vue';
	import { EtudiantDAO } from '@/domain/daos/EtudiantDAO';
	import { ParcoursDAO } from '@/domain/daos/ParcoursDAO';
	import { toastError, toastSuccess } from '@/presentation/utils/toast';
	import type { Parcours } from '@/domain/entities/Parcours';
	
const currentEtudiant = ref<Etudiant>(new Etudiant(null, null, null, null, null));
const isOpen = ref(false);
const formErrors = ref<{
  Nom: string | null;
  Prenom: string | null;
  Email: string | null;
  Parcours: string | null;
}>({
  Nom: null,
  Prenom: null,
  Email: null,
  Parcours: null
});
		
		const parcoursOptions = ref<Parcours[]>([]);
		
		const resolveParcoursSelection = () => {
			if (typeof currentEtudiant.value.Parcours === 'number') {
				const selected = parcoursOptions.value.find((p) => p.ID === currentEtudiant.value.Parcours);
				if (selected) {
					currentEtudiant.value.Parcours = selected;
				}
			}
		};
		
		const openForm = (etudiant: Etudiant | null = null) => {
			isOpen.value = true;
			
			if (etudiant) {
				currentEtudiant.value = structuredClone(toRaw(etudiant));
				resolveParcoursSelection();
			}
		};
		
const closeForm = () => {
  isOpen.value = false;
  currentEtudiant.value = new Etudiant(null, null, null, null, null);
  formErrors.value = {
    Nom: null,
    Prenom: null,
    Email: null,
    Parcours: null
  };
};
		
		const saveEtudiant = () => {
  if (
    formErrors.value.Nom ||
    formErrors.value.Prenom ||
    formErrors.value.Email ||
    formErrors.value.Parcours
  ) {
    return;
  }
			
			if (currentEtudiant.value.ID) {
				EtudiantDAO.getInstance()
				.update(currentEtudiant.value.ID, currentEtudiant.value)
				.then((updated) => {
					toastSuccess('Etudiant mis à jour avec succès');
					emit('update:etudiant', updated);
					closeForm();
				})
				.catch((ex) => {
					toastError(ex.message);
				});
			} else {
				EtudiantDAO.getInstance()
				.create(currentEtudiant.value)
				.then((created) => {
					toastSuccess('Etudiant créé avec succès');
					emit('create:etudiant', created);
					closeForm();
				})
				.catch((ex) => {
					toastError(ex.message);
				});
			}
		};
		
		const props = defineProps({
			etudiant: {
				type: Object as () => Etudiant | null,
				required: false,
				default: null
			}
		});
		
		const emit = defineEmits(['create:etudiant', 'update:etudiant']);
		
		onBeforeMount(() => {
			if (props.etudiant) {
				currentEtudiant.value = structuredClone(toRaw(props.etudiant));
			}
			
			ParcoursDAO.getInstance()
			.list()
			.then((parcours) => {
				parcoursOptions.value = parcours;
				resolveParcoursSelection();
			});
		});
		
		defineExpose({
			openForm,
			closeForm
		});
		
		watch(
		() => currentEtudiant.value.Nom,
		() => {
			if (
			!currentEtudiant.value.Nom ||
			currentEtudiant.value.Nom.trim() === '' ||
			currentEtudiant.value.Nom.length < 2
			) {
				formErrors.value.Nom = 'Le nom doit faire au moins 2 caractères';
			} else {
				formErrors.value.Nom = null;
			}
		}
		);
		
watch(
  () => currentEtudiant.value.Prenom,
  () => {
			if (
			!currentEtudiant.value.Prenom ||
			currentEtudiant.value.Prenom.trim() === '' ||
			currentEtudiant.value.Prenom.length < 2
			) {
				formErrors.value.Prenom = 'Le prénom doit faire au moins 2 caractères';
			} else {
				formErrors.value.Prenom = null;
			}
  }
);

watch(
  () => currentEtudiant.value.Email,
  () => {
    if (!currentEtudiant.value.Email || currentEtudiant.value.Email.trim() === '') {
      formErrors.value.Email = "L'email est obligatoire";
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEtudiant.value.Email);
    formErrors.value.Email = isValidEmail ? null : 'Email invalide';
  }
);

watch(
  () => currentEtudiant.value.Parcours,
  () => {
    formErrors.value.Parcours = currentEtudiant.value.Parcours ? null : 'Le parcours est obligatoire';
  }
);
	</script>
	
	<template>
		<CustomModal :isOpen="isOpen">
			<template v-slot:title>
				<template v-if="etudiant && etudiant.ID"> Modification de l etudiant </template>
				
				<template v-else> Nouvel etudiant </template>
			</template>
			
			<template v-slot:body>
				<div class="text-start mt-1 mb-1">
					<form>
						<CustomInput
						v-model="currentEtudiant.Nom"
						id="nom"
						libelle="Nom"
						type="text"
						placeholder="Nom de l etudiant"
						:error="formErrors.Nom"
						/>
						
          <CustomInput
            v-model="currentEtudiant.Prenom"
            class="mt-2"
            id="prenom"
            libelle="Prenom"
            type="text"
            placeholder="Prenom de l etudiant"
            :error="formErrors.Prenom"
          />

          <CustomInput
            v-model="currentEtudiant.Email"
            class="mt-2"
            id="email"
            libelle="Email"
            type="email"
            placeholder="Email de l etudiant"
            :error="formErrors.Email"
          />

          <div class="form-group mt-2">
            <label for="parcours">Parcours :</label>
							<v-select
							label="NomParcours"
							v-model="currentEtudiant.Parcours"
							:options="parcoursOptions"
							></v-select>
							<div v-if="formErrors.Parcours" class="invalid-feedback d-block">
								{{ formErrors.Parcours }}
							</div>
						</div>
					</form>
				</div>
				
				<CustomButton
				class="mt-1"
				style="margin-left: 5px"
				:color="BootstrapButtonEnum.danger"
				@click="closeForm"
				>
				Annuler
			</CustomButton>
			
			<CustomButton
			class="mt-1"
			style="margin-left: 5px"
			:color="BootstrapButtonEnum.primary"
			@click="saveEtudiant"
			>
			Enregistrer
		</CustomButton>
	</template>
</CustomModal>
</template>
