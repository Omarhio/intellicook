<!-- TextInput.svelte -->
<script lang="ts">
  export let value: string = '';
  export let type: 'text' | 'email' | 'password' | 'search' = 'text';
  export let placeholder: string = '';
  export let label: string = '';
  export let error: string = '';
  export let required: boolean = false;
  export let disabled: boolean = false;
  
  const baseClasses = 'w-full px-4 py-2 font-body border-2 rounded-xl transition-all duration-300 outline-none focus:shadow-[0_0_0_2px_#ffc8d4]';
  const validClasses = 'border-[#f4acb7] focus:border-[#9d8189]';
  const errorClasses = 'border-red-400 focus:border-red-500 focus:shadow-[0_0_0_2px_rgba(248,113,113,0.2)]';
  const disabledClasses = 'opacity-50 cursor-not-allowed bg-gray-100';
  
  $: inputClasses = `
    ${baseClasses}
    ${error ? errorClasses : validClasses}
    ${disabled ? disabledClasses : ''}
  `;
</script>

<div class="space-y-1">
  {#if label}
    <label class="block font-body text-sm text-[#9d8189]" for={label}>
      {label}
      {#if required}
        <span class="text-[#f4acb7]">*</span>
      {/if}
    </label>
  {/if}
  
  <input
    {type}
    {placeholder}
    {disabled}
    {required}
    id={label}
    class={inputClasses}
    bind:value
    on:input
    on:change
    on:focus
    on:blur
  />
  
  {#if error}
    <p class="text-sm text-red-500">{error}</p>
  {/if}
</div> 