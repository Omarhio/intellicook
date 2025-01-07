<script>
	import { goto } from '$app/navigation';
	let searchTerm = '';

	// Redirection vers /recipes avec le terme dans l'URL
	function rechercher() {
		if (searchTerm) {
			goto(`/recipes?search=${encodeURIComponent(searchTerm)}`);
		}
	}
</script>

<main class="flex min-h-screen flex-col items-center bg-[#FFF6F6] p-16 text-[#9D8189]">
	<h1 class="text-5xl font-bold text-[#F4ACB7]">Bienvenue sur Intellicook !</h1>
	<p class="mt-4 text-lg">Découvrez des recettes japonaises et kawaii 🍣</p>

	<!-- BARRE DE RECHERCHE -->
	<div class="mt-8 flex w-full max-w-2xl items-center space-x-4">
		<input
			type="text"
			bind:value={searchTerm}
			placeholder="Rechercher par nom ou ingrédient..."
			class="w-full rounded-3xl border-2 border-[#F4ACB7] p-3 text-center focus:ring-2 focus:ring-[#F4ACB7]"
		/>
		<button
			on:click={rechercher}
			class="rounded-lg bg-[#F4ACB7] px-6 py-2 font-bold text-white hover:bg-[#e690a0]"
		>
			Rechercher
		</button>
	</div>

	<!-- LIEN POUR AFFICHER TOUTES LES RECETTES -->
	<a href="/recipes" class="mt-6 text-[#F4ACB7] underline">Voir toutes les recettes</a>
</main>
