<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Button from '$lib/components/atoms/buttons/Button.svelte';
	import SearchInput from '$lib/components/atoms/inputs/SearchInput.svelte';
	import FilterGroup from '$lib/components/molecules/filters/FilterGroup.svelte';
	import RecipeCard from '$lib/components/molecules/cards/RecipeCard.svelte';
	import Carousel from '$lib/components/molecules/carousel/Carousel.svelte';

	let searchTerm = '';
	let recettes = [];
	let filteredRecettes = [];
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
			recettes = data.recettes;
			recettes.forEach((recette) => {
				recette.ingredients.forEach((ingredient) => allIngredients.add(ingredient.nom));
			});
		} catch (error) {
			console.error('Erreur de chargement des recettes :', error);
		}
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

	$: filteredRecettes = recettes.filter((recette) => {
		const matchesSearch = searchTerm
			? recette.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
				recette.ingredients.some((ingredient) =>
					ingredient.nom.toLowerCase().includes(searchTerm.toLowerCase())
				)
			: true;

		const matchesIngredients =
			selectedIngredients.length > 0
				? selectedIngredients.every((ingredient) =>
						recette.ingredients.map((ing) => ing.nom).includes(ingredient)
					)
				: true;

		const excludesAllergens =
			excludedAllergens.length > 0
				? !recette.ingredients.some((ingredient) =>
						excludedAllergens.some((allergen) =>
							allergenMapping[allergen]?.includes(ingredient.nom)
						)
					)
				: true;

		return matchesSearch && matchesIngredients && excludesAllergens;
	});

	onMount(async () => {
		await chargerRecettes();
		autoSlideInterval = setInterval(() => {
			currentIndex = (currentIndex + 1) % recettes.length;
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
		{#if filteredRecettes.length > 0}
			<div class="mt-8 w-full max-w-3xl">
				<h2 class="text-2xl font-bold text-[#9D8189]">Résultats :</h2>
				<ul class="space-y-6">
					{#each filteredRecettes as recipe}
						<RecipeCard {recipe} />
					{/each}
				</ul>
			</div>
		{:else}
			<p class="mt-6 text-center text-lg text-[#9D8189]">
				Aucun résultat trouvé. Essayez d'ajuster vos filtres.
			</p>
		{/if}
	{/if}

	<Carousel items={recettes} bind:currentIndex />
</main>
