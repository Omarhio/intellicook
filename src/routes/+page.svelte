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

	// Charger les recettes et ingrédients
	async function chargerRecettes() {
		try {
			const response = await fetch('/recette.json'); // Assurez-vous que le fichier est disponible
			if (!response.ok) throw new Error('Erreur lors du chargement des recettes');
			const data = await response.json();

			// Extraire les recettes
			recettes = data.recettes.map((recette) => ({
				...recette,
				ingredients: recette.ingredients.map((ingredient) => ({
					nom: ingredient.nom,
					dosage: ingredient.dosage
				}))
			}));

			// Extraire tous les ingrédients uniques
			recettes.forEach((recette) => {
				recette.ingredients.forEach((ingredient) => allIngredients.add(ingredient.nom));
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

	onMount(async () => {
		await chargerRecettes();

		// Activer le carrousel
		autoSlideInterval = setInterval(slideRight, slideDuration);
	});

	onDestroy(() => {
		clearInterval(autoSlideInterval);
	});
</script>

<main class="flex min-h-screen flex-col items-center bg-[#FFF6F6] p-6 text-[#9D8189]">
	<!-- TITRE ET SOUS-TITRE -->
	<div class="text-center">
		<h1 class="title-font text-4xl text-[#F4ACB7] md:text-5xl">Bienvenue sur Intellicook !</h1>
		<p class="mt-4 text-lg">Découvrez des recettes japonaises et kawaii 🍣</p>
	</div>

	<!-- GIF ANIMÉ -->
	<div class="mt-6">
		<img
			src="/images/tkthao219-bubududu.gif"
			alt="Animation kawaii"
			class="mx-auto h-48 w-auto rounded-lg"
		/>
	</div>

	<!-- BARRE DE RECHERCHE -->
	<div class="mt-8 flex w-full max-w-2xl items-center gap-4">
		<div class="relative w-full">
			<input
				type="text"
				bind:value={searchTerm}
				placeholder="Rechercher par nom ou ingrédient..."
				class="w-full rounded-3xl border-2 border-[#F4ACB7] p-3 text-center text-lg placeholder:text-center focus:border-[#F4ACB7] focus:outline-none focus:ring-2 focus:ring-[#F4ACB7]"
			/>
			<button
				on:click={resetFilters}
				class="absolute right-3 top-1/2 -translate-y-1/2 text-[#F4ACB7] hover:text-[#e690a0]"
				aria-label="Effacer la recherche"
				class:hidden={!searchTerm}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>
	</div>

	<!-- FILTRES -->
	<div class="mt-6 flex gap-4">
		<button
			on:click={() => (showIngredientList = !showIngredientList)}
			class="rounded-2xl bg-[#F4ACB7] px-6 py-2 font-bold text-white hover:bg-[#e690a0]"
		>
			{showIngredientList ? 'Fermer ingrédients' : 'Ingrédients'}
		</button>
		<button
			on:click={() => (showAllergenList = !showAllergenList)}
			class="rounded-2xl bg-[#F4ACB7] px-6 py-2 font-bold text-white hover:bg-[#e690a0]"
		>
			{showAllergenList ? 'Fermer allergènes' : 'Allergènes'}
		</button>
	</div>

	<!-- LISTE D'INGRÉDIENTS -->
	{#if showIngredientList}
		<div class="mt-6 w-full max-w-6xl rounded-2xl bg-white p-6 shadow-lg">
			<h2 class="text-xl font-bold text-[#9D8189]">Sélectionnez des ingrédients :</h2>
			<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
				{#each Array.from(allIngredients) as ingredient, i}
					<label class="flex items-center gap-2">
						<input
							type="checkbox"
							bind:group={selectedIngredients}
							value={ingredient}
							class="text-[#F4ACB7] accent-[#F4ACB7]"
						/>
						<span>{ingredient}</span>
					</label>
				{/each}
			</div>
		</div>
	{/if}

	<!-- LISTE D'ALLERGENES -->
	{#if showAllergenList}
		<div class="mt-6 w-full max-w-2xl rounded-2xl bg-white p-4 shadow-lg">
			<h2 class="pb-2 text-xl font-bold text-[#9D8189]">Excluez des allergènes :</h2>
			<div class="grid grid-cols-2 gap-4 md:grid-cols-3">
				{#each allAllergens as allergen, i}
					<label class="flex items-center gap-2">
						<input
							type="checkbox"
							bind:group={excludedAllergens}
							value={allergen}
							class=" text-[#F4ACB7] accent-[#F4ACB7]"
						/>
						<span>{allergen}</span>
					</label>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Affichage des résultats uniquement si un filtre ou une recherche est active -->
	{#if searchTerm || selectedIngredients.length > 0 || excludedAllergens.length > 0}
		{#if filteredRecettes.length > 0}
			<div class="mt-8 w-full max-w-3xl">
				<h2 class="text-2xl font-bold text-[#9D8189]">Résultats :</h2>
				<ul class="space-y-6">
					{#each filteredRecettes as recette}
						<li class="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-lg">
							<img
								src={recette.image}
								alt={recette.nom}
								class="h-32 w-32 rounded-lg object-cover"
							/>
							<div>
								<h3 class="title-font text-2xl text-[#F4ACB7]">{recette.nom}</h3>
								<p class="mt-2 text-sm">
									<strong>Ingrédients :</strong>
									<!-- Affiche uniquement les noms des ingrédients -->
									{recette.ingredients.map((ing) => ing.nom).join(', ')}
								</p>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		{:else}
			<p class="mt-6 text-center text-lg text-[#9D8189]">
				Aucun résultat trouvé. Essayez d'ajuster vos filtres.
			</p>
		{/if}
	{/if}

	<!-- CAROUSEL -->
	<div class="relative mt-10 w-full max-w-6xl">
		<h2 class="mb-8 text-center text-3xl font-bold text-[#9D8189]">Nos recettes du jour</h2>
		<div class="flex items-center justify-center gap-6">
			{#if recettes.length > 0}
				<div class="w-60 scale-90 opacity-70">
					<img
						src={getRecipe(-1).image}
						alt={getRecipe(-1).nom}
						class="h-40 w-full rounded-2xl object-cover"
					/>
				</div>
				<div class="w-96 scale-100 rounded-2xl">
					<img
						src={getRecipe(0).image}
						alt={getRecipe(0).nom}
						class="h-48 w-full rounded-2xl object-cover"
					/>
					<h3 class="title-font mt-4 text-center text-2xl font-bold text-[#F4ACB7]">
						{getRecipe(0).nom}
					</h3>
				</div>
				<div class="w-60 scale-90 opacity-70">
					<img
						src={getRecipe(1).image}
						alt={getRecipe(1).nom}
						class="h-40 w-full rounded-2xl object-cover"
					/>
				</div>
			{/if}
		</div>
		<div class="mt-6 flex justify-center gap-2">
			{#each Array.from({ length: recettes.length }) as _, index}
				<button
					on:click={() => (currentIndex = index)}
					class="h-3 w-3 rounded-full {currentIndex === index ? 'bg-[#F4ACB7]' : 'bg-gray-300'}"
					aria-label="Voir la recette numéro {index + 1}"
				></button>
			{/each}
		</div>
	</div>
</main>
