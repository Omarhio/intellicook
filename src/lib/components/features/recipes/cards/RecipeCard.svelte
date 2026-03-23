<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';
	import type { Recipe } from '$lib/types/Recipe';
	import IconButton from '$lib/components/ui/IconButton.svelte';

	let {
		recipe,
		isFavorite = false,
		onclick,
		onfavorite
	}: {
		recipe: Recipe;
		isFavorite?: boolean;
		onclick?: MouseEventHandler<HTMLButtonElement>;
		onfavorite?: (e: MouseEvent) => void;
	} = $props();

	let imgError = $state(false);
	const defaultImage = '/images/recipe-placeholder.webp';

	function handleFavorite(e: MouseEvent) {
		e.stopPropagation();
		onfavorite?.(e);
	}
</script>

<div class="relative mx-auto max-w-sm rounded-lg border p-4 pb-12 shadow-lg transition-all hover:bg-[#FDE2E4] sm:pb-4">
	<button
		class="w-full text-left"
		{onclick}
		type="button"
		aria-label="Voir les détails de la recette {recipe.nom}"
	>
		<img
			src={imgError ? defaultImage : recipe.image}
			alt={recipe.nom}
			class="h-48 w-full rounded-md object-cover"
			loading="lazy"
			onerror={() => (imgError = true)}
		/>
		<h2 class="mt-4 text-2xl font-semibold">{recipe.nom}</h2>
		<p class="mt-2 text-[#9D8189]">
			Ingrédients : {recipe.ingredients.map((i) => i.ingredient.nom).join(', ')}
		</p>
	</button>

	<IconButton
		onclick={handleFavorite}
		ariaLabel={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
		{isFavorite}
		className="absolute bottom-4 right-4 sm:bottom-auto sm:top-4"
	/>
</div>
