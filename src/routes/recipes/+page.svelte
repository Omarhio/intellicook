<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let recettes = [];
	let searchTerm = '';
	let filteredRecettes = [];

	// Charger les recettes
	async function chargerRecettes() {
		const res = await fetch('/recette.json');
		const data = await res.json();
		recettes = data.recettes;
		filteredRecettes = recettes;
	}

	// Observer l'URL pour détecter les termes de recherche
	$: if (typeof window !== 'undefined') {
		const params = new URLSearchParams(window.location.search);
		searchTerm = params.get("search") || '';
	}

	// Filtrer les recettes
	function rechercher() {
		filteredRecettes = recettes.filter((recette) =>
			recette.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
			recette.ingredients.some((ingredient) =>
				ingredient.toLowerCase().includes(searchTerm.toLowerCase())
			)
		);
	}

	// Appliquer le filtre lors du chargement ou de la recherche
	$: {
		if (recettes.length) {
			rechercher();
		}
	}

	// Charger les recettes dès que la page est montée
	onMount(chargerRecettes);
</script>

<main class="min-h-screen bg-[#FFF6F6] text-[#9D8189] p-8">
	<h1 class="text-4xl text-center text-[#F4ACB7]">Recettes Disponibles</h1>
	<p class="text-center text-lg mt-2">
		{#if searchTerm}
			Résultats pour : "<strong>{searchTerm}</strong>"
		{:else}
			Toutes les recettes
		{/if}
	</p>

	<!-- AFFICHAGE EN GRILLE -->
	<div class="mt-12 flex justify-center">
		<ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
			{#each filteredRecettes as recette (recette.nom)}
				<li class="border p-4 rounded-lg shadow-lg hover:bg-[#FDE2E4] transition-all">
					<img src={recette.image} alt={recette.nom} class="w-full h-48 object-cover rounded-md" />
					<h2 class="text-2xl font-semibold mt-4">{recette.nom}</h2>
					<p class="mt-2">Ingrédients : {recette.ingredients.join(", ")}</p>
				</li>
			{/each}
			{#if filteredRecettes.length === 0}
				<p class="text-center mt-6">Aucune recette trouvée...</p>
			{/if}
		</ul>
	</div>
</main>
