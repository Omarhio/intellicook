<!-- CheckboxInput.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let label: string;
  export let value: string;
  export let group: string[] = [];
  export let id = `checkbox-${Math.random().toString(36).slice(2)}`;

  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    dispatch('change', { checked: target.checked, value });
  }
</script>

<div class="flex items-center gap-2">
  <input
    {id}
    type="checkbox"
    bind:group
    {value}
    on:change={handleChange}
    class="text-[#F4ACB7] accent-[#F4ACB7] h-4 w-4 rounded border-gray-300 focus:ring-[#F4ACB7]"
    aria-labelledby={`${id}-label`}
  />
  <label 
    for={id} 
    id={`${id}-label`}
    class="text-sm text-gray-700"
  >
    {label}
  </label>
</div> 