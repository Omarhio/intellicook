<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Recipe } from '$lib/types/Recipe';
	import IconButton from '$lib/components/ui/IconButton.svelte';

	export let recipe: Recipe;
	export let isFavorite: boolean = false;

	const dispatch = createEventDispatcher<{
		click: void;
		favorite: void;
	}>();

	let imgError = false;
	const defaultImage = '/images/recipe-placeholder.webp';

	function handleClick() {
		dispatch('click');
	}

	function handleFavorite(e: MouseEvent) {
		e.stopPropagation();
		dispatch('favorite');
	}

	function handleImageError() {
		imgError = true;
	}
</script>

<div class="relative mx-auto max-w-sm rounded-lg border p-4 pb-12 shadow-lg transition-all hover:bg-[#FDE2E4] sm:pb-4">
	<button
		class="w-full text-left"
		on:click={handleClick}
		type="button"
		aria-label="Voir les détails de la recette {recipe.nom}"
	>
		<img
			src={imgError ? defaultImage : recipe.image}
			alt={recipe.nom}
			class="h-48 w-full rounded-md object-cover"
			loading="lazy"
			on:error={handleImageError}
		/>
		<h2 class="mt-4 text-2xl font-semibold">{recipe.nom}</h2>
		<p class="mt-2 text-[#9D8189]">
			Ingrédients : {recipe.ingredients.map((i) => i.ingredient.nom).join(', ')}
		</p>
	</button>

	<IconButton
		on:click={handleFavorite}
		ariaLabel={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
		{isFavorite}
		className="absolute bottom-4 right-4 sm:bottom-auto sm:top-4"
	/>
</div> 