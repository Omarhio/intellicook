<script lang="ts">
  export let level: 1 | 2 | 3 | 4 | 5 | 6 = 1;
  export let color: string = 'text-[#9d8189]';
  
  const sizeClasses = {
    1: 'text-4xl md:text-5xl',
    2: 'text-3xl md:text-4xl',
    3: 'text-2xl md:text-3xl',
    4: 'text-xl md:text-2xl',
    5: 'text-lg md:text-xl',
    6: 'text-base md:text-lg'
  };
  
  $: Tag = `h${level}`;
  $: classes = `font-title ${sizeClasses[level]} ${color}`;
</script>

<svelte:element this={Tag} class={classes}>
  <slot />
</svelte:element> 