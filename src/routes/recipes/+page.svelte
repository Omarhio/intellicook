<script>
	import { onMount } from 'svelte';

	let recettes = [];
	let favoris = [];
	let ingredientMap = {}; // Pour la correspondance ID → Nom
	let selectedRecette = null; // Recette actuellement sélectionnée pour la popup

	// Charger les recettes et la correspondance des ingrédients
	async function chargerRecettes() {
		try {
			const response = await fetch('/recette.json');
			if (!response.ok) throw new Error('Erreur lors du chargement des recettes');
			const data = await response.json();

			// Construire la correspondance ID → Nom
			data.ingredients.forEach((ingredient) => {
				ingredientMap[ingredient.id] = ingredient.nom;
			});

			// Remplacer les IDs par les noms des ingrédients dans les recettes
			recettes = data.recettes.map((recette) => ({
				...recette,
				ingredients: recette.ingredients.map(
					(id) => ingredientMap[id] || `Ingrédient inconnu (ID: ${id})`
				)
			}));
		} catch (error) {
			console.error('Erreur de chargement des recettes :', error);
		}
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

	// Ouvrir la popup pour une recette
	function openPopup(recette) {
		selectedRecette = recette;

		// Bloquer le scrolling global
		document.body.style.overflow = 'hidden';
	}

	// Fermer la popup
	function closePopup() {
		selectedRecette = null;

		// Réactiver le scrolling global
		document.body.style.overflow = '';
	}

	// Charger les favoris existants
	onMount(() => {
		const savedFavorites = localStorage.getItem('favoris');
		favoris = savedFavorites ? JSON.parse(savedFavorites) : [];
		chargerRecettes();
	});

	// Gestion de la fermeture avec la touche Escape
	function handleEscape(event) {
		if (event.key === 'Escape' && selectedRecette) {
			closePopup();
		}
	}
</script>

<!-- Gestion de la touche Escape au niveau global -->
<svelte:window on:keydown={handleEscape} />

<main class="relative min-h-screen bg-[#FFF6F6] p-8 text-[#9D8189]">
	<h1 class="text-center text-4xl text-[#F4ACB7]">Recettes Disponibles</h1>

	<div class="mt-12 flex justify-center">
		<ul class="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each recettes as recette (recette.nom)}
				<li class="relative rounded-lg border p-4 shadow-lg transition-all hover:bg-[#FDE2E4]">
					<!-- Bouton pour ouvrir la popup -->
					<button
						class="w-full text-left"
						on:click={() => openPopup(recette)}
						type="button"
						aria-label="Voir les détails de la recette"
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

					<!-- Icône cœur -->
					<button
						on:click={(e) => {
							e.stopPropagation(); // Empêche le clic de fermer la popup
							toggleFavori(recette);
						}}
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

	<!-- POPUP MODALE -->
	{#if selectedRecette}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black bg-opacity-70 backdrop-blur-[10px]"
			role="dialog"
			aria-modal="true"
			aria-labelledby="popup-title"
			aria-describedby="popup-description"
		>
			<!-- Conteneur principal de la popup -->
			<div
				class="popup-container relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-8 pt-12 shadow-lg"
				role="document"
				aria-labelledby="popup-title"
				aria-describedby="popup-description"
			>
				<!-- Bouton de fermeture -->
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
				<p id="popup-description" class="mt-4 text-lg">
					<strong>Ingrédients :</strong>
					{selectedRecette.ingredients.join(', ')}
				</p>
				<h3 class="mt-6 text-2xl font-semibold text-[#F4ACB7]">Étapes de préparation :</h3>
				<ul class="mt-2 list-inside list-disc space-y-2 text-[#9D8189]">
					{#each selectedRecette.etapes as etape}
						<li>{etape}</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}
</main>
