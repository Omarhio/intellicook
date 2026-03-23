<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	let {
		variant = 'primary',
		type = 'button',
		disabled = false,
		className = '',
		children,
		onclick
	}: {
		variant?: 'primary' | 'secondary';
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		className?: string;
		children?: Snippet;
		onclick?: MouseEventHandler<HTMLButtonElement>;
	} = $props();

	let buttonClass = $derived(
		`rounded-2xl px-6 py-2 font-bold text-white transition-colors duration-200
		${variant === 'primary'
			? 'bg-[#F4ACB7] hover:bg-[#e690a0] disabled:bg-[#F4ACB7]/50'
			: 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-200/50'}
		${className}`
	);
</script>

<button {type} {disabled} {onclick} class={buttonClass}>
	{@render children?.()}
</button>

<style>
	button {
		-webkit-tap-highlight-color: transparent;
	}
</style>
