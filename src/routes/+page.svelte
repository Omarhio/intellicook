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
	let searchTerm = '';

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
		searchTerm = event.detail;
		filteredRecipes = recipes.filter((recipe) =>
			recipe.nom.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}

	function clearSearch() {
		searchTerm = '';
		filteredRecipes = [...recipes];
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

<main class="min-h-screen bg-[#FFF6F6] flex flex-col items-center pb-16">
	<div class="container mx-auto px-4 py-8">
		<h1 class="mt-8 text-4xl font-bold text-[#F4ACB7] text-center">
			Découvrez des recettes japonaises kawaii !
		</h1>
		<p class="mt-4 text-lg text-[#9D8189] text-center">
			Explorez notre collection de délicieuses recettes japonaises
		</p>

		<img src="/images/bubu-cooking-dudu-bubu.gif" alt="Bubu et Dudu qui cuisinent" class="mx-auto mt-4 h-32" />

		<div class="mt-8 w-full max-w-2xl mx-auto">
			<SearchInput 
				bind:value={searchTerm}
				on:input={handleSearch}
				on:clear={clearSearch}
				placeholder="Rechercher une recette..." 
			/>
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
	</div>
</main>
