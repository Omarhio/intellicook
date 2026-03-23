<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	let {
		ariaLabel,
		isFavorite = false,
		size = 'md',
		className = '',
		onclick
	}: {
		ariaLabel: string;
		isFavorite?: boolean;
		size?: 'sm' | 'md' | 'lg';
		className?: string;
		onclick?: MouseEventHandler<HTMLButtonElement>;
	} = $props();

	const sizeClasses = {
		sm: 'h-4 w-4',
		md: 'h-6 w-6',
		lg: 'h-8 w-8'
	};

	let heartClass = $derived(
		`${sizeClasses[size]} transition-all duration-300 ease-out
		hover:scale-110 active:scale-95
		${isFavorite
			? 'text-[#FF6B8B] drop-shadow-lg hover:text-[#FF4D76]'
			: 'text-white/90 hover:text-[#FF6B8B] filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]'}`
	);
</script>

<button
	type="button"
	aria-label={ariaLabel}
	{onclick}
	class="group relative flex items-center justify-center rounded-full p-2 transition-all duration-300 hover:bg-white/10 {className}"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={heartClass}
		fill={isFavorite ? 'currentColor' : 'none'}
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		aria-hidden="true"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
		/>
	</svg>
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
