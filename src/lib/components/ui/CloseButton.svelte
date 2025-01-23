<script lang="ts">
	export let className: string = '';
	export let ariaLabel: string = 'Fermer';
	export let position: 'absolute' | 'relative' = 'absolute';

	$: buttonClass = `${position === 'absolute' ? 'absolute right-4 top-4' : ''} 
		text-2xl text-[#F4ACB7] hover:text-[#e690a0] transition-colors duration-200 
		${className}`;
</script>

<button
	type="button"
	on:click
	class={buttonClass}
	aria-label={ariaLabel}
>
	&times;
</button>

<style>
	button {
		-webkit-tap-highlight-color: transparent;
	}
</style> 