<!-- FilterButton.svelte -->
<script lang="ts">
  export let active: boolean = false;
  export let label: string;
  export let className: string = '';
  export let disabled: boolean = false;
  
  $: buttonText = active ? `Fermer ${label.toLowerCase()}` : label;
  $: buttonClass = `rounded-2xl px-6 py-2 font-bold text-white transition-colors duration-200
    ${active 
      ? 'bg-[#e690a0] hover:bg-[#d87f8f]' 
      : 'bg-[#F4ACB7] hover:bg-[#e690a0]'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}`;
</script>

<button
  type="button"
  {disabled}
  on:click
  class={buttonClass}
  aria-pressed={active}
  aria-label={buttonText}
>
  {buttonText}
</button>

<style>
  button {
    -webkit-tap-highlight-color: transparent;
  }
</style> 