<script lang="js">
	import '../app.css';
	import Hamburger from 'svelte-hamburgers';
	import { afterNavigate } from '$app/navigation';

	let isMenuOpen = false;
	let currentPath = '';

	$: {
		if (typeof window !== 'undefined') {
			document.body.style.overflow = isMenuOpen ? 'hidden' : '';
			currentPath = window.location.pathname;
		}
	}

	afterNavigate(() => {
		isMenuOpen = false;
		currentPath = window.location.pathname;
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
				<img src="/logo.webp" alt="Intellicook Logo" class="menu-link-kawaii h-10 w-auto" />
				<span class="menu-link-kawaii font-title text-3xl text-[#9D8189]">Intellicook</span>
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
		<ul class="nav-links-desktop hidden gap-6 font-body text-lg md:flex">
			<li class="nav-item-desktop">
				<a
					href="/"
					class={`menu-link-kawaii-desktop ${
						currentPath === '/' ? 'font-bold underline underline-offset-1' : ''
					}`}
				>
					<span>Accueil</span>
					<img src="/images/8.png" alt="Favoris" class="icon-kawaii-desktop" />
				</a>
			</li>
			<li class="nav-item-desktop">
				<a
					href="/recipes"
					class={`menu-link-kawaii-desktop ${
						currentPath === '/recipes' ? 'font-bold underline underline-offset-1' : ''
					}`}
				>
					<span>Recettes</span>
					<img src="/images/2.png" alt="Favoris" class="icon-kawaii-desktop" />
				</a>
			</li>
			<li class="nav-item-desktop">
				<a
					href="/favoris"
					class={`menu-link-kawaii-desktop ${
						currentPath === '/favoris' ? 'font-bold underline underline-offset-1' : ''
					}`}
				>
					<span>Favoris</span>
					<img src="/images/5.png" alt="Favoris" class="icon-kawaii-desktop" />
				</a>
			</li>
		</ul>		
	</nav>

<!-- Menu Mobile -->
<div
	class="menu-overlay fixed inset-0 z-[9999] transform bg-[#FFCAD4] text-[#9D8189] transition-transform duration-400 ease-in-out"
	style="transform: translateX({isMenuOpen ? '0%' : '-100%'})"
>
	<!-- Mascottes Kawaii -->
	<img
		src="/images/7.png"
		alt="Kawaii Mascotte"
		class="kawaii-mascot absolute bottom-4 left-4 h-20 w-auto"
	/>
	<img
		src="/images/2.png"
		alt="Kawaii Mascotte"
		class="kawaii-mascot2 absolute top-4 right-4 h-20 w-auto"
	/>

	<!-- Liens de navigation -->
	<ul
	class="menu-links flex h-full flex-col items-center justify-center gap-12 text-center font-body text-2xl"
>
	<li class="menu-item">
		<a
			href="/"
			class={`menu-link-kawaii ${
				currentPath === '/' ? 'font-bold underline underline-offset-1' : ''
			}`}
			on:click={() => (isMenuOpen = false)}
		>
			<img src="/images/3.png" alt="Accueil" class="icon-kawaii" />
			<span>Accueil</span>
			<img src="/images/3.png" alt="Accueil" class="icon-kawaii" />
		</a>
	</li>
	<li class="menu-item">
		<a
			href="/recipes"
			class={`menu-link-kawaii ${
				currentPath === '/recipes' ? 'font-bold underline underline-offset-1' : ''
			}`}
			on:click={() => (isMenuOpen = false)}
		>
			<img src="/images/3.png" alt="Recettes" class="icon-kawaii" />
			<span>Recettes</span>
			<img src="/images/3.png" alt="Recettes" class="icon-kawaii" />
		</a>
	</li>
	<li class="menu-item">
		<a
			href="/favoris"
			class={`menu-link-kawaii ${
				currentPath === '/favoris' ? 'font-bold underline underline-offset-1' : ''
			}`}
			on:click={() => (isMenuOpen = false)}
		>
			<img src="/images/3.png" alt="Favoris" class="icon-kawaii" />
			<span>Favoris</span>
			<img src="/images/3.png" alt="Favoris" class="icon-kawaii" />
		</a>
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

			<li>
				<a
					href="/"
					class={`hover:text-[#F4ACB7] ${currentPath === '/' ? 'font-bold underline underline-offset-1	' : ''}`}
					>Accueil</a
				>
			</li>
			<li>
				<a
					href="/recipes"
					class={`hover:text-[#F4ACB7] ${currentPath === '/recipes' ? 'font-bold underline underline-offset-1	' : ''}`}
					>Recettes</a
				>
			</li>
			<li>
				<a
					href="/favoris"
					class={`hover:text-[#F4ACB7] ${currentPath === '/favoris' ? 'font-bold underline underline-offset-1	' : ''}`}
					>Favoris</a
				>
			</li>
		</ul>

		<p class="text-center text-sm md:text-right">&copy; Intellicook. Tous droits réservés.</p>
	</div>
</footer>
