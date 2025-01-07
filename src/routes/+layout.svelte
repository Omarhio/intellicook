<script lang="js">
	import '../app.css';
	import Hamburger from 'svelte-hamburgers';

	let isMenuOpen = false;

	$: {
		if (typeof window !== 'undefined') {
			document.body.style.overflow = isMenuOpen ? 'hidden' : '';
		}
	}
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
			<img src="/logo.webp" alt="Intellicook Logo" class="h-10 w-auto" />
			<span class="font-title text-3xl text-[#9D8189]">Intellicook</span>
		</div>

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
				isActive={isMenuOpen}
				class="ease-[cubic-bezier(0.25, 0.8, 0.5, 1)] duration-400 transition-all"
				--color="#9D8189"
			/>
		</div>

		<ul class="hidden gap-6 font-body text-lg md:flex">
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

	<div
		class="duration-400 fixed inset-0 z-[9999] transform bg-[#FFCAD4] text-[#9D8189] transition-transform ease-in-out"
		style="transform: translateX({isMenuOpen ? '0%' : '-100%'})"
	>
		<ul
			class="flex h-full flex-col items-center justify-center gap-12 text-center font-body text-2xl"
		>
			<li class="mb-10">
				<a href="/" class="hover:text-[#F4ACB7]" on:click={() => (isMenuOpen = false)}>Accueil</a>
			</li>
			<li class="mb-10">
				<a href="/recipes" class="hover:text-[#F4ACB7]" on:click={() => (isMenuOpen = false)}
					>Recettes</a
				>
			</li>
			<li class="mb-10">
				<a href="/about" class="hover:text-[#F4ACB7]" on:click={() => (isMenuOpen = false)}
					>À propos</a
				>
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
