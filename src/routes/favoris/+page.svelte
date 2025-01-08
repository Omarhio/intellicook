<script>
	import { onMount } from 'svelte';
	let favoris = [];
	let showHint = true;

	onMount(() => {
		const savedFavorites = localStorage.getItem('favoris');
		favoris = savedFavorites ? JSON.parse(savedFavorites) : [];

		// Cacher le message après 3 secondes
		setTimeout(() => {
			showHint = false;
		}, 3000);
	});

	function retirerFavori(recette) {
		favoris = favoris.filter((fav) => fav.nom !== recette.nom);
		localStorage.setItem('favoris', JSON.stringify(favoris));
	}
</script>

<main class="relative flex min-h-screen flex-col items-center bg-[#FFF6F6] p-8 text-[#9D8189]">
	<h1 class="text-center text-4xl text-[#F4ACB7]">Vos Favoris ❤️</h1>

	{#if showHint}
		<div
			class="animate-fade absolute top-16 flex items-center gap-4 rounded-lg bg-[#9D8189] px-6 py-3 text-white shadow-md"
		>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="h-8 w-8">
				<path
					fill="#fffaf0"
					stroke="#5f363a"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="3"
					d="M22.09,48.28a6.83,6.83,0,0,0-4.95-3.91A20.22,20.22,0,0,1,20.93,4.3a20.53,20.53,0,0,1,9.7,2.56,7.26,7.26,0,0,0,7.15-.16A16.8,16.8,0,0,1,60.36,30.54a6.89,6.89,0,0,0-1,5.45,20.52,20.52,0,0,1,.48,4.34A19.48,19.48,0,0,1,40.37,59.7C29,59.7,24.08,52.71,22.09,48.28Z"
				></path>
				<circle
					cx="37.21"
					cy="30"
					r="10.63"
					fill="#ffdd7d"
					stroke="#5f363a"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="3"
				></circle>
			</svg>
			Cliquez sur l'œuf pour retirer une recette de vos favoris !
		</div>
	{/if}

	{#if favoris.length > 0}
		<div class="mt-12 w-full max-w-6xl">
			<ul class="grid grid-cols-1 justify-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{#each favoris as recette (recette.nom)}
					<li
						class="relative mx-auto max-w-sm rounded-lg border p-4 shadow-lg transition-all hover:bg-[#FDE2E4]"
					>
						<img
							src={recette.image}
							alt={recette.nom}
							class="h-48 w-full rounded-md object-cover"
							loading="lazy"
						/>
						<h2 class="mt-4 text-2xl font-semibold">{recette.nom}</h2>
						<p class="mt-2">Ingrédients : {recette.ingredients.join(', ')}</p>

						<!-- Bouton de suppression (oeuf kawaii) -->
						<button
							on:click={() => retirerFavori(recette)}
							class="absolute right-3 top-3 rounded-full bg-none p-2 transition-transform hover:scale-110"
							aria-label="Retirer des favoris"
						>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="h-8 w-8">
								<path
									fill="#fffaf0"
									stroke="#5f363a"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="3"
									d="M22.09,48.28a6.83,6.83,0,0,0-4.95-3.91A20.22,20.22,0,0,1,20.93,4.3a20.53,20.53,0,0,1,9.7,2.56,7.26,7.26,0,0,0,7.15-.16A16.8,16.8,0,0,1,60.36,30.54a6.89,6.89,0,0,0-1,5.45,20.52,20.52,0,0,1,.48,4.34A19.48,19.48,0,0,1,40.37,59.7C29,59.7,24.08,52.71,22.09,48.28Z"
								></path>
								<circle
									cx="37.21"
									cy="30"
									r="10.63"
									fill="#ffdd7d"
									stroke="#5f363a"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="3"
								></circle>
							</svg>
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{:else}
		<p class="mt-6 text-center">Vous n'avez ajouté aucune recette en favoris pour l'instant.</p>
	{/if}
</main>
