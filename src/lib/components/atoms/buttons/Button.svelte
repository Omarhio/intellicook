<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'outline' = 'primary';
  export let size: 'sm' | 'base' | 'lg' = 'base';
  export let disabled: boolean = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  
  const baseClasses = 'font-body transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-[#f4acb7] hover:bg-[#ffc8d4] text-white hover:scale-105',
    secondary: 'bg-[#9d8189] hover:bg-opacity-90 text-white hover:scale-105',
    outline: 'border-2 border-[#f4acb7] text-[#f4acb7] hover:bg-[#f4acb7] hover:text-white hover:scale-105'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    base: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  $: classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
</script>

<button {type} {disabled} class={classes} on:click>
  <slot />
</button> 