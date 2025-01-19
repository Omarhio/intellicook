<script lang="ts">
	import { onMount } from 'svelte';
	import type { Recipe } from '$lib/types/Recipe';
	import { recipeStore, favorites } from '$lib/stores/recipes';
	import {
		SearchInput,
		FilterButton,
		CheckboxInput,
		RecipeCard,
		RecipeModal
	} from '$lib/components';

	let recipes: Recipe[] = [];
	let filteredRecipes: Recipe[] = [];
	let selectedRecipe: Recipe | null = null;
	let searchTerm = '';
	let showFavoritesOnly = false;
	let selectedIngredients: string[] = [];
	let selectedAllergens: string[] = [];

	// S'abonner au store et charger les recettes
	recipeStore.subscribe(state => {
		recipes = state.recipes;
		filteredRecipes = state.filtered;
	});

	// Charger les recettes
	onMount(async () => {
		await recipeStore.loadRecipes();
	});

	// Gérer la recherche
	function handleSearch() {
		recipeStore.setSearchTerm(searchTerm);
	}

	// Gérer les filtres
	$: if (selectedAllergens.length > 0) {
		recipeStore.setSelectedAllergens(selectedAllergens);
	}

	$: if (selectedIngredients.length > 0) {
		recipeStore.setSelectedTags(selectedIngredients);
	}

	// Extraire tous les ingrédients uniques
	$: allIngredients = [...new Set(recipes.flatMap((r) => r.ingredients.map((i) => i.ingredient.nom)))].sort();

	// Extraire tous les allergènes uniques
	$: allAllergens = [...new Set(recipes.flatMap((r) => r.allergenes || []))].sort();
</script>

<div class="min-h-screen bg-[#FFF6F6] pb-16">
	<div class="container mx-auto px-4 py-8">
		<h1 class="mb-8 text-center text-4xl font-bold text-[#F4ACB7]">Nos Recettes</h1>

		<div class="mb-8 flex flex-wrap gap-4">
			<!-- Barre de recherche -->
			<SearchInput
				bind:value={searchTerm}
				placeholder="Rechercher une recette..."
				on:input={handleSearch}
				on:clear={() => {
					searchTerm = '';
					recipeStore.resetFilters();
				}}
			/>

			<!-- Bouton pour filtrer les favoris -->
			<FilterButton
				active={showFavoritesOnly}
				label={showFavoritesOnly ? 'Tous' : 'Favoris'}
				on:click={() => (showFavoritesOnly = !showFavoritesOnly)}
			/>
		</div>

		<div class="mb-8 grid gap-8 md:grid-cols-[250px_1fr]">
			<!-- Filtres -->
			<aside class="space-y-6 rounded-lg bg-white p-4 shadow-lg">
				<div>
					<h2 class="mb-4 text-xl font-semibold">Ingrédients</h2>
					<div class="space-y-2">
						{#each allIngredients as ingredient}
							<CheckboxInput
								label={ingredient}
								bind:group={selectedIngredients}
								value={ingredient}
							/>
						{/each}
					</div>
				</div>

				<div>
					<h2 class="mb-4 text-xl font-semibold">Allergènes</h2>
					<div class="space-y-2">
						{#each allAllergens as allergen}
							<CheckboxInput
								label={allergen}
								bind:group={selectedAllergens}
								value={allergen}
							/>
						{/each}
					</div>
				</div>
			</aside>

			<!-- Liste des recettes -->
			<ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each filteredRecipes as recipe (recipe.id)}
					<RecipeCard
						{recipe}
						isFavorite={recipe.favoris}
						on:favoriteClick={() => recipeStore.toggleFavorite(recipe.id)}
						on:click={() => (selectedRecipe = recipe)}
					/>
				{/each}
			</ul>
		</div>
	</div>
</div>

<!-- Modale de recette -->
{#if selectedRecipe}
	<RecipeModal recipe={selectedRecipe} on:close={() => (selectedRecipe = null)} />
{/if}
