<script lang="ts">
	export let onClick: () => void;
</script>

<button
	on:click={onClick}
	class="absolute right-0 top-0 z-50 text-5xl font-bold text-[#9D8189] hover:text-red-600"
	aria-label="Fermer"
	type="button"
	style="top: -0.5rem;"
>
	&times;
</button> 