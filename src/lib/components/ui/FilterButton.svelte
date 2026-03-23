<!-- FilterButton.svelte -->
<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';

  let {
    active = false,
    label,
    className = '',
    disabled = false,
    onclick
  }: {
    active?: boolean;
    label: string;
    className?: string;
    disabled?: boolean;
    onclick?: MouseEventHandler<HTMLButtonElement>;
  } = $props();

  let buttonText = $derived(active ? `Fermer ${label.toLowerCase()}` : label);
  let buttonClass = $derived(
    `rounded-2xl px-6 py-2 font-bold text-white transition-colors duration-200
    ${active
      ? 'bg-[#e690a0] hover:bg-[#d87f8f]'
      : 'bg-[#F4ACB7] hover:bg-[#e690a0]'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}`
  );
</script>

<button
  type="button"
  {disabled}
  {onclick}
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
