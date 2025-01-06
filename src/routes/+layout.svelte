<script>
	import '../app.css';
</script>

<header class="bg-[#FFCAD4] p-4 shadow-md">
	<nav class="mx-auto flex max-w-6xl items-center justify-between">
		<div class="flex items-center gap-2">
			<img src="/logo.webp" alt="Intellicook Logo" class="h-10 w-auto" />
			<span class="font-title text-3xl text-[white]">Intellicook</span>
		</div>

		<ul class="flex gap-4 font-body text-lg">
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
</header>

<slot />

<footer class="bg-[#FFCAD4] py-6 font-body text-[#9D8189]">
	<div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
		<div class="flex items-center gap-2">
			<img src="/logo.webp" alt="Intellicook Logo" class="h-12 w-auto" />
			<p class="max-w-sm text-center text-sm md:text-left">
				<strong class="font-title text-lg text-[#F4ACB7]">Intellicook</strong> — Découvrez des recettes
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
