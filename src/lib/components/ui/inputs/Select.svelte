<script lang="ts">
  export let value: string = '';
  export let options: Array<{ value: string; label: string }> = [];
  export let placeholder: string = 'Sélectionnez une option';
  export let label: string = '';
  export let error: string = '';
  export let required: boolean = false;
  export let disabled: boolean = false;
  
  const baseClasses = 'w-full px-4 py-2 font-body border-2 rounded-xl transition-all duration-300 outline-none focus:shadow-[0_0_0_2px_#ffc8d4] appearance-none bg-white';
  const validClasses = 'border-[#f4acb7] focus:border-[#9d8189]';
  const errorClasses = 'border-red-400 focus:border-red-500 focus:shadow-[0_0_0_2px_rgba(248,113,113,0.2)]';
  const disabledClasses = 'opacity-50 cursor-not-allowed bg-gray-100';
  
  $: selectClasses = `
    ${baseClasses}
    ${error ? errorClasses : validClasses}
    ${disabled ? disabledClasses : ''}
  `;
</script>

<div class="space-y-1 relative">
  {#if label}
    <label class="block font-body text-sm text-[#9d8189]" for={label}>
      {label}
      {#if required}
        <span class="text-[#f4acb7]">*</span>
      {/if}
    </label>
  {/if}
  
  <div class="relative">
    <select
      {disabled}
      {required}
      id={label}
      class={selectClasses}
      bind:value
      on:change
      on:focus
      on:blur
    >
      <option value="" disabled selected>{placeholder}</option>
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
    
    <!-- Icône kawaii personnalisée pour le select -->
    <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#f4acb7]">
      <svg class="w-5 h-5 transition-transform duration-300 group-focus:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
  
  {#if error}
    <p class="text-sm text-red-500">{error}</p>
  {/if}
</div> 