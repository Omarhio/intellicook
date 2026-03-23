<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	let {
		className = '',
		ariaLabel = 'Fermer',
		position = 'absolute',
		onclick
	}: {
		className?: string;
		ariaLabel?: string;
		position?: 'absolute' | 'relative';
		onclick?: MouseEventHandler<HTMLButtonElement>;
	} = $props();

	let buttonClass = $derived(
		`${position === 'absolute' ? 'absolute right-4 top-4' : ''}
		text-2xl text-[#F4ACB7] hover:text-[#e690a0] transition-colors duration-200
		${className}`
	);
</script>

<button type="button" {onclick} class={buttonClass} aria-label={ariaLabel}>
	&times;
</button>

<style>
	button {
		-webkit-tap-highlight-color: transparent;
	}
</style>
