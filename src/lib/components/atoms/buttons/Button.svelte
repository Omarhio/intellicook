<script lang="ts">
	export let onClick: () => void;
	export let label: string;
	export let variant: 'primary' | 'secondary' = 'primary';
</script>

<button
	on:click={onClick}
	class="rounded-2xl {variant === 'primary' ? 'bg-[#F4ACB7] hover:bg-[#e690a0]' : 'bg-gray-200 hover:bg-gray-300'} px-6 py-2 font-bold text-white"
>
	{label}
</button> 