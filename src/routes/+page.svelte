<script>
	import { onMount, onDestroy } from 'svelte';

	let searchTerm = '';
	let recettes = [];
	let filteredRecettes = [];
	let allIngredients = new Set();
	let allAllergens = ['Poisson', 'Œuf', 'Halal', 'Crustacés', 'Soja', 'Végétarien'];
	let selectedIngredients = [];
	let excludedAllergens = [];
	let showIngredientList = false;
	let showAllergenList = false;

	let currentIndex = 0;
	let autoSlideInterval;
	const slideDuration = 5000;

	// Mapping des ingrédients (ID → Nom)
	let ingredientMap = {};

	// Charger les recettes et la correspondance des ingrédients
	async function chargerRecettes() {
		try {
			const response = await fetch('/recette.json');
			if (!response.ok) throw new Error('Erreur lors du chargement des recettes');
			const data = await response.json();

			// Construire la correspondance ID → Nom
			data.ingredients.forEach((ingredient) => {
				ingredientMap[ingredient.id] = ingredient.nom;
			});

			// Remplacer les IDs par les noms des ingrédients dans les recettes
			recettes = data.recettes.map((recette) => ({
				...recette,
				ingredients: recette.ingredients.map(
					(id) => ingredientMap[id] || `Ingrédient inconnu (ID: ${id})`
				)
			}));

			// Récupérer les ingrédients uniques
			recettes.forEach((recette) => {
				recette.ingredients.forEach((ingredient) => allIngredients.add(ingredient));
			});
		} catch (error) {
			console.error('Erreur de chargement des recettes :', error);
		}
	}

	// Gestion du carrousel
	function slideLeft() {
		currentIndex = (currentIndex - 1 + recettes.length) % recettes.length;
	}

	function slideRight() {
		currentIndex = (currentIndex + 1) % recettes.length;
	}

	function getRecipe(indexOffset) {
		const total = recettes.length;
		return recettes[(currentIndex + indexOffset + total) % total];
	}

	function resetFilters() {
		searchTerm = '';
		selectedIngredients = [];
		excludedAllergens = [];
	}

	// Filtrage des recettes
	$: filteredRecettes = recettes.filter((recette) => {
		const matchesSearch = searchTerm
			? recette.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
			  recette.ingredients.some((ingredient) =>
				  ingredient.toLowerCase().includes(searchTerm.toLowerCase())
			  )
			: true;

		const matchesIngredients =
			selectedIngredients.length > 0
				? selectedIngredients.every((ingredient) => recette.ingredients.includes(ingredient))
				: true;

		const excludesAllergens =
			excludedAllergens.length > 0
				? !recette.ingredients.some((ingredient) =>
					  excludedAllergens.some((allergen) => allergenMapping[allergen]?.includes(ingredient))
				  )
				: true;

		return matchesSearch && matchesIngredients && excludesAllergens;
	});

	// Allergènes
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

	onMount(async () => {
		await chargerRecettes();

		autoSlideInterval = setInterval(slideRight, slideDuration);
	});

	onDestroy(() => {
		clearInterval(autoSlideInterval);
	});
</script>

<main class="flex flex-col items-center bg-[#FFF6F6] p-6 text-[#9D8189] min-h-screen">
	<!-- TITRE ET SOUS-TITRE -->
	<div class="text-center">
		<h1 class="title-font text-4xl text-[#F4ACB7] md:text-5xl">Bienvenue sur Intellicook !</h1>
		<p class="mt-4 text-lg">Découvrez des recettes japonaises et kawaii 🍣</p>
	</div>

	<!-- BARRE DE RECHERCHE -->
	<div class="gap-6 sm:gap-0 mt-8 flex w-full max-w-2xl flex-col items-center md:flex-row md:space-x-4">
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
		<div class="mt-6 w-full max-w-6xl rounded-lg bg-white p-6 shadow-lg">
			<h2 class="mb-4 text-xl font-bold text-[#9D8189]">Sélectionnez des ingrédients :</h2>
			<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
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

		<!-- CAROUSEL -->
		<div class="relative mt-10 w-full max-w-6xl">
			<h2 class="mb-8 text-center text-3xl font-bold text-[#9D8189]">Nos recettes du jour</h2>
	
			<div class="flex items-center justify-center gap-6">
				{#if recettes.length > 0}
					<div class="w-60 scale-90 opacity-70 transform transition-all">
						<img
							src={getRecipe(-1).image}
							alt={getRecipe(-1).nom}
							class="h-40 w-full rounded-lg object-cover"
						/>
						<h3 class="mt-2 text-center text-sm font-semibold">{getRecipe(-1).nom}</h3>
					</div>
					<div class="w-80 scale-100 shadow-lg transform transition-all">
						<img
							src={getRecipe(0).image}
							alt={getRecipe(0).nom}
							class="h-48 w-full rounded-lg object-cover"
						/>
						<h3 class="mt-4 text-center text-xl font-bold text-[#F4ACB7]">{getRecipe(0).nom}</h3>
						<p class="mt-2 text-center text-sm text-[#9D8189]">
							<strong>Ingrédients :</strong> {getRecipe(0).ingredients.join(', ')}
						</p>
					</div>
					<div class="w-60 scale-90 opacity-70 transform transition-all">
						<img
							src={getRecipe(1).image}
							alt={getRecipe(1).nom}
							class="h-40 w-full rounded-lg object-cover"
						/>
						<h3 class="mt-2 text-center text-sm font-semibold">{getRecipe(1).nom}</h3>
					</div>
				{/if}
			</div>
	
			<!-- Indicateurs -->
			<div class="mt-6 flex justify-center gap-2">
				{#each Array.from({ length: recettes.length }) as _, index}
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button
						on:click={() => (currentIndex = index)}
						class="w-3 h-3 rounded-full transition-all 
							{currentIndex === index ? 'bg-[#F4ACB7] scale-125' : 'bg-gray-300'}"
					></button>
				{/each}
			</div>
		</div>
</main>