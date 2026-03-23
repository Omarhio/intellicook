<script lang="ts">
	import CheckboxInput from '$lib/components/ui/inputs/CheckboxInput.svelte';

	let {
		title,
		items,
		selected = $bindable<string[]>([]),
		id = `filter-group-${Math.random().toString(36).slice(2)}`
	}: {
		title: string;
		items: string[];
		selected?: string[];
		id?: string;
	} = $props();
</script>

<div
	class="mt-6 w-full max-w-2xl rounded-2xl bg-white p-4 shadow-lg"
	role="group"
	aria-labelledby={`${id}-title`}
>
	<h2 id={`${id}-title`} class="pb-2 text-xl font-bold text-[#9D8189]">
		{title}
	</h2>
	<div
		class="grid grid-cols-2 gap-4"
		role="group"
		aria-label={`Liste des filtres ${title.toLowerCase()}`}
	>
		{#each items as item}
			<CheckboxInput label={item} value={item} bind:group={selected} />
		{/each}
	</div>
</div>
