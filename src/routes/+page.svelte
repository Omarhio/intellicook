<script lang="ts">
	import { SearchInput, Button, FilterGroup, RecipeCard, RecipeModal, Carousel } from "$lib/components";
	import type { Recipe } from "$lib/types/Recipe";
	import { onMount } from "svelte";

	let recipes: Recipe[] = [];
	let filteredRecipes: Recipe[] = [];
	let currentIndex = 0;
	let showIngredients = false;
	let showAllergens = false;
	let selectedIngredients: string[] = [];
	let selectedAllergens: string[] = [];
	let autoSlideInterval: number;
	let showModal = false;
	let selectedRecipe: Recipe | null = null;

	onMount(() => {
		fetch("/data/recipes.json")
			.then((response) => response.json())
			.then((data) => {
				recipes = data.recettes;
				filteredRecipes = [...recipes];
			})
			.catch(error => {
				console.error("Erreur lors du chargement des recettes:", error);
			});
	});

	function handleSearch(event: CustomEvent<string>) {
		const searchTerm = event.detail.toLowerCase();
		filteredRecipes = recipes.filter((recipe) =>
			recipe.nom.toLowerCase().includes(searchTerm)
		);
	}

	function handleIngredientSelection(event: CustomEvent<string[]>) {
		selectedIngredients = event.detail;
		filterRecipes();
	}

	function handleAllergenSelection(event: CustomEvent<string[]>) {
		selectedAllergens = event.detail;
		filterRecipes();
	}

	function filterRecipes() {
		filteredRecipes = recipes.filter((recipe) => {
			const matchIngredients =
				selectedIngredients.length === 0 ||
				recipe.ingredients.some((i) =>
					selectedIngredients.includes(i.ingredient.nom)
				);
			const matchAllergens =
				selectedAllergens.length === 0 ||
				recipe.allergenes.some((a) => selectedAllergens.includes(a));
			return matchIngredients && matchAllergens;
		});
	}
</script>

<main class="flex min-h-screen flex-col items-center">
	<h1 class="mt-8 text-4xl font-bold" style="color: #F4ACB7">
		Découvrez des recettes japonaises kawaii !
	</h1>
	<p class="mt-4 text-lg" style="color: #9D8189">
		Explorez notre collection de délicieuses recettes japonaises
	</p>

	<img src="/images/bubu-cooking-dudu-bubu.gif" alt="Bubu et Dudu qui cuisinent" class="mx-auto mt-4 h-32" />

	<div class="mt-8 w-full max-w-2xl px-4">
		<SearchInput on:input={handleSearch} placeholder="Rechercher une recette..." />
	</div>

	<div class="mt-8 flex flex-wrap justify-center gap-4">
		<Button on:click={() => (showIngredients = !showIngredients)}>
			{showIngredients ? "Masquer les ingrédients" : "Filtrer par ingrédients"}
		</Button>
		<Button on:click={() => (showAllergens = !showAllergens)}>
			{showAllergens ? "Masquer les allergènes" : "Filtrer par allergènes"}
		</Button>
	</div>

	{#if showIngredients}
		<FilterGroup
			title="Ingrédients"
			items={[...new Set(recipes.flatMap((r) => r.ingredients.map((i) => i.ingredient.nom)))]}
			selected={selectedIngredients}
			on:change={handleIngredientSelection}
		/>
	{/if}

	{#if showAllergens}
		<FilterGroup
			title="Allergènes"
			items={[...new Set(recipes.flatMap((r) => r.allergenes))]}
			selected={selectedAllergens}
			on:change={handleAllergenSelection}
		/>
	{/if}

	{#if filteredRecipes.length > 0}
		<div class="mt-8 w-full">
			<Carousel items={filteredRecipes} />
		</div>
	{:else}
		<p class="mt-8 text-lg" style="color: #9D8189">Aucune recette trouvée</p>
	{/if}

	{#if showModal && selectedRecipe}
		<RecipeModal recipe={selectedRecipe} on:close={() => showModal = false} />
	{/if}
</main>
