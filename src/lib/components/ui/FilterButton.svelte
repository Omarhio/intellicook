<!-- FilterButton.svelte -->
<script lang="ts">
  export let active: boolean = false;
  export let label: string;
  
  $: buttonText = active ? `Fermer ${label.toLowerCase()}` : label;
</script>

<button
  on:click
  class="rounded-2xl bg-[#F4ACB7] px-6 py-2 font-bold text-white hover:bg-[#e690a0] transition-colors duration-200"
>
  {buttonText}
</button> 