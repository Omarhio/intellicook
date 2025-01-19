<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
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
	let isLoading = true;
	let error: string | null = null;

	// Charger les recettes
	onMount(async () => {
		try {
			console.log('Chargement des recettes...');
			isLoading = true;
			await recipeStore.loadRecipes();
			console.log('Recettes chargées avec succès');
		} catch (e) {
			console.error('Erreur lors du chargement des recettes:', e);
			error = e instanceof Error ? e.message : "Erreur lors du chargement des recettes. Veuillez réessayer.";
		} finally {
			isLoading = false;
		}
	});

	// S'abonner au store et charger les recettes
	recipeStore.subscribe(state => {
		console.log('État du store mis à jour:', {
			recipes: state.recipes.length,
			filtered: state.filtered.length,
			searchTerm: state.searchTerm,
			selectedTags: state.selectedTags,
			selectedAllergens: state.selectedAllergens
		});
		recipes = state.recipes;
		filteredRecipes = showFavoritesOnly 
			? state.filtered.filter(r => r.favoris)
			: state.filtered;
	});

	// Gérer la recherche
	function handleSearch() {
		recipeStore.setSearchTerm(searchTerm);
	}

	// Gérer les filtres
	$: if (selectedAllergens.length > 0) {
		recipeStore.setSelectedAllergens(selectedAllergens);
	} else {
		recipeStore.setSelectedAllergens([]);
	}

	$: if (selectedIngredients.length > 0) {
		recipeStore.setSelectedTags(selectedIngredients);
	} else {
		recipeStore.setSelectedTags([]);
	}

	// Réinitialiser tous les filtres
	function resetAllFilters() {
		searchTerm = '';
		selectedIngredients = [];
		selectedAllergens = [];
		showFavoritesOnly = false;
		recipeStore.resetFilters();
	}

	// Extraire tous les ingrédients uniques
	$: allIngredients = [...new Set(
		recipes
			.filter(r => r && r.ingredients)
			.flatMap(r => r.ingredients)
			.filter(i => i && i.ingredient)
			.map(i => i.ingredient.nom)
	)].sort();

	// Extraire tous les allergènes uniques
	$: allAllergens = [...new Set(
		recipes
			.filter(r => r && r.allergenes)
			.flatMap(r => r.allergenes || [])
	)].sort();

	// Nombre de résultats
	$: resultCount = filteredRecipes.length;
</script>

<div class="min-h-screen bg-[#FFF6F6] pb-16">
	<div class="container mx-auto px-4 py-8">
		<h1 class="mb-8 text-center text-4xl font-bold text-[#F4ACB7] tracking-normal">Nos Recettes</h1>

		{#if error}
			<div class="mb-8 rounded-lg bg-red-100 p-4 text-red-700" transition:fade>
				<p>{error}</p>
				<button 
					class="mt-2 text-sm underline" 
					on:click={() => {
						error = null;
						recipeStore.loadRecipes();
					}}
				>
					Réessayer
				</button>
			</div>
		{/if}

		<div class="mb-8 flex flex-wrap items-center justify-between gap-4">
			<div class="flex flex-1 flex-wrap gap-4">
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

			<!-- Bouton réinitialiser -->
			{#if searchTerm || selectedIngredients.length > 0 || selectedAllergens.length > 0 || showFavoritesOnly}
				<button
					class="rounded-lg bg-[#F4ACB7] px-4 py-2 text-white transition-colors hover:bg-[#e690a0]"
					on:click={resetAllFilters}
					transition:fade
				>
					Réinitialiser les filtres
				</button>
			{/if}
		</div>

		<!-- Nombre de résultats -->
		<p class="mb-4 text-center text-[#9D8189]" transition:fade>
			{#if isLoading}
				Chargement des recettes...
			{:else}
				{resultCount} recette{resultCount > 1 ? 's' : ''} trouvée{resultCount > 1 ? 's' : ''}
			{/if}
		</p>

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
			{#if isLoading}
				<div class="flex items-center justify-center">
					<div class="h-32 w-32 animate-pulse rounded-full bg-[#F4ACB7]/20"></div>
				</div>
			{:else}
				<ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{#each filteredRecipes as recipe (recipe.id)}
						<li transition:fade>
							<RecipeCard
								{recipe}
								isFavorite={recipe.favoris}
								on:favoriteClick={() => recipeStore.toggleFavorite(recipe.id)}
								on:click={() => (selectedRecipe = recipe)}
							/>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</div>

<!-- Modale de recette -->
{#if selectedRecipe}
	<RecipeModal recipe={selectedRecipe} on:close={() => (selectedRecipe = null)} />
{/if}
