<script lang="js">
	import '../app.css';
	import Hamburger from 'svelte-hamburgers';
	import { afterNavigate } from '$app/navigation'; // Pour réinitialiser l'état après navigation

	// Déclare et initialise `open`
	let isMenuOpen = false;

	// Empêche le défilement de la page si le menu est ouvert
	$: {
		if (typeof window !== 'undefined') {
			document.body.style.overflow = isMenuOpen ? 'hidden' : '';
		}
	}

	// Réinitialise `isMenuOpen` après la navigation
	afterNavigate(() => {
		isMenuOpen = false;
	});
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/svelte-hamburgers@3/dist/css/base.css"
	/>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/svelte-hamburgers@3/dist/css/types/spin.css"
	/>
</svelte:head>

<header class="relative z-50 bg-[#FFCAD4] p-4 shadow-md">
	<nav class="mx-auto flex max-w-6xl items-center justify-center px-4 md:w-full md:justify-between">
		<div class="flex items-center gap-2">
			<a href="/" class="flex items-center gap-2">
				<img src="/logo.webp" alt="Intellicook Logo" class="h-10 w-auto" />
				<span class="font-title text-3xl text-[#9D8189]">Intellicook</span>
			</a>
		</div>

		<!-- Menu Burger -->
		<div
			role="button"
			tabindex="0"
			aria-label="Toggle menu"
			aria-expanded={isMenuOpen}
			class="absolute left-4 top-2 z-[10000] block cursor-pointer md:hidden"
			on:click={() => (isMenuOpen = !isMenuOpen)}
			on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && (isMenuOpen = !isMenuOpen)}
		>
			<Hamburger
				open={isMenuOpen}
				class="ease-[cubic-bezier(0.25, 0.8, 0.5, 1)] transition-all duration-400"
				--color="#9D8189"
			/>
		</div>

		<!-- Liens de navigation desktop -->
		<ul class="hidden gap-6 font-body text-lg md:flex">
			<li><a href="/" class="text-[#9D8189] hover:text-[#F4ACB7]">Accueil</a></li>
			<li><a href="/recipes" class="text-[#9D8189] hover:text-[#F4ACB7]">Recettes</a></li>
			<li><a href="/favoris" class="text-[#9D8189] hover:text-[#F4ACB7]">Favoris</a></li>
		</ul>
	</nav>

	<!-- Menu Mobile -->
	<div
		class="fixed inset-0 z-[9999] transform bg-[#FFCAD4] text-[#9D8189] transition-transform duration-400 ease-in-out"
		style="transform: translateX({isMenuOpen ? '0%' : '-100%'})"
	>
		<ul
			class="flex h-full flex-col items-center justify-center gap-12 text-center font-body text-2xl"
		>
			<li>
				<a href="/" on:click={() => (isMenuOpen = false)}>Accueil</a>
			</li>
			<li>
				<a href="/recipes" on:click={() => (isMenuOpen = false)}>Recettes</a>
			</li>
			<li>
				<a href="/favoris" on:click={() => (isMenuOpen = false)}>Favoris</a>
			</li>
		</ul>
	</div>
</header>
<slot />
