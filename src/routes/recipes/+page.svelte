<script>
	import { onMount } from 'svelte';
	import { recettes } from '../../data/recetteStore';
	import { page } from '$app/stores';

	let searchTerm = '';
	let filteredRecettes = [];

	// Observer les paramètres de l'URL (search)
	$: searchTerm = page.url.searchParams.get('search') || '';

	// Filtrage automatique à chaque changement d'URL
	$: {
		recettes.subscribe((allRecettes) => {
			filteredRecettes = allRecettes.filter(
				(recette) =>
					recette.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
					recette.ingredients.some((ingredient) =>
						ingredient.toLowerCase().includes(searchTerm.toLowerCase())
					)
			);
		});
	}
</script>

<main class="min-h-screen bg-[#FFF6F6] p-8 text-[#9D8189]">
	<h1 class="text-center text-4xl font-bold text-[#F4ACB7]">Recettes Disponibles</h1>
	<p class="mt-2 text-center text-lg">
		{#if searchTerm}
			Résultats pour : "<strong>{searchTerm}</strong>"
		{:else}
			Toutes les recettes
		{/if}
	</p>

	<!-- AFFICHAGE EN GRILLE -->
	<div class="mt-12 flex justify-center">
		<ul class="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each filteredRecettes as recette (recette.nom)}
				<li class="rounded-lg border p-4 shadow-lg transition-all hover:bg-[#FDE2E4]">
					<img src={recette.image} alt={recette.nom} class="h-48 w-full rounded-md object-cover" />
					<h2 class="mt-4 text-2xl font-semibold">{recette.nom}</h2>
					<p class="mt-2 text-sm">Ingrédients : {recette.ingredients.join(', ')}</p>
				</li>
			{/each}
			{#if filteredRecettes.length === 0}
				<p class="mt-6 text-center">Aucune recette trouvée...</p>
			{/if}
		</ul>
	</div>
</main>
