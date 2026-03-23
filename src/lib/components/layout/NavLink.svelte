<script lang="ts">
  let {
    href = '/',
    label,
    icon,
    isActive = false,
    isMobile = false,
    onclick
  }: {
    href?: string;
    label: string;
    icon: string;
    isActive?: boolean;
    isMobile?: boolean;
    onclick?: () => void;
  } = $props();
</script>

{#if isMobile}
  <li class="menu-item">
    <a
      {href}
      class={`menu-link-kawaii ${isActive ? 'font-bold underline underline-offset-1' : ''}`}
      {onclick}
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
