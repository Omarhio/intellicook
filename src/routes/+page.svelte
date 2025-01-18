<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Recipe } from '$lib/types/Recipe';
	import {
		Button,
		SearchInput,
		FilterGroup,
		RecipeCard,
		RecipeModal,
		Carousel
	} from '$lib/components';

	let searchTerm = '';
	let recipes: Recipe[] = [];
	let filteredRecipes: Recipe[] = [];
	let favorites: string[] = [];
	let selectedRecipe: Recipe | null = null;
	let allIngredients: Set<string> = new Set();
	let allAllergens = ['Poisson', 'Œuf', 'Halal', 'Crustacés', 'Soja', 'Végétarien'];
	let selectedIngredients: string[] = [];
	let excludedAllergens: string[] = [];
	let showIngredientList = false;
	let showAllergenList = false;
	let currentIndex = 0;
	let autoSlideInterval;
	const slideDuration = 5000;

	// Charger les recettes et ingrédients
	async function chargerRecettes() {
		try {
			const response = await fetch('/recette.json');
			if (!response.ok) throw new Error('Erreur lors du chargement des recettes');
			const data = await response.json();
			recipes = data.recettes;
			recipes.forEach((recipe) => {
				recipe.ingredients.forEach((ingredient) => allIngredients.add(ingredient.nom));
			});
		} catch (error) {
			console.error('Erreur de chargement des recettes :', error);
		}
	}

	// Gérer les favoris
	function toggleFavorite(recipeName: string) {
		if (favorites.includes(recipeName)) {
			favorites = favorites.filter((name) => name !== recipeName);
		} else {
			favorites = [...favorites, recipeName];
		}
		localStorage.setItem('favorites', JSON.stringify(favorites));
	}

	function resetFilters() {
		searchTerm = '';
		selectedIngredients = [];
		excludedAllergens = [];
	}

	// Mapping des allergènes
	const allergenMapping = {
		Poisson: ['Saumon', 'Thon', 'Crevettes', 'Morceaux de poulpe'],
		Œuf: ['Œuf', 'Tamago'],
		Halal: ['Porc', 'Porc chashu', 'Porc haché'],
		Crustacés: ['Crevettes', 'Morceaux de poulpe'],
		Soja: ['Sauce soja', 'Pâte de miso'],
		Végétarien: [
			'Poulet',
			'Porc',
			'Morceaux de poulpe',
			'Bœuf tranché',
			'Saumon',
			'Thon',
			'Crevettes'
		]
	};

	$: filteredRecipes = recipes.filter((recipe) => {
		const matchesSearch = searchTerm
			? recipe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
				recipe.ingredients.some((ingredient) =>
					ingredient.nom.toLowerCase().includes(searchTerm.toLowerCase())
				)
			: true;

		const matchesIngredients =
			selectedIngredients.length > 0
				? selectedIngredients.every((ingredient) =>
						recipe.ingredients.map((ing) => ing.nom).includes(ingredient)
					)
				: true;

		const excludesAllergens =
			excludedAllergens.length > 0
				? !recipe.ingredients.some((ingredient) =>
						excludedAllergens.some((allergen) =>
							allergenMapping[allergen]?.includes(ingredient.nom)
						)
					)
				: true;

		return matchesSearch && matchesIngredients && excludesAllergens;
	});

	onMount(async () => {
		await chargerRecettes();
		// Charger les favoris depuis le localStorage
		const storedFavorites = localStorage.getItem('favorites');
		if (storedFavorites) {
			favorites = JSON.parse(storedFavorites);
		}
		// Démarrer le carousel
		autoSlideInterval = setInterval(() => {
			currentIndex = (currentIndex + 1) % recipes.length;
		}, slideDuration);
	});

	onDestroy(() => {
		clearInterval(autoSlideInterval);
	});
</script>

<main class="flex min-h-screen flex-col items-center bg-[#FFF6F6] p-6 text-[#9D8189]">
	<div class="text-center">
		<h1 class="title-font text-4xl text-[#F4ACB7] md:text-5xl">Bienvenue sur Intellicook !</h1>
		<p class="mt-4 text-lg">Découvrez des recettes japonaises et kawaii 🍣</p>
	</div>

	<div class="mt-6">
		<img
			src="/images/tkthao219-bubududu.gif"
			alt="Animation kawaii"
			class="mx-auto h-48 w-auto rounded-lg"
		/>
	</div>

	<div class="mt-8 w-full max-w-2xl">
		<SearchInput
			bind:value={searchTerm}
			placeholder="Rechercher par nom ou ingrédient..."
			onClear={resetFilters}
		/>
	</div>

	<div class="mt-6 flex gap-4">
		<Button
			onClick={() => (showIngredientList = !showIngredientList)}
			label={showIngredientList ? 'Fermer ingrédients' : 'Ingrédients'}
		/>
		<Button
			onClick={() => (showAllergenList = !showAllergenList)}
			label={showAllergenList ? 'Fermer allergènes' : 'Allergènes'}
		/>
	</div>

	{#if showIngredientList}
		<FilterGroup
			title="Sélectionnez des ingrédients :"
			items={[...allIngredients]}
			bind:selectedItems={selectedIngredients}
			columns={4}
		/>
	{/if}

	{#if showAllergenList}
		<FilterGroup
			title="Excluez des allergènes :"
			items={allAllergens}
			bind:selectedItems={excludedAllergens}
			columns={3}
		/>
	{/if}

	{#if searchTerm || selectedIngredients.length > 0 || excludedAllergens.length > 0}
		{#if filteredRecipes.length > 0}
			<div class="mt-8 w-full max-w-3xl">
				<h2 class="text-2xl font-bold text-[#9D8189]">Résultats :</h2>
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
		{:else}
			<p class="mt-6 text-center text-lg text-[#9D8189]">
				Aucun résultat trouvé. Essayez d'ajuster vos filtres.
			</p>
		{/if}
	{/if}

	<Carousel items={recipes} bind:currentIndex />
</main>

<!-- Modale de recette -->
{#if selectedRecipe}
	<RecipeModal recipe={selectedRecipe} onClose={() => (selectedRecipe = null)} />
{/if}
