<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    variant = 'body',
    size = 'base',
    color = '',
    children
  }: {
    variant?: 'title' | 'body';
    size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
    color?: string;
    children?: Snippet;
  } = $props();

  const baseClasses = {
    title: 'font-title',
    body: 'font-body'
  };

  const sizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  };

  let classes = $derived(`${baseClasses[variant]} ${sizeClasses[size]} ${color}`);
</script>

<span class={classes}>
  {@render children?.()}
</span>
