<!-- CheckboxInput.svelte -->
<script lang="ts">
  let {
    label,
    value,
    group = $bindable<string[]>([]),
    id = `checkbox-${Math.random().toString(36).slice(2)}`,
    disabled = false,
    className = ''
  }: {
    label: string;
    value: string;
    group?: string[];
    id?: string;
    disabled?: boolean;
    className?: string;
  } = $props();

  let checked = $derived(group.includes(value));
  let inputClass = $derived(
    `text-[#F4ACB7] accent-[#F4ACB7] h-4 w-4 rounded border-gray-300
    focus:ring-[#F4ACB7] transition-colors duration-200
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}`
  );
</script>

<div class="flex items-center gap-2">
  <input
    {id}
    type="checkbox"
    bind:group
    {value}
    {disabled}
    class={inputClass}
    aria-labelledby={`${id}-label`}
  />
  <label
    for={id}
    id={`${id}-label`}
    class="text-sm text-gray-700 {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
  >
    {label}
  </label>
</div>
