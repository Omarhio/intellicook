<script>
	import { onMount } from 'svelte';

	let recettes = [];
	let favoris = [];
	let ingredientMap = {};

	// Charger les recettes
	async function chargerRecettes() {
		const res = await fetch('/recette.json');
		const data = await res.json();

		// Créer une correspondance ID → Nom pour les ingrédients
		data.ingredients.forEach((ingredient) => {
			ingredientMap[ingredient.id] = ingredient.nom;
		});

		// Remplacer les IDs des ingrédients par leur nom dans les recettes
		recettes = data.recettes.map((recette) => ({
			...recette,
			ingredients: recette.ingredients.map((id) => ingredientMap[id] || id)
		}));
	}

	// Ajouter ou retirer des favoris
	function toggleFavori(recette) {
		const index = favoris.findIndex((fav) => fav.nom === recette.nom);

		if (index === -1) {
			favoris = [...favoris, recette];
		} else {
			favoris = favoris.filter((fav) => fav.nom !== recette.nom);
		}

		localStorage.setItem('favoris', JSON.stringify(favoris));
	}

	// Charger les favoris existants
	onMount(() => {
		const savedFavorites = localStorage.getItem('favoris');
		favoris = savedFavorites ? JSON.parse(savedFavorites) : [];
		chargerRecettes();
	});
</script>

<main class="min-h-screen bg-[#FFF6F6] p-8 text-[#9D8189]">
	<h1 class="text-center text-4xl text-[#F4ACB7]">Recettes Disponibles</h1>

	<div class="mt-12 flex justify-center">
		<ul class="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each recettes as recette (recette.nom)}
				<li class="relative rounded-lg border p-4 shadow-lg transition-all hover:bg-[#FDE2E4]">
					<img
						src={recette.image}
						alt={recette.nom}
						class="h-48 w-full rounded-md object-cover"
						loading="lazy"
					/>
					<h2 class="mt-4 text-2xl font-semibold">{recette.nom}</h2>
					<p class="mt-2">Ingrédients : {recette.ingredients.join(', ')}</p>

					<button
						on:click={() => toggleFavori(recette)}
						aria-label="Ajouter ou retirer des favoris"
						class="absolute bottom-1 right-1"
					>
						<svg
							class="h-8 w-8 transform {favoris.some((fav) => fav.nom === recette.nom)
								? 'animate-pulse fill-red-500 transition-transform hover:scale-110'
								: 'fill-none stroke-current stroke-2 text-[#F4ACB7] transition-transform hover:scale-110'}"
							viewBox="0 0 24 24"
						>
							<path
								d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5c0-3.22 2.46-5.5 5.5-5.5 1.74 0 3.41.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09 3.04 0 5.5 2.28 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
							></path>
						</svg>
					</button>
				</li>
			{/each}
		</ul>
	</div>
</main>
