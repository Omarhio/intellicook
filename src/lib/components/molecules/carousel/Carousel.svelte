<script lang="ts">
	export let items: Array<{ nom: string; image: string }> = [];
	export let currentIndex: number = 0;

	function getItem(indexOffset: number) {
		const total = items.length;
		return items[(currentIndex + indexOffset + total) % total];
	}
</script>

<div class="relative mt-10 w-full max-w-6xl">
	<h2 class="mb-8 text-center text-3xl font-bold text-[#9D8189]">Nos recettes du jour</h2>
	<div class="flex items-center justify-center gap-6">
		{#if items.length > 0}
			<div class="w-60 scale-90 opacity-70">
				<img
					src={getItem(-1).image}
					alt={getItem(-1).nom}
					class="h-40 w-full rounded-2xl object-cover"
				/>
			</div>
			<div class="w-96 scale-100 rounded-2xl">
				<img
					src={getItem(0).image}
					alt={getItem(0).nom}
					class="h-48 w-full rounded-2xl object-cover"
				/>
				<h3 class="title-font mt-4 text-center text-2xl font-bold text-[#F4ACB7]">
					{getItem(0).nom}
				</h3>
			</div>
			<div class="w-60 scale-90 opacity-70">
				<img
					src={getItem(1).image}
					alt={getItem(1).nom}
					class="h-40 w-full rounded-2xl object-cover"
				/>
			</div>
		{/if}
	</div>
	<div class="mt-6 flex justify-center gap-2">
		{#each items as _, index}
			<button
				on:click={() => (currentIndex = index)}
				class="h-3 w-3 rounded-full {currentIndex === index ? 'bg-[#F4ACB7]' : 'bg-gray-300'}"
				aria-label="Voir la recette numéro {index + 1}"
			></button>
		{/each}
	</div>
</div> 