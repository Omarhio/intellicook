<script lang="ts">
	import { SearchInput, Button, FilterGroup, Carousel } from '$lib/components';
	import type { Recipe } from '$lib/types/Recipe';
	import { recipeStore } from '$lib/stores/recipes';
	import { onMount } from 'svelte';

	let showIngredients = $state(false);
	let showAllergens = $state(false);
	let selectedIngredients = $state<string[]>([]);
	let selectedAllergens = $state<string[]>([]);
	let searchTerm = $state('');

	onMount(async () => {
		await recipeStore.loadRecipes();
	});

	let allRecipes = $derived($recipeStore.recipes);

	let filteredRecipes = $derived(() => {
		return allRecipes.filter((recipe: Recipe) => {
			const matchSearch =
				searchTerm === '' || recipe.nom.toLowerCase().includes(searchTerm.toLowerCase());

			const matchIngredients =
				selectedIngredients.length === 0 ||
				recipe.ingredients.some((i) => selectedIngredients.includes(i.ingredient.nom));

			const matchAllergens =
				selectedAllergens.length === 0 ||
				(recipe.allergenes ?? []).some((a) => selectedAllergens.includes(a));

			return matchSearch && matchIngredients && matchAllergens;
		});
	});

	let allIngredients = $derived(
		[...new Set(allRecipes.flatMap((r: Recipe) => r.ingredients.map((i) => i.ingredient.nom)))].sort()
	);

	let allAllergens = $derived(
		[...new Set(allRecipes.flatMap((r: Recipe) => r.allergenes ?? []))].sort()
	);

	function handleSearch(value: string) {
		searchTerm = value;
	}

	function clearSearch() {
		searchTerm = '';
	}
</script>

<main class="flex min-h-screen flex-col items-center bg-[#FFF6F6] pb-16">
	<div class="container mx-auto px-4 py-8">
		<h1 class="mt-8 text-center text-4xl font-bold text-[#F4ACB7]">
			Découvrez des recettes japonaises kawaii !
		</h1>
		<p class="mt-4 text-center text-lg text-[#9D8189]">
			Explorez notre collection de délicieuses recettes japonaises
		</p>

		<img
			src="/images/bubu-cooking-dudu-bubu.gif"
			alt="Bubu et Dudu qui cuisinent"
			class="mx-auto mt-4 h-32"
		/>

		<div class="mx-auto mt-8 w-full max-w-2xl">
			<SearchInput
				bind:value={searchTerm}
				oninput={handleSearch}
				onclear={clearSearch}
				placeholder="Rechercher une recette..."
			/>
		</div>

		<div class="mt-8 flex flex-wrap justify-center gap-4">
			<Button onclick={() => (showIngredients = !showIngredients)}>
				{showIngredients ? 'Masquer les ingrédients' : 'Filtrer par ingrédients'}
			</Button>
			<Button onclick={() => (showAllergens = !showAllergens)}>
				{showAllergens ? 'Masquer les allergènes' : 'Filtrer par allergènes'}
			</Button>
		</div>

		{#if showIngredients}
			<FilterGroup title="Ingrédients" items={allIngredients} bind:selected={selectedIngredients} />
		{/if}

		{#if showAllergens}
			<FilterGroup title="Allergènes" items={allAllergens} bind:selected={selectedAllergens} />
		{/if}

		{#if filteredRecipes().length > 0}
			<div class="mt-8 w-full">
				<Carousel items={filteredRecipes()} />
			</div>
		{:else}
			<p class="mt-8 text-center text-lg" style="color: #9D8189">Aucune recette trouvée</p>
		{/if}
	</div>
</main>
