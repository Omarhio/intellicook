<script lang="ts">
	export let variant: 'primary' | 'secondary' = 'primary';
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let disabled: boolean = false;
	export let className: string = '';

	$: buttonClass = `rounded-2xl px-6 py-2 font-bold text-white transition-colors duration-200
		${variant === 'primary' 
			? 'bg-[#F4ACB7] hover:bg-[#e690a0] disabled:bg-[#F4ACB7]/50' 
			: 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-200/50'}
		${className}`;
</script>

<button
	{type}
	{disabled}
	on:click
	class={buttonClass}
>
	<slot />
</button>

<style>
	button {
		-webkit-tap-highlight-color: transparent;
	}
</style> 