<script>
	import { onMount } from 'svelte';

	let searchTerm = '';
	let recettes = [];
	let filteredRecettes = [];
	let allIngredients = new Set();
	let allAllergens = ['Poisson', 'Œuf', 'Halal', 'Crustacés', 'Soja', 'Végétarien'];
	let selectedIngredients = [];
	let excludedAllergens = [];
	let showIngredientList = false;
	let showAllergenList = false;

	onMount(async () => {
		try {
			const response = await fetch('/recette.json');
			if (!response.ok) throw new Error('Erreur lors du chargement des recettes');
			const data = await response.json();
			recettes = data.recettes;

			data.recettes.forEach((recette) => {
				recette.ingredients.forEach((ingredient) => allIngredients.add(ingredient));
			});
		} catch (error) {
			console.error('Erreur de chargement des recettes :', error);
		}
	});

	const allergenMapping = {
		Poisson: ['Saumon', 'Thon', 'Crevette', 'Saumon grillé', 'Morceaux de poulpe'],
		Œuf: ['Œuf', 'Tamago'],
		Halal: ['Porc', 'Porc chashu', 'Porc haché'],
		Crustacés: ['Crevettes', 'Crabe', 'Morceaux de poulpe'],
		Soja: ['Sauce soja', 'Miso', 'Edamame'],
		Végétarien: [
			'Poulet',
			'Porc',
			'Porc chashu',
			'Porc haché',
			'Morceaux de poulpe',
			'Bœuf tranché',
			'Saumon',
			'Thon',
			'Crevette',
			'Saumon grillé',
			'Crevettes',
			'Crabe'
		]
	};

	function resetFilters() {
		searchTerm = '';
		selectedIngredients = [];
		excludedAllergens = [];
	}

	$: filteredRecettes = recettes.filter((recette) => {
		// Filtrer par recherche
		const matchesSearch = searchTerm
			? recette.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
				recette.ingredients.some((ingredient) =>
					ingredient.toLowerCase().includes(searchTerm.toLowerCase())
				)
			: true;

		// Filtrer par ingrédients sélectionnés
		const matchesIngredients =
			selectedIngredients.length > 0
				? selectedIngredients.every((ingredient) => recette.ingredients.includes(ingredient))
				: true;

		// Exclure par allergènes
		const excludesAllergens =
			excludedAllergens.length > 0
				? !recette.ingredients.some((ingredient) =>
						excludedAllergens.some((allergen) => allergenMapping[allergen]?.includes(ingredient))
					)
				: true;

		return matchesSearch && matchesIngredients && excludesAllergens;
	});
</script>

<main class="flex min-h-screen flex-col items-center bg-[#FFF6F6] p-6 text-[#9D8189]">
	<!-- TITRE ET SOUS-TITRE -->
	<div class="text-center">
		<h1 class="title-font text-4xl text-[#F4ACB7] md:text-5xl">Bienvenue sur Intellicook !</h1>
		<p class="mt-4 text-lg">Découvrez des recettes japonaises et kawaii 🍣</p>
	</div>

	<!-- BARRE DE RECHERCHE ET BOUTONS -->
	<div
		class="mt-8 flex w-full max-w-2xl flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0"
	>
		<input
			type="text"
			bind:value={searchTerm}
			placeholder="Rechercher par nom ou ingrédient..."
			class="w-full rounded-3xl border-2 border-[#F4ACB7] p-3 text-center text-lg focus:ring-2 focus:ring-[#F4ACB7]"
		/>
		<button
			on:click={resetFilters}
			class="rounded-lg bg-[#F4ACB7] px-6 py-2 font-bold text-white hover:bg-[#e690a0]"
		>
			Effacer
		</button>
	</div>

	<!-- BOUTONS INGREDIENTS ET ALLERGENES -->
	<div class="mt-6 flex gap-4">
		<button
			on:click={() => (showIngredientList = !showIngredientList)}
			class="rounded-lg bg-[#F4ACB7] px-6 py-2 font-bold text-white hover:bg-[#e690a0]"
		>
			{showIngredientList ? 'Fermer ingrédients' : 'Ingrédients'}
		</button>
		<button
			on:click={() => (showAllergenList = !showAllergenList)}
			class="rounded-lg bg-[#F4ACB7] px-6 py-2 font-bold text-white hover:bg-[#e690a0]"
		>
			{showAllergenList ? 'Fermer allergènes' : 'Allergènes'}
		</button>
	</div>

	<!-- LISTE D'INGRÉDIENTS -->
	{#if showIngredientList}
		<div class="mt-6 w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg">
			<h2 class="mb-4 text-xl font-bold text-[#9D8189]">Sélectionnez des ingrédients :</h2>
			<div class="grid grid-cols-2 gap-4 md:grid-cols-3">
				{#each Array.from(allIngredients) as ingredient, i}
					<label for={`ingredient-${i}`} class="flex items-center gap-2">
						<input
							type="checkbox"
							id={`ingredient-${i}`}
							name="ingredients"
							bind:group={selectedIngredients}
							value={ingredient}
							class="text-[#F4ACB7] accent-[#F4ACB7]"
						/>
						<span class="text-[#9D8189]">{ingredient}</span>
					</label>
				{/each}
			</div>
		</div>
	{/if}

	<!-- LISTE D'ALLERGENES -->
	{#if showAllergenList}
		<div class="mt-6 w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg">
			<h2 class="mb-4 text-xl font-bold text-[#9D8189]">Excluez des allergènes :</h2>
			<div class="grid grid-cols-2 gap-4 md:grid-cols-3">
				{#each allAllergens as allergen, i}
					<label for={`allergen-${i}`} class="flex items-center gap-2">
						<input
							type="checkbox"
							id={`allergen-${i}`}
							name="allergens"
							bind:group={excludedAllergens}
							value={allergen}
							class="text-[#F4ACB7] accent-[#F4ACB7]"
						/>
						<span class="text-[#9D8189]">{allergen}</span>
					</label>
				{/each}
			</div>
		</div>
	{/if}

	<!-- RESULTATS -->
	{#if searchTerm || selectedIngredients.length > 0 || excludedAllergens.length > 0}
		<div class="mt-8 w-full max-w-3xl">
			<h2 class="mb-6 text-2xl font-bold text-[#9D8189]">Résultats :</h2>
			{#if filteredRecettes.length > 0}
				<ul class="space-y-6">
					{#each filteredRecettes as recette}
						<li
							class="flex flex-col items-center gap-4 rounded-lg bg-white p-4 shadow-lg md:flex-row"
						>
							<img
								src={recette.image}
								alt={recette.nom}
								class="h-32 w-32 rounded-lg object-cover"
							/>
							<div class="text-center md:text-left">
								<h3 class="title-font text-xl text-[#F4ACB7] md:text-2xl">{recette.nom}</h3>
								<p class="mt-2 text-sm text-[#9D8189] md:text-base">
									<strong>Ingrédients :</strong>
									{recette.ingredients.join(', ')}
								</p>
							</div>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="mt-4 text-center text-lg text-[#9D8189]">
					Aucun résultat trouvé. Essayez d'ajuster votre recherche ou vos filtres.
				</p>
			{/if}
		</div>
	{/if}
</main>
