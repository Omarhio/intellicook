<script lang="ts">
	import { scale } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
	
	export let ariaLabel: string;
	export let isFavorite: boolean = false;
	export let size: 'sm' | 'md' | 'lg' = 'md';
	
	const sizeClasses = {
		sm: 'h-5 w-5',
		md: 'h-7 w-7',
		lg: 'h-8 w-8'
	};
	
	$: heartClass = `${sizeClasses[size]} transition-all duration-300 ease-out 
		hover:scale-110 active:scale-95 
		${isFavorite 
			? 'text-[#FF6B8B] drop-shadow-lg hover:text-[#FF4D76]' 
			: 'text-white/90 hover:text-[#FF6B8B] filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]'}`;
</script>

<button
	on:click
	aria-label={ariaLabel}
	class="absolute bottom-5 right-5 sm:bottom-auto sm:top-5 rounded-full p-1.5 
		bg-black/10 backdrop-blur-sm
		hover:bg-black/20 active:bg-black/30 
		transition-all duration-300 ease-out
		shadow-lg"
>
	{#key isFavorite}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class={heartClass}
			fill={isFavorite ? 'currentColor' : 'none'}
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width={isFavorite ? 0 : 2.5}
			in:scale={{
				duration: 400,
				easing: elasticOut,
				start: 0.8
			}}
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
			/>
		</svg>
	{/key}
</button>

<style>
	button {
		-webkit-tap-highlight-color: transparent;
	}
	
	@media (hover: hover) {
		button:hover svg {
			filter: drop-shadow(0 0 8px rgba(255, 107, 139, 0.5));
		}
	}
</style> 