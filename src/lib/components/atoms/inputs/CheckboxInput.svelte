<!-- CheckboxInput.svelte -->
<script lang="ts">
  export let label: string;
  export let value: string;
  export let checked: boolean = false;
  export let group: string[] = [];
</script>

<label class="flex items-center gap-2">
  <input
    type="checkbox"
    bind:group
    {value}
    class="text-[#F4ACB7] accent-[#F4ACB7]"
  />
  <span>{label}</span>
</label> 