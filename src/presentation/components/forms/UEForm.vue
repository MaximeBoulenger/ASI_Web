<script setup lang="ts">
	import { ref, onBeforeMount, defineExpose, defineProps, toRaw, watch } from 'vue';
	import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';
	import { UE } from '@/domain/entities/UE';
	import CustomInput from '@/presentation/components/forms/components/CustomInput.vue';
	import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
	import { UEDAO } from '@/domain/daos/UEDAO';
	import { ParcoursDAO } from '@/domain/daos/ParcoursDAO';
	import { EtudiantDAO } from '@/domain/daos/EtudiantDAO';
	import { toastError, toastSuccess } from '@/presentation/utils/toast';
	import type { Parcours } from '@/domain/entities/Parcours';
	import type { Etudiant } from '@/domain/entities/Etudiant';
	
	const currentUe = ref<UE>(new UE(null, null, null, null, null));
		const isOpen = ref(false);
		const formErrors = ref<{
			NumeroUe: string | null;
			Intitule: string | null;
			parcours: string | null;
		}>({
			NumeroUe: null,
			Intitule: null,
			parcours: null
		});
		
		const parcoursOptions = ref<Parcours[]>([]);
		const etudiants = ref<Etudiant[]>([]);
		const notesByEtudiant = ref<Record<number, string>>({});
		
		const syncParcoursSelection = () => {
			if (!currentUe.value.Parcours || !parcoursOptions.value.length) {
				return;
			}
			
			const rawParcours = currentUe.value.Parcours as unknown[];
			const hasIds = rawParcours.some((parcours) => typeof parcours === 'number');
			if (!hasIds) {
				return;
			}
			
			const normalized = rawParcours
			.map((parcours) => {
				if (typeof parcours === 'number') {
					return parcoursOptions.value.find((option) => option.ID === parcours) ?? null;
				}
				return parcours as Parcours;
			})
			.filter((parcours): parcours is Parcours => parcours !== null);
			
			currentUe.value.Parcours = normalized;
		};
		
		const openForm = (ue: UE | null = null) => {
			isOpen.value = true;
			
			if (ue) {
				currentUe.value = structuredClone(toRaw(ue));
			} else {
				currentUe.value = new UE(null, null, null, null, null);
			}
			
			notesByEtudiant.value = currentUe.value.Notes ? { ...currentUe.value.Notes } : {};
			syncParcoursSelection();
		};
		
		const closeForm = () => {
			isOpen.value = false;
			currentUe.value = new UE(null, null, null, null, null);
			notesByEtudiant.value = {};
			formErrors.value = {
				NumeroUe: null,
				Intitule: null,
				parcours: null
			};
		};
		
		const saveUE = () => {
			if (formErrors.value.Intitule || formErrors.value.NumeroUe) {
				return;
			}
			
			currentUe.value.Notes = { ...notesByEtudiant.value };
			
			if (currentUe.value.ID) {
				UEDAO.getInstance()
				.update(currentUe.value.ID, currentUe.value)
				.then((updated) => {
					toastSuccess('UE mise à jour avec succès');
					emit('update:ue', updated);
					closeForm();
				})
				.catch((ex) => {
					toastError(ex.message);
				});
			} else {
				UEDAO.getInstance()
				.create(currentUe.value)
				.then((newUE) => {
					toastSuccess('UE créée avec succès');
					emit('create:ue', newUE);
					closeForm();
				})
				.catch((ex) => {
					toastError(ex.message);
				});
			}
		};
		
		const props = defineProps({
			ue: {
				type: Object as () => UE | null,
				required: false,
				default: null
			}
		});
		
		const emit = defineEmits(['create:ue', 'update:ue']);
		
		onBeforeMount(() => {
			if (props.ue) {
				currentUe.value = structuredClone(toRaw(props.ue));
				notesByEtudiant.value = currentUe.value.Notes ? { ...currentUe.value.Notes } : {};
			}
			
			ParcoursDAO.getInstance()
			.list()
			.then((parcours) => {
				parcoursOptions.value = parcours;
				syncParcoursSelection();
			});
			
			EtudiantDAO.getInstance()
			.list()
			.then((list) => {
				etudiants.value = list;
			});
		});
		
		defineExpose({
			openForm,
			closeForm
		});
		
		watch(
		() => props.ue,
		(newUE) => {
			if (newUE) {
				openForm(newUE);
			}
		}
		);
		
		watch(
		() => parcoursOptions.value,
		() => {
			syncParcoursSelection();
		}
		);
		
		watch(
		() => currentUe.value.Intitule,
		() => {
			if (
			!currentUe.value.Intitule ||
			currentUe.value.Intitule.trim() === '' ||
			currentUe.value.Intitule.length < 3
			) {
				formErrors.value.Intitule = "L'intitulé doit faire au moins 3 caractères";
			} else {
				formErrors.value.Intitule = null;
			}
		}
		);
		
		watch(
		() => currentUe.value.NumeroUe,
		() => {
			if (
			!currentUe.value.NumeroUe ||
			currentUe.value.NumeroUe.trim() === '' ||
			currentUe.value.NumeroUe.length < 3
			) {
				formErrors.value.NumeroUe = "Le numéro d'UE doit faire au moins 3 caractères";
			} else {
				formErrors.value.NumeroUe = null;
			}
		}
		);
	</script>
	
	<template>
		<div v-if="isOpen" class="ue-form">
			<div class="ue-form-header">
				<h4 class="mb-0">
					<span v-if="ue && ue.ID">Modification de l'UE</span>
					<span v-else>Nouvelle UE</span>
				</h4>
				<CustomButton :color="BootstrapButtonEnum.secondary" @click="closeForm">
					Fermer
				</CustomButton>
			</div>
			
			<div class="ue-form-grid">
				<div class="card ue-form-card">
					<div class="card-header">UE</div>
					<div class="card-body">
						<CustomInput
						v-model="currentUe.NumeroUe"
						class="mt-2"
						id="numeroue"
						libelle="Numero"
						type="text"
						placeholder="Numero d'UE"
						:error="formErrors.NumeroUe"
						/>
						
						<CustomInput
						v-model="currentUe.Intitule"
						id="intitule"
						libelle="Intitule"
						type="text"
						placeholder="Intitule de l'UE"
						:error="formErrors.Intitule"
						/>
					</div>
				</div>
				
				<div class="card ue-form-card">
					<div class="card-header">Notes</div>
					<div class="card-body">
						<div v-if="etudiants.length === 0" class="text-muted">Aucun etudiant.</div>
						<div
						v-for="etudiant in etudiants"
						:key="etudiant.ID ?? `${etudiant.Nom}-${etudiant.Prenom}`"
						class="ue-form-note-row"
						>
						<div class="ue-form-note-name">
							{{ etudiant.Prenom }} {{ etudiant.Nom }}
						</div>
						<input
						v-model="notesByEtudiant[etudiant.ID ?? 0]"
						class="form-control ue-form-note-input"
						type="text"
						placeholder="-- / 20"
						/>
					</div>
				</div>
			</div>
			
			<div class="card ue-form-card">
				<div class="card-header">Parcours</div>
				<div class="card-body">
					<div class="form-group">
						<label for="parcours-select">Parcours :</label>
						
						<v-select
						id="parcours-select"
						multiple
						label="NomParcours"
						v-model="currentUe.Parcours"
						:options="parcoursOptions"
						></v-select>
						
						<div v-if="formErrors.parcours" class="invalid-feedback">
							{{ formErrors.parcours }}
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div class="ue-form-footer">
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
		@click="saveUE"
		>
		Enregistrer
	</CustomButton>
</div>
</div>
</template>

<style scoped>
	.ue-form {
		margin-top: 24px;
	}
	
	.ue-form-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16px;
	}
	
	.ue-form-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 16px;
	}
	
	.ue-form-card {
		min-height: 320px;
	}
	
	.ue-form-footer {
		display: flex;
		justify-content: flex-end;
		margin-top: 16px;
	}
	
	.ue-form-note-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 6px 0;
		border-bottom: 1px solid #e5e5e5;
	}
	
	.ue-form-note-row:last-child {
		border-bottom: none;
	}
	
	.ue-form-note-name {
		flex: 1;
	}
	
	.ue-form-note-input {
		max-width: 120px;
		text-align: right;
	}
</style>
