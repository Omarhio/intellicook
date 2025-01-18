<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Recipe } from '$lib/types/Recipe';
	import CloseButton from '$lib/components/atoms/buttons/CloseButton.svelte';

	export let recipe: Recipe;

	const dispatch = createEventDispatcher<{
		close: void;
	}>();

	function handleClose() {
		dispatch('close');
	}
</script>

<div
	class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black bg-opacity-70 backdrop-blur-[10px]"
	role="dialog"
	aria-modal="true"
	aria-labelledby="popup-title"
	aria-describedby="popup-description"
>
	<!-- Clic à l'extérieur pour fermer -->
	<button
		class="absolute inset-0 bg-transparent"
		on:click={handleClose}
		aria-hidden="true"
		tabindex="-1"
		type="button"
	></button>

	<!-- Conteneur principal de la popup -->
	<div
		class="popup-container relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-8 pt-12 shadow-lg"
		role="document"
		aria-labelledby="popup-title"
		aria-describedby="popup-description"
	>
		<CloseButton on:click={handleClose} />

		<!-- Contenu de la popup -->
		<img
			src={recipe.image}
			alt={recipe.nom}
			class="mb-4 h-64 w-full rounded-lg object-cover"
		/>
		<h2 id="popup-title" class="text-3xl font-bold text-[#F4ACB7]">{recipe.nom}</h2>

		<!-- Liste des ingrédients avec noms et dosages -->
		<h3 class="mt-4 text-2xl font-semibold text-[#F4ACB7]">Ingrédients :</h3>
		<ul class="mt-2 list-inside list-disc space-y-2 text-[#9D8189]">
			{#each recipe.ingredients as { ingredient, quantite, unite }}
				<li>
					<strong>{ingredient.nom}</strong> - {quantite} {unite || ''}
				</li>
			{/each}
		</ul>

		<!-- Étapes de préparation -->
		<h3 class="mt-6 text-2xl font-semibold text-[#F4ACB7]">Préparation :</h3>
		<ol class="mt-2 list-inside list-decimal space-y-2 text-[#9D8189]">
			{#each recipe.etapes as etape}
				<li>{etape}</li>
			{/each}
		</ol>

		<!-- Informations supplémentaires -->
		<div class="mt-6 grid grid-cols-2 gap-4 text-[#9D8189]">
			<div>
				<strong>Temps de préparation :</strong> {recipe.temps_preparation} minutes
			</div>
			<div>
				<strong>Temps de cuisson :</strong> {recipe.temps_cuisson} minutes
			</div>
			<div>
				<strong>Difficulté :</strong> {recipe.difficulte}
			</div>
			{#if recipe.allergenes && recipe.allergenes.length > 0}
				<div>
					<strong>Allergènes :</strong> {recipe.allergenes.join(', ')}
				</div>
			{/if}
		</div>
	</div>
</div> 