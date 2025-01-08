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

<main class="flex min-h-screen flex-col items-center bg-[#FFF6F6] p-6 text-[#9D8189]">
	<!-- TITRE ET SOUS-TITRE -->
	<div class="text-center">
		<h1 class="title-font text-4xl text-[#F4ACB7] md:text-5xl">Bienvenue sur Intellicook !</h1>
		<p class="mt-4 text-lg">Découvrez des recettes japonaises et kawaii 🍣</p>
	</div>

	<!-- BARRE DE RECHERCHE -->
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
			on:click={() => (searchTerm = '')}
			class="rounded-lg bg-[#F4ACB7] px-6 py-2 font-bold text-white hover:bg-[#e690a0]"
		>
			Reset
		</button>
	</div>

	<!-- LIEN POUR AFFICHER TOUTES LES RECETTES -->
	<a href="/recipes" class="mt-6 text-[#F4ACB7] underline">Voir toutes les recettes</a>

	<!-- RÉSULTATS DE LA RECHERCHE -->
	{#if searchTerm && filteredRecettes.length > 0}
		<div class="mt-8 w-full max-w-3xl">
			<h2 class="mb-6 text-2xl font-bold text-[#9D8189]">Résultats :</h2>
			<ul class="space-y-6">
				{#each filteredRecettes as recette}
					<li
						class="flex flex-col items-center gap-4 rounded-lg bg-white p-4 shadow-lg md:flex-row"
					>
						<img src={recette.image} alt={recette.nom} class="h-32 w-32 rounded-lg object-cover" />
						<div class="text-center md:text-left">
							<h3 class="text-xl font-semibold text-[#F4ACB7] md:text-2xl">{recette.nom}</h3>
							<p class="mt-2 text-sm text-[#9D8189] md:text-base">
								<strong>Ingrédients :</strong>
								{recette.ingredients.join(', ')}
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
