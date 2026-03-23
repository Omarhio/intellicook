<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { Recipe } from '$lib/types/Recipe';
	import { recipeStore, favorites } from '$lib/stores/recipes';
	import { SearchInput, RecipeCard, RecipeModal } from '$lib/components';

	let selectedRecipe = $state<Recipe | null>(null);
	let searchTerm = $state('');
	let showSnackbar = $state(false);
	let snackbarMessage = $state('');
	let error = $state<string | null>(null);

	onMount(async () => {
		try {
			await recipeStore.loadRecipes();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Erreur lors du chargement des recettes. Veuillez réessayer.';
		}
	});

	let recipes = $derived($favorites);

	let filteredFavorites = $derived(
		recipes.filter((recipe: Recipe) =>
			recipe.nom.toLowerCase().includes(searchTerm.toLowerCase())
		)
	);

	function toggleFavorite(recipeId: number) {
		const recipe = recipes.find((r: Recipe) => r.id === recipeId);
		recipeStore.toggleFavorite(recipeId);
		if (recipe) {
			showSnackbarMessage(`${recipe.nom} retiré des favoris`);
		}
	}

	function deleteAllFavorites() {
		recipes.forEach((recipe: Recipe) => {
			recipeStore.toggleFavorite(recipe.id);
		});
		showSnackbarMessage('Tous les favoris ont été supprimés');
	}

	function showSnackbarMessage(message: string) {
		snackbarMessage = message;
		showSnackbar = true;
		setTimeout(() => {
			showSnackbar = false;
		}, 4000);
	}
</script>

<div class="min-h-screen bg-[#FFF6F6] pb-16">
	<div class="container mx-auto px-4 py-8">
		<h1 class="mb-8 text-center text-4xl font-bold text-[#F4ACB7]">Mes Recettes Favorites</h1>
		<p class="mt-2 text-center italic text-[#9D8189]">Retrouvez toutes vos recettes préférées ici.</p>

		{#if error}
			<div class="mb-8 rounded-lg bg-red-100 p-4 text-red-700" transition:fade>
				<p>{error}</p>
				<button
					class="mt-2 text-sm underline"
					onclick={() => {
						error = null;
						recipeStore.loadRecipes().catch((e) => {
							error = e instanceof Error ? e.message : 'Erreur lors du rechargement.';
						});
					}}
				>
					Réessayer
				</button>
			</div>
		{/if}

		{#if recipes.length > 0}
			<div class="mt-4 flex justify-center">
				<button
					class="rounded-2xl bg-[#F4ACB7] px-6 py-2 text-white shadow-lg transition-all hover:bg-[#D5899C] focus:outline-none focus:ring-2 focus:ring-[#F4ACB7]"
					onclick={deleteAllFavorites}
				>
					Supprimer tous les favoris
				</button>
			</div>
		{/if}

		<div class="mb-8 mt-6">
			<SearchInput
				bind:value={searchTerm}
				placeholder="Rechercher dans mes favoris..."
				onclear={() => (searchTerm = '')}
			/>
		</div>

		{#if filteredFavorites.length > 0}
			<ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each filteredFavorites as recipe (recipe.id)}
					<RecipeCard
						{recipe}
						isFavorite={true}
						onfavorite={() => toggleFavorite(recipe.id)}
						onclick={() => (selectedRecipe = recipe)}
					/>
				{/each}
			</ul>
		{:else}
			<div class="mt-6 text-center">
				<img src="/images/bubu-dudu-sseeyall.gif" alt="Aucun favori" class="mx-auto mt-2 h-48" />
				<p class="mt-4 text-lg text-[#9D8189]">
					{searchTerm
						? 'Aucune recette favorite ne correspond à votre recherche.'
						: "Vous n'avez pas encore de recettes favorites."}
				</p>
				<a
					href="/recipes"
					class="mt-4 inline-block rounded-2xl bg-[#F4ACB7] px-6 py-2 text-white shadow-lg hover:bg-[#D5899C]"
				>
					Découvrir des recettes
				</a>
			</div>
		{/if}
	</div>
</div>

{#if selectedRecipe}
	<RecipeModal recipe={selectedRecipe} onclose={() => (selectedRecipe = null)} />
{/if}

{#if showSnackbar}
	<div
		class="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform rounded-lg bg-[#F4ACB7] px-6 py-3 text-white shadow-lg"
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 200 }}
	>
		<div class="flex items-center gap-2">
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
	</div>
{/if}
