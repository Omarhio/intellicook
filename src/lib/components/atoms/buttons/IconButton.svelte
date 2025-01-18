<script lang="ts">
	export let onClick: (e: MouseEvent) => void;
	export let ariaLabel: string;
	export let isFavorite: boolean = false;
</script>

<button
	on:click={onClick}
	aria-label={ariaLabel}
	class="absolute bottom-1 right-1"
>
	<svg
		class="h-8 w-8 transform {isFavorite
			? 'animate-pulse fill-red-500 transition-transform hover:scale-110'
			: 'fill-none stroke-current stroke-2 text-[#F4ACB7] transition-transform hover:scale-110'}"
		viewBox="0 0 24 24"
	>
		<path
			d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5c0-3.22 2.46-5.5 5.5-5.5 1.74 0 3.41.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09 3.04 0 5.5 2.28 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
		></path>
	</svg>
</button> 