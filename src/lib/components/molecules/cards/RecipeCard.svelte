<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Recipe } from '$lib/types/Recipe';
	import IconButton from '$lib/components/atoms/buttons/IconButton.svelte';

	export let recipe: Recipe;
	export let isFavorite: boolean = false;

	const dispatch = createEventDispatcher<{
		click: void;
		favorite: void;
	}>();

	function handleClick() {
		dispatch('click');
	}

	function handleFavorite(e: MouseEvent) {
		e.stopPropagation();
		dispatch('favorite');
	}
</script>

<div class="relative mx-auto max-w-sm rounded-lg border p-4 pb-12 shadow-lg transition-all hover:bg-[#FDE2E4] sm:pb-4">
	<button
		class="w-full text-left"
		on:click={handleClick}
		type="button"
		aria-label="Voir les détails de la recette"
	>
		<img
			src={recipe.image}
			alt={recipe.nom}
			class="h-48 w-full rounded-md object-cover"
			loading="lazy"
		/>
		<h2 class="mt-4 text-2xl font-semibold">{recipe.nom}</h2>
		<p class="mt-2">Ingrédients : {recipe.ingredients.map((i) => i.ingredient.nom).join(', ')}</p>
	</button>

	<IconButton
		on:click={handleFavorite}
		ariaLabel="Ajouter ou retirer des favoris"
		{isFavorite}
	/>
</div> 