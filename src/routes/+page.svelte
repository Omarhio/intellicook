<script>
	import { goto } from '$app/navigation';
	let searchTerm = '';

	// Redirection vers /recipes avec la recherche
	function rechercher() {
		if (searchTerm) {
			goto(`/recipes?search=${encodeURIComponent(searchTerm)}`);
		}
	}
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
			class="w-full rounded-3xl border-2 border-[#F4ACB7] p-3 text-center focus:ring-2 focus:ring-[#F4ACB7]"
		/>
		<button
			on:click={rechercher}
			class="bg-[#F4ACB7] hover:bg-[#e690a0] text-white font-bold py-2 px-6 rounded-lg"
		>
			Rechercher
		</button>
	</div>

	<!-- LIEN POUR AFFICHER TOUTES LES RECETTES -->
	<a href="/recipes" class="text-[#F4ACB7] underline mt-6">Voir toutes les recettes</a>
</main>
