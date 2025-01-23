<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import CheckboxInput from '$lib/components/ui/inputs/CheckboxInput.svelte';

	export let title: string;
	export let items: string[];
	export let selected: string[] = [];
	export let id = `filter-group-${Math.random().toString(36).slice(2)}`;

	const dispatch = createEventDispatcher<{
		change: string[];
	}>();

	function handleChange(event: CustomEvent<{ checked: boolean; value: string }>) {
		const { checked, value } = event.detail;
		const newSelected = checked
			? [...selected, value]
			: selected.filter(item => item !== value);
		dispatch('change', newSelected);
	}
</script>

<div 
	class="mt-6 w-full max-w-2xl rounded-2xl bg-white p-4 shadow-lg"
	role="group"
	aria-labelledby={`${id}-title`}
>
	<h2 
		id={`${id}-title`}
		class="pb-2 text-xl font-bold text-[#9D8189]"
	>
		{title}
	</h2>
	<div 
		class="grid grid-cols-2 gap-4"
		role="group"
		aria-label={`Liste des filtres ${title.toLowerCase()}`}
	>
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