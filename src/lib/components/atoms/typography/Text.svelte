<script lang="ts">
  export let variant: 'title' | 'body' = 'body';
  export let size: 'sm' | 'base' | 'lg' | 'xl' | '2xl' = 'base';
  export let color: string = '';
  
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
  
  $: classes = `${baseClasses[variant]} ${sizeClasses[size]} ${color}`;
</script>

<span class={classes}>
  <slot />
</span> 