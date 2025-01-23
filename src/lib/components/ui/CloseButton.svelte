<script lang="ts">
	export let className: string = '';
</script>

<button
	on:click
	class="absolute right-4 top-4 text-2xl text-[#F4ACB7] hover:text-[#e690a0] {className}"
	aria-label="Fermer"
>
	&times;
</button> 