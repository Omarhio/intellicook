<script>
	import '../app.css';
	// État pour ouvrir/fermer le menu
	let isMenuOpen = false;

	// Fonction pour basculer l'état
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<header class="relative z-50 bg-[#FFCAD4] p-4 shadow-md">
	<nav class="mx-auto flex max-w-6xl items-center justify-between">
		<!-- Menu Burger Icon (toujours à gauche, animé) -->
		<button
			class="relative z-50 text-[#F4ACB7] hover:text-[#9D8189]"
			on:click={toggleMenu}
			aria-label="Toggle navigation menu"
		>
			{#if isMenuOpen}
				<!-- Bouton croix -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-8 w-8 rotate-180 transition-transform duration-300"
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
			{:else}
				<!-- Bouton burger -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-8 w-8 rotate-0 transition-transform duration-300"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			{/if}
		</button>

		<!-- Logo au centre -->
		<div class="flex items-center gap-2">
			<img src="/logo.webp" alt="Intellicook Logo" class="h-10 w-auto" />
			<span class="font-title text-3xl text-[white]">Intellicook</span>
		</div>

		<!-- Liens de navigation (visibles sur desktop) -->
		<ul class="hidden gap-4 font-body text-lg md:flex">
			<li>
				<a href="/" class="text-[#9D8189] hover:text-[#F4ACB7]">Accueil</a>
			</li>
			<li>
				<a href="/recipes" class="text-[#9D8189] hover:text-[#F4ACB7]">Recettes</a>
			</li>
			<li>
				<a href="/about" class="text-[#9D8189] hover:text-[#F4ACB7]">À propos</a>
			</li>
		</ul>
	</nav>

	<!-- Menu plein écran -->
	<div
		class="fixed inset-0 z-40 flex transform flex-col items-center justify-center gap-8 bg-[#FFCAD4] text-[#9D8189] transition-transform duration-300 ease-in-out md:hidden"
		style="transform: translateX({isMenuOpen ? '0%' : '-100%'})"
	>
		<!-- Liens de navigation -->
		<ul class="text-center font-body text-2xl">
			<li class="mb-4">
				<a href="/" class="hover:text-[#F4ACB7]" on:click={toggleMenu}>Accueil</a>
			</li>
			<li class="mb-4">
				<a href="/recipes" class="hover:text-[#F4ACB7]" on:click={toggleMenu}>Recettes</a>
			</li>
			<li class="mb-4">
				<a href="/about" class="hover:text-[#F4ACB7]" on:click={toggleMenu}>À propos</a>
			</li>
		</ul>
	</div>
</header>

<slot />

<footer class="bg-[#FFCAD4] py-6 font-body text-[#9D8189]">
	<div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
		<div class="flex items-center gap-2">
			<img src="/logo.webp" alt="Intellicook Logo" class="h-12 w-auto" />
			<p class="max-w-sm text-center text-sm md:text-left">
				<strong class="font-title text-lg text-[#9D8189]">Intellicook</strong> — Découvrez des recettes
				japonaises et kawaii pour illuminer vos repas !
			</p>
		</div>

		<ul class="flex gap-6 text-sm">
			<li><a href="/" class="hover:text-[#F4ACB7]">Accueil</a></li>
			<li><a href="/recipes" class="hover:text-[#F4ACB7]">Recettes</a></li>
			<li><a href="/about" class="hover:text-[#F4ACB7]">À propos</a></li>
			<li><a href="/contact" class="hover:text-[#F4ACB7]">Contact</a></li>
		</ul>

		<p class="text-center text-sm md:text-right">&copy; Intellicook. Tous droits réservés.</p>
	</div>
</footer>
