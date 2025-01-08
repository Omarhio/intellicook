<script>
	import { onMount } from 'svelte';
	let favoris = [];

	// Récupérer les favoris depuis localStorage
	onMount(() => {
		const savedFavorites = localStorage.getItem('favoris');
		favoris = savedFavorites ? JSON.parse(savedFavorites) : [];
	});

	// Retirer des favoris
	function retirerFavori(recette) {
		favoris = favoris.filter(fav => fav.nom !== recette.nom);
		localStorage.setItem('favoris', JSON.stringify(favoris));
	}
</script>

<main class="min-h-screen bg-[#FFF6F6] text-[#9D8189] p-8">
	<h1 class="text-4xl text-center text-[#F4ACB7]">Vos Favoris ❤️</h1>

	{#if favoris.length > 0}
		<ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
			{#each favoris as recette (recette.nom)}
				<li class="border p-4 rounded-lg shadow-lg hover:bg-[#FDE2E4]">
					<img src={recette.image} alt={recette.nom} class="w-full h-48 object-cover rounded-md" />
					<h2 class="text-2xl font-semibold mt-4">{recette.nom}</h2>
					<p class="mt-2">Ingrédients : {recette.ingredients.join(", ")}</p>
					<button 
						on:click={() => retirerFavori(recette)} 
						class="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
					>
						Retirer des Favoris
					</button>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="text-center mt-6">Vous n'avez ajouté aucune recette en favoris pour l'instant.</p>
	{/if}
</main>
