<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    level = 1,
    color = 'text-[#9d8189]',
    children
  }: {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    color?: string;
    children?: Snippet;
  } = $props();

  const sizeClasses = {
    1: 'text-4xl md:text-5xl',
    2: 'text-3xl md:text-4xl',
    3: 'text-2xl md:text-3xl',
    4: 'text-xl md:text-2xl',
    5: 'text-lg md:text-xl',
    6: 'text-base md:text-lg'
  };

  let Tag = $derived(`h${level}`);
  let classes = $derived(`font-title ${sizeClasses[level]} ${color}`);
</script>

<svelte:element this={Tag} class={classes}>
  {@render children?.()}
</svelte:element>
