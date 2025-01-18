<script lang="ts">
	import type { Recipe } from '$lib/types/Recipe';
	import IconButton from '$lib/components/atoms/buttons/IconButton.svelte';

	export let recipe: Recipe;
	export let isFavorite: boolean = false;
	export let onFavoriteClick: (e: MouseEvent) => void;
	export let onClick: () => void;
</script>

<li class="relative mx-auto max-w-sm rounded-lg border p-4 pb-12 shadow-lg transition-all hover:bg-[#FDE2E4] sm:pb-4">
	<!-- Bouton pour ouvrir la modale -->
	<button
		class="w-full text-left"
		on:click={onClick}
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
		<p class="mt-2">Ingrédients : {recipe.ingredients.map((i) => i.nom).join(', ')}</p>
	</button>

	<!-- Icône cœur -->
	<IconButton
		onClick={(e) => {
			e.stopPropagation();
			onFavoriteClick(e);
		}}
		ariaLabel="Ajouter ou retirer des favoris"
		{isFavorite}
	/>
</li> 