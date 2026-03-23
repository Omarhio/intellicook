<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { Recipe } from '$lib/types/Recipe';
	import { recipeStore } from '$lib/stores/recipes';
	import { SearchInput, CheckboxInput, RecipeCard, RecipeModal } from '$lib/components';

	let selectedRecipe = $state<Recipe | null>(null);
	let searchTerm = $state('');
	let showFavoritesOnly = $state(false);
	let selectedIngredients = $state<string[]>([]);
	let selectedAllergens = $state<string[]>([]);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		try {
			isLoading = true;
			await recipeStore.loadRecipes();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Erreur lors du chargement des recettes. Veuillez réessayer.';
		} finally {
			isLoading = false;
		}
	});

	// Réactivité via auto-subscription $store
	let recipes = $derived($recipeStore.recipes);
	let filteredRecipes = $derived(showFavoritesOnly ? $recipeStore.favorites : $recipeStore.filtered);
	let resultCount = $derived(filteredRecipes.length);

	let allIngredients = $derived(
		[...new Set(
			recipes
				.filter((r: Recipe) => r?.ingredients)
				.flatMap((r: Recipe) => r.ingredients)
				.filter((i) => i?.ingredient)
				.map((i) => i.ingredient.nom)
		)].sort()
	);

	let allAllergens = $derived(
		[...new Set(
			recipes
				.filter((r: Recipe) => r?.allergenes)
				.flatMap((r: Recipe) => r.allergenes ?? [])
		)].sort()
	);

	// Synchroniser les filtres avec le store
	$effect(() => {
		recipeStore.setSearchTerm(searchTerm);
	});

	$effect(() => {
		recipeStore.setSelectedTags(selectedIngredients);
	});

	$effect(() => {
		recipeStore.setSelectedAllergens(selectedAllergens);
	});

	function resetAllFilters() {
		searchTerm = '';
		selectedIngredients = [];
		selectedAllergens = [];
		showFavoritesOnly = false;
		recipeStore.resetFilters();
	}
</script>

<div class="min-h-screen bg-[#FFF6F6] pb-16">
	<div class="container mx-auto px-4 py-8">
		<h1 class="mb-8 text-center text-4xl font-bold tracking-normal text-[#F4ACB7]">Nos Recettes</h1>

		{#if error}
			<div class="mb-8 rounded-lg bg-red-100 p-4 text-red-700" transition:fade>
				<p>{error}</p>
				<button
					class="mt-2 text-sm underline"
					onclick={() => {
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
				<SearchInput
					bind:value={searchTerm}
					placeholder="Rechercher une recette..."
					oninput={(v) => (searchTerm = v)}
					onclear={() => {
						searchTerm = '';
						recipeStore.resetFilters();
					}}
				/>
			</div>

			{#if searchTerm || selectedIngredients.length > 0 || selectedAllergens.length > 0 || showFavoritesOnly}
				<button
					class="rounded-lg bg-[#F4ACB7] px-4 py-2 text-white transition-colors hover:bg-[#e690a0]"
					onclick={resetAllFilters}
					transition:fade
				>
					Réinitialiser les filtres
				</button>
			{/if}
		</div>

		<p class="mb-4 text-center text-[#9D8189]" transition:fade>
			{#if isLoading}
				Chargement des recettes...
			{:else}
				{resultCount} recette{resultCount > 1 ? 's' : ''} trouvée{resultCount > 1 ? 's' : ''}
			{/if}
		</p>

		<div class="mb-8 grid gap-8 md:grid-cols-[250px_1fr]">
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
								onfavorite={() => recipeStore.toggleFavorite(recipe.id)}
								onclick={() => (selectedRecipe = recipe)}
							/>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</div>

{#if selectedRecipe}
	<RecipeModal recipe={selectedRecipe} onclose={() => (selectedRecipe = null)} />
{/if}
