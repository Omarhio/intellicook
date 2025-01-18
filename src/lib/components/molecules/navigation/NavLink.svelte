<script lang="ts">
  export let href: string = '/';
  export let label: string;
  export let icon: string;
  export let isActive: boolean = false;
  export let isMobile: boolean = false;
  export let onClick: (() => void) | undefined = undefined;
</script>

{#if isMobile}
  <li class="menu-item">
    <a
      {href}
      class={`menu-link-kawaii ${isActive ? 'font-bold underline underline-offset-1' : ''}`}
      on:click={onClick}
    >
      <img src={icon} alt={label} class="icon-kawaii" />
      <span>{label}</span>
      <img src={icon} alt={label} class="icon-kawaii" />
    </a>
  </li>
{:else}
  <li class="nav-item-desktop">
    <a
      {href}
      class={`menu-link-kawaii-desktop ${isActive ? 'font-bold underline underline-offset-1' : ''}`}
    >
      <span>{label}</span>
      <img src={icon} alt={label} class="icon-kawaii-desktop" />
    </a>
  </li>
{/if} 