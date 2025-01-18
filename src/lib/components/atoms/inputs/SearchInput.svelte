<script lang="ts">
	export let value: string = '';
	export let placeholder: string = 'Rechercher...';
	export let onClear: () => void;
</script>

<div class="relative w-full">
	<input
		type="text"
		bind:value
		{placeholder}
		class="w-full rounded-3xl border-2 border-[#F4ACB7] p-3 text-center text-lg placeholder:text-center focus:border-[#F4ACB7] focus:outline-none focus:ring-2 focus:ring-[#F4ACB7]"
	/>
	{#if value}
		<button
			on:click={onClear}
			class="absolute right-3 top-1/2 -translate-y-1/2 text-[#F4ACB7] hover:text-[#e690a0]"
			aria-label="Effacer la recherche"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
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
		</button>
	{/if}
</div> 