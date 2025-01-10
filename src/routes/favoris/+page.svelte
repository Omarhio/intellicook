<script>
	import { onMount, onDestroy } from 'svelte';

	let favoris = [];
	let showSnackbar = false;
	let snackbarMessage = '';
	let selectedRecette = null;
	let searchTerm = '';
	let favorisFiltres = [];

	onMount(() => {
		const savedFavorites = localStorage.getItem('favoris');
		favoris = savedFavorites ? JSON.parse(savedFavorites) : [];
		favorisFiltres = favoris;

		document.addEventListener('click', handleOutsideClick);
	});

	onDestroy(() => {
		document.removeEventListener('click', handleOutsideClick);
	});

	function retirerFavori(recette) {
		favoris = favoris.filter((fav) => fav.nom !== recette.nom);
		localStorage.setItem('favoris', JSON.stringify(favoris));
		filtrerFavoris();
		if (selectedRecette === recette) {
			closeAside();
		}
		snackbarMessage = `${recette.nom} retiré des favoris`;
		showSnackbar = true;
		setTimeout(() => {
			showSnackbar = false;
		}, 4000);
	}

	function supprimerTousFavoris() {
		favoris = [];
		localStorage.setItem('favoris', JSON.stringify(favoris));
		filtrerFavoris();
		closeAside();
	}

	function toggleAside(recette) {
		if (selectedRecette === recette) {
			closeAside();
		} else {
			selectedRecette = recette;
			if (window.innerWidth < 768) {
				document.body.style.overflow = 'hidden';
			}
		}
	}

	function closeAside() {
		selectedRecette = null;
		if (window.innerWidth < 768) {
			document.body.style.overflow = '';
		}
	}

	function filtrerFavoris() {
		favorisFiltres = searchTerm
			? favoris.filter((fav) => fav.nom.toLowerCase().includes(searchTerm.trim().toLowerCase()))
			: favoris;
	}

	function handleOutsideClick(event) {
		const aside = document.querySelector('aside');
		const card = event.target.closest('li');
		if (aside && !aside.contains(event.target) && !card) {
			closeAside();
		}
	}

	function resetSearch() {
		searchTerm = '';
		filtrerFavoris();
	}
</script>

<main class="relative flex min-h-screen flex-col items-center bg-[#FFF6F6] p-8 text-[#9D8189]">
	<h1 class="text-center text-4xl text-[#F4ACB7]">Vos Favoris ❤️</h1>
	<p class="mt-2 text-center italic text-[#9D8189]">
		Vous pouvez cliquer sur &nbsp
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 64 64"
			class="inline-block h-8 w-8 align-middle"
		>
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
		&nbsp pour retirer une recette de vos favoris.
	</p>

	<button
		class="mt-4 rounded-2xl bg-[#F4ACB7] px-6 py-2 text-white shadow-lg hover:bg-[#D5899C] focus:outline-none focus:ring-2 focus:ring-[#F4ACB7]"
		on:click={supprimerTousFavoris}
	>
		Supprimer tous les favoris
	</button>

	<div class="mt-6 flex w-full max-w-[600px] flex-col gap-4 sm:flex-row sm:items-center sm:gap-0">
		<div class="relative w-full">
			<input
				type="text"
				bind:value={searchTerm}
				placeholder="Rechercher une recette..."
				class="w-full rounded-3xl border-2 border-[#F4ACB7] px-6 py-3 pr-10 text-lg placeholder:text-center focus:border-[#F4ACB7] focus:outline-none focus:ring-2 focus:ring-[#F4ACB7]"
				on:input={filtrerFavoris}
			/>
			<button
				on:click={resetSearch}
				class="absolute right-3 top-1/2 -translate-y-1/2 transform text-[#F4ACB7] hover:text-[#D5899C]"
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

	{#if favorisFiltres.length > 0}
		<div class="mt-12 w-full max-w-6xl">
			<ul class="grid grid-cols-1 justify-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{#each favorisFiltres as recette (recette.nom)}
					<li
						class="relative mx-auto max-w-sm rounded-2xl border p-4 shadow-lg transition-all hover:bg-[#FDE2E4]"
					>
						<button
							class="w-full text-left"
							on:click={() => toggleAside(recette)}
							on:keydown={(event) => {
								if (event.key === 'Enter' || event.key === ' ') toggleAside(recette);
							}}
							type="button"
							aria-label={`Voir les détails de la recette ${recette.nom}`}
						>
							<img
								src={recette.image}
								alt={recette.nom}
								class="h-48 w-full rounded-md object-cover"
								loading="lazy"
							/>
							<h2 class="mt-4 text-2xl font-semibold">{recette.nom}</h2>
							<p class="mt-2">Ingrédients : {recette.ingredients.join(', ')}</p>
						</button>

						<button
							on:click={(e) => {
								e.stopPropagation();
								retirerFavori(recette);
							}}
							class="absolute right-3 top-3 rounded-2xl bg-none p-2 transition-transform hover:scale-110"
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
		<div class="mt-6 text-center">
			<p class="text-lg">Aucune recette trouvée dans vos favoris.</p>
			<a
				href="/recipes"
				class="mt-4 inline-block rounded-2xl bg-[#F4ACB7] px-6 py-2 text-white shadow-lg hover:bg-[#D5899C] focus:outline-none focus:ring-2 focus:ring-[#F4ACB7]"
			>
				Découvrir des recettes
			</a>
		</div>
	{/if}

	{#if selectedRecette}
		<aside
			class="fixed right-0 top-0 z-50 h-screen w-full overflow-y-auto bg-white p-8 pt-12 shadow-lg transition-transform duration-300 sm:max-w-[30%] lg:max-w-[25%]"
			style="transform: translateX(0%);"
			role="dialog"
			aria-labelledby="aside-title"
			aria-describedby="aside-description"
		>
			<button
				on:click={closeAside}
				class="absolute right-0 top-0 z-50 text-5xl font-bold text-[#9D8189] hover:text-red-600"
				aria-label="Fermer l'aside"
				style="top: -0.5rem;"
			>
				&times;
			</button>

			<img
				src={selectedRecette.image}
				alt={selectedRecette.nom}
				class="mb-4 h-64 w-full rounded-lg object-cover"
			/>
			<h2 id="aside-title" class="text-3xl font-bold text-[#F4ACB7]">{selectedRecette.nom}</h2>
			<p id="aside-description" class="mt-4 text-lg">
				<strong>Ingrédients :</strong>
				{selectedRecette.ingredients.join(', ')}
			</p>
			<h3 class="mt-6 text-2xl font-semibold text-[#F4ACB7]">Étapes de préparation :</h3>
			<ul class="mt-2 list-inside list-disc space-y-2 text-[#9D8189]">
				{#each selectedRecette.etapes as etape}
					<li>{etape}</li>
				{/each}
			</ul>
		</aside>
	{/if}

	{#if showSnackbar}
		<div class="snackbar {showSnackbar ? 'snackbar-visible' : ''}">
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
			{snackbarMessage}
		</div>
	{/if}
</main>
