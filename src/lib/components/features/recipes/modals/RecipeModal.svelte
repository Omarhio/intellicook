<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { onMount, onDestroy } from 'svelte';
	import type { Recipe } from '$lib/types/Recipe';
	import CloseButton from '$lib/components/ui/CloseButton.svelte';

	let {
		recipe,
		onclose
	}: {
		recipe: Recipe;
		onclose?: () => void;
	} = $props();

	let imgError = $state(false);
	const defaultImage = '/images/recipe-placeholder.webp';

	function handleClose() {
		onclose?.();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleClose();
		}
	}

	onMount(() => {
		document.body.style.overflow = 'hidden';
	});

	onDestroy(() => {
		document.body.style.overflow = '';
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black bg-opacity-70 backdrop-blur-[10px]"
	role="dialog"
	aria-modal="true"
	aria-labelledby="popup-title"
	aria-describedby="popup-description"
	transition:fade={{ duration: 200 }}
>
	<button
		class="absolute inset-0 bg-transparent"
		onclick={handleClose}
		aria-label="Fermer la recette"
		type="button"
	></button>

	<div
		class="popup-container relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-8 pt-12 shadow-lg"
		role="document"
		transition:scale={{ duration: 300, easing: quintOut }}
	>
		<CloseButton onclick={handleClose} className="absolute right-4 top-4" />

		<img
			src={imgError ? defaultImage : recipe.image}
			alt={recipe.nom}
			class="mb-4 h-64 w-full rounded-lg object-cover"
			onerror={() => (imgError = true)}
		/>
		<h2 id="popup-title" class="text-3xl font-bold text-[#F4ACB7]">{recipe.nom}</h2>
		<p id="popup-description" class="sr-only">
			Détails de la recette {recipe.nom}, incluant les ingrédients et les étapes de préparation.
		</p>

		<section aria-labelledby="ingredients-title">
			<h3 id="ingredients-title" class="mt-4 text-2xl font-semibold text-[#F4ACB7]">
				Ingrédients :
			</h3>
			<ul class="mt-2 list-inside list-disc space-y-2 text-[#9D8189]">
				{#each recipe.ingredients as { ingredient, quantite, unite }}
					<li>
						<strong>{ingredient.nom}</strong> - {quantite}
						{unite || ''}
					</li>
				{/each}
			</ul>
		</section>

		<section aria-labelledby="preparation-title">
			<h3 id="preparation-title" class="mt-6 text-2xl font-semibold text-[#F4ACB7]">
				Préparation :
			</h3>
			<ol class="mt-2 list-inside list-decimal space-y-2 text-[#9D8189]">
				{#each recipe.etapes as etape}
					<li>{etape}</li>
				{/each}
			</ol>
		</section>

		<section aria-labelledby="details-title" class="mt-6">
			<h3 id="details-title" class="sr-only">Informations supplémentaires</h3>
			<div class="grid grid-cols-1 gap-4 text-[#9D8189] sm:grid-cols-2">
				<div><strong>Temps de préparation :</strong> {recipe.temps_preparation} minutes</div>
				<div><strong>Temps de cuisson :</strong> {recipe.temps_cuisson} minutes</div>
				<div><strong>Difficulté :</strong> {recipe.difficulte}</div>
				{#if recipe.allergenes && recipe.allergenes.length > 0}
					<div><strong>Allergènes :</strong> {recipe.allergenes.join(', ')}</div>
				{/if}
			</div>
		</section>
	</div>
</div>

<style>
	.popup-container {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.popup-container::-webkit-scrollbar {
		display: none;
	}
</style>
