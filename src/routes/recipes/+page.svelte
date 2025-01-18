<script lang="ts">
	import { onMount } from 'svelte';
	import type { Recipe } from '$lib/types/Recipe';
	import { recettes, getRecettes } from '../../data/recetteStore';
	import {
		SearchInput,
		FilterButton,
		CheckboxInput,
		RecipeCard,
		RecipeModal
	} from '$lib/components';

	let recipes: Recipe[] = [];
	let favorites: string[] = [];
	let selectedRecipe: Recipe | null = null;
	let searchTerm = '';
	let showFavoritesOnly = false;
	let selectedIngredients: string[] = [];
	let selectedAllergens: string[] = [];

	// S'abonner au store et charger les recettes
	recettes.subscribe((value) => {
		recipes = value;
	});

	// Charger les recettes et les favoris
	onMount(async () => {
		await getRecettes();
		const storedFavorites = localStorage.getItem('favorites');
		if (storedFavorites) {
			favorites = JSON.parse(storedFavorites);
		}
	});

	// Gérer les favoris
	function toggleFavorite(recipeName: string) {
		if (favorites.includes(recipeName)) {
			favorites = favorites.filter((name) => name !== recipeName);
		} else {
			favorites = [...favorites, recipeName];
		}
		localStorage.setItem('favorites', JSON.stringify(favorites));
	}

	// Filtrer les recettes
	$: filteredRecipes = recipes.filter((recipe) => {
		const matchesSearch = recipe.nom.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesFavorites = !showFavoritesOnly || favorites.includes(recipe.nom);
		const matchesIngredients =
			selectedIngredients.length === 0 ||
			selectedIngredients.every((ing) => recipe.ingredients.some((i) => i.nom === ing));
		const matchesAllergens =
			selectedAllergens.length === 0 ||
			!selectedAllergens.some((allergen) => recipe.allergenes?.includes(allergen));
		return matchesSearch && matchesFavorites && matchesIngredients && matchesAllergens;
	});

	// Extraire tous les ingrédients uniques
	$: allIngredients = [...new Set(recipes.flatMap((r) => r.ingredients.map((i) => i.nom)))].sort();

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
				onClear={() => (searchTerm = '')}
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
				{#each filteredRecipes as recipe (recipe.nom)}
					<RecipeCard
						{recipe}
						isFavorite={favorites.includes(recipe.nom)}
						onFavoriteClick={() => toggleFavorite(recipe.nom)}
						onClick={() => (selectedRecipe = recipe)}
					/>
				{/each}
			</ul>
		</div>
	</div>
</div>

<!-- Modale de recette -->
{#if selectedRecipe}
	<RecipeModal recipe={selectedRecipe} onClose={() => (selectedRecipe = null)} />
{/if}
