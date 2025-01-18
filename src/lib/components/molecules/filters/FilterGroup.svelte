<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import CheckboxInput from '$lib/components/atoms/inputs/CheckboxInput.svelte';

	export let title: string;
	export let items: string[];
	export let selected: string[] = [];

	const dispatch = createEventDispatcher<{
		change: string[];
	}>();

	function handleChange(event: CustomEvent<string[]>) {
		dispatch('change', event.detail);
	}
</script>

<div class="mt-6 w-full max-w-2xl rounded-2xl bg-white p-4 shadow-lg">
	<h2 class="pb-2 text-xl font-bold text-[#9D8189]">{title}</h2>
	<div class="grid grid-cols-2 gap-4">
		{#each items as item}
			<CheckboxInput
				label={item}
				value={item}
				group={selected}
				on:change={handleChange}
			/>
		{/each}
	</div>
</div> 