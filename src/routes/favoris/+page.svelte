<script>
	import { onMount } from 'svelte';

	let favoris = [];
	let favorisFiltres = [];
	let selectedRecette = null;
	let searchTerm = '';
	let showSnackbar = false;
	let snackbarMessage = '';

	onMount(() => {
		const savedFavorites = localStorage.getItem('favoris');
		favoris = savedFavorites ? JSON.parse(savedFavorites) : [];
		favorisFiltres = favoris;
	});

	function filtrerFavoris() {
		favorisFiltres = searchTerm
			? favoris.filter((fav) => fav.nom.toLowerCase().includes(searchTerm.trim().toLowerCase()))
			: favoris;
	}

	function retirerFavori(recette) {
		favoris = favoris.filter((fav) => fav.nom !== recette.nom);
		localStorage.setItem('favoris', JSON.stringify(favoris));
		filtrerFavoris();
		closePopup();
		showSnackbar = true;
		snackbarMessage = `${recette.nom} retiré des favoris`;
		setTimeout(() => {
			showSnackbar = false;
		}, 4000);
	}

	function supprimerTousFavoris() {
		favoris = [];
		localStorage.setItem('favoris', JSON.stringify(favoris));
		filtrerFavoris();
		closePopup();
	}

	function openPopup(recette) {
		selectedRecette = recette;
		document.body.style.overflow = 'hidden'; // Bloquer le défilement
	}

	function closePopup() {
		selectedRecette = null;
		document.body.style.overflow = ''; // Réactiver le défilement
	}

	function handleEscape(event) {
		if (event.key === 'Escape' && selectedRecette) {
			closePopup();
		}
	}

	function resetSearch() {
		searchTerm = '';
		filtrerFavoris();
	}
</script>

<svelte:window on:keydown={handleEscape} />

<main class="relative flex min-h-screen flex-col items-center bg-[#FFF6F6] p-8 text-[#9D8189]">
	<h1 class="text-center text-4xl text-[#F4ACB7]">Vos Favoris</h1>
	<p class="mt-2 text-center italic text-[#9D8189]">Vous pouvez retrouver vos favoris ici.</p>

	<!-- Bouton supprimer tous les favoris -->
	<button
		class="mt-4 rounded-2xl bg-[#F4ACB7] px-6 py-2 text-white shadow-lg hover:bg-[#D5899C] focus:outline-none focus:ring-2 focus:ring-[#F4ACB7]"
		on:click={supprimerTousFavoris}
	>
		Supprimer tous les favoris
	</button>

	<!-- Barre de recherche -->
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

	<!-- Liste des favoris -->
	{#if favorisFiltres.length > 0}
		<div class="mt-12 w-full max-w-6xl">
			<ul class="grid grid-cols-1 justify-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{#each favorisFiltres as recette (recette.nom)}
					<li
						class="relative mx-auto max-w-sm rounded-2xl border p-4 shadow-lg transition-all hover:bg-[#FDE2E4]"
					>
						<button
							class="w-full text-left"
							on:click={() => openPopup(recette)}
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
							<p class="mt-2">Ingrédients : {recette.ingredients.map((i) => i.nom).join(', ')}</p>
						</button>
						<button
							on:click={(e) => {
								e.stopPropagation();
								retirerFavori(recette);
							}}
							class="absolute right-1 top-1 flex items-center justify-center rounded-full bg-[#F4ACB7] bg-opacity-80 p-2 shadow-lg hover:scale-110 hover:bg-[#FDE2E4]"
							aria-label="Retirer des favoris"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								class="h-5 w-5 text-white"
							>
								<path
									fill-rule="evenodd"
									d="M4.22 4.22a.75.75 0 011.06 0L12 10.94l6.72-6.72a.75.75 0 111.06 1.06L13.06 12l6.72 6.72a.75.75 0 11-1.06 1.06L12 13.06l-6.72 6.72a.75.75 0 11-1.06-1.06L10.94 12 4.22 5.28a.75.75 0 010-1.06z"
									clip-rule="evenodd"
								/>
							</svg>
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{:else}
		<!-- Message et gif quand il n'y a pas de favoris -->
		<div class="mt-6 text-center">
			<img src="/images/bubu-dudu-sseeyall.gif" alt="Aucun favori" class="mx-auto mt-2 h-48" />
			<p class="mt-4 text-lg text-[#9D8189]">Vous n'avez encore aucun favori.</p>
			<a
				href="/recipes"
				class="mt-4 inline-block rounded-2xl bg-[#F4ACB7] px-6 py-2 text-white shadow-lg hover:bg-[#D5899C]"
			>
				Découvrir des recettes
			</a>
		</div>
	{/if}

	<!-- Popup pour les détails de la recette -->
	{#if selectedRecette}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black bg-opacity-70 backdrop-blur-[10px]"
			role="dialog"
			aria-modal="true"
			aria-labelledby="popup-title"
			aria-describedby="popup-description"
		>
			<button
				class="absolute inset-0 bg-transparent"
				on:click={closePopup}
				aria-hidden="true"
				tabindex="-1"
				type="button"
			></button>

			<div
				class="popup-container relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-8 pt-12 shadow-lg"
				role="document"
				aria-labelledby="popup-title"
				aria-describedby="popup-description"
			>
				<!-- Bouton fermer -->
				<button
					on:click={closePopup}
					class="absolute right-0 top-0 z-50 text-5xl font-bold text-[#9D8189] hover:text-red-600"
					aria-label="Fermer la popup"
					type="button"
					style="top: -0.5rem;"
				>
					&times;
				</button>

				<!-- Contenu de la popup -->
				<img
					src={selectedRecette.image}
					alt={selectedRecette.nom}
					class="mb-4 h-64 w-full rounded-lg object-cover"
				/>
				<h2 id="popup-title" class="text-3xl font-bold text-[#F4ACB7]">{selectedRecette.nom}</h2>

				<!-- Ingrédients -->
				<h3 class="mt-4 text-2xl font-semibold text-[#F4ACB7]">Ingrédients :</h3>
				<ul class="mt-2 list-inside list-disc space-y-2 text-[#9D8189]">
					{#each selectedRecette.ingredients as ingredient}
						<li>
							<strong>{ingredient.nom}</strong> - {ingredient.dosage}
						</li>
					{/each}
				</ul>

				<!-- Étapes -->
				<h3 class="mt-6 text-2xl font-semibold text-[#F4ACB7]">Étapes de préparation :</h3>
				<ul class="mt-2 list-inside list-disc space-y-2 text-[#9D8189]">
					{#each selectedRecette.etapes as etape}
						<li>{etape}</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}

	<!-- Snackbar -->
	{#if showSnackbar}
		<div class="snackbar snackbar-visible">
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
