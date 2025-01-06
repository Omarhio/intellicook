<script>
	import '../app.css';
</script>

<!-- HEADER -->
<header class="bg-[#FFCAD4] p-4 shadow-md">
	<nav class="mx-auto flex max-w-6xl items-center justify-between">
		<!-- Logo -->
		<div class="flex items-center gap-2">
			<img src="/logo.webp" alt="Intellicook Logo" class="h-10 w-auto" />
			<span class="font-title text-3xl text-[white]">Intellicook</span>
		</div>

		<!-- Navigation Links -->
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

<!-- SLOT: Render page-specific content -->
<slot />
