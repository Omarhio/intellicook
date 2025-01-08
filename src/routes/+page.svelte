<script>
	import { onMount } from 'svelte';

	let searchTerm = '';
	let recettes = [];
	let filteredRecettes = [];

	onMount(async () => {
		try {
			const response = await fetch('/recette.json');
			if (!response.ok) throw new Error('Erreur lors du chargement des recettes');
			const data = await response.json();
			recettes = data.recettes;
		} catch (error) {
			console.error('Erreur de chargement des recettes :', error);
		}
	});

	$: filteredRecettes = searchTerm
		? recettes.filter(
				(recette) =>
					recette.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
					recette.ingredients.some((ingredient) =>
						ingredient.toLowerCase().includes(searchTerm.toLowerCase())
					)
		  )
		: [];
</script>

<main class="min-h-screen bg-[#FFF6F6] text-[#9D8189] flex flex-col items-center p-16">
	<h1 class="title-font text-5xl text-[#F4ACB7]">Bienvenue sur Intellicook !</h1>
	<p class="mt-4 text-lg">Découvrez des recettes japonaises et kawaii 🍣</p>

	<!-- BARRE DE RECHERCHE -->
	<div class="flex items-center mt-8 space-x-4 w-full max-w-2xl">
		<input
			type="text"
			bind:value={searchTerm}
			placeholder="Rechercher par nom ou ingrédient..."
			class="w-full rounded-3xl border-2 border-[#F4ACB7] p-3 text-center focus:ring-2 focus:ring-[#F4ACB7] text-lg"
		/>
		<button
			on:click={() => (searchTerm = '')}
			class="bg-[#F4ACB7] hover:bg-[#e690a0] text-white font-bold py-2 px-6 rounded-lg"
		>
			Reset
		</button>
	</div>

	<!-- LIEN POUR AFFICHER TOUTES LES RECETTES -->
	<a href="/recipes" class="text-[#F4ACB7] underline mt-6">Voir toutes les recettes</a>

	<!-- RÉSULTATS DE LA RECHERCHE -->
	{#if searchTerm && filteredRecettes.length > 0}
		<div class="mt-8 w-full max-w-3xl">
			<h2 class="text-2xl font-bold text-[#9D8189] mb-6">Résultats :</h2>
			<ul class="space-y-6">
				{#each filteredRecettes as recette}
					<li class="bg-white rounded-lg shadow-lg p-6 flex gap-6 items-start">
						<img
							src={recette.image}
							alt={recette.nom}
							class="h-32 w-32 rounded-lg object-cover"
						/>
						<div>
							<h3 class="text-2xl font-semibold text-[#F4ACB7]">{recette.nom}</h3>
							<p class="text-lg text-[#9D8189] mt-2">
								<strong>Ingrédients :</strong> {recette.ingredients.join(', ')}
							</p>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	{:else if searchTerm}
		<div class="mt-8 w-full max-w-3xl">
			<p class="text-center text-lg text-[#9D8189]">Aucun résultat trouvé.</p>
		</div>
	{/if}
</main>
