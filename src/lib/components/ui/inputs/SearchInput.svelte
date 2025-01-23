<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value: string = '';
	export let placeholder: string = 'Rechercher une recette...';
	export let id = `search-${Math.random().toString(36).slice(2)}`;

	const dispatch = createEventDispatcher<{
		input: string;
		clear: void;
	}>();

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		value = target.value;
		dispatch('input', value);
	}

	function handleClear() {
		value = '';
		dispatch('clear');
		dispatch('input', '');
	}
</script>

<div class="relative w-full max-w-2xl mx-auto">
	<label for={id} class="sr-only">Rechercher une recette</label>
	<input
		{id}
		type="search"
		{value}
		{placeholder}
		on:input={handleInput}
		class="w-full h-12 rounded-3xl border-2 border-[#F4ACB7] px-6 py-3 text-center text-lg placeholder:text-center placeholder:text-[#9D8189] focus:border-[#F4ACB7] focus:outline-none focus:ring-2 focus:ring-[#F4ACB7] focus:ring-opacity-50 transition-all duration-200"
		role="searchbox"
		aria-label="Rechercher une recette"
	/>
	{#if value}
		<button
			type="button"
			on:click={handleClear}
			class="absolute right-4 top-1/2 -translate-y-1/2 text-[#F4ACB7] hover:text-[#e690a0] transition-colors duration-200"
			aria-label="Effacer la recherche"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
	{/if}
</div> 