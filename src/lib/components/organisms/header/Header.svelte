<script lang="ts">
  import Hamburger from 'svelte-hamburgers';
  import NavLink from '$lib/components/molecules/navigation/NavLink.svelte';
  
  export let isMenuOpen: boolean = false;
  export let currentPath: string = '/';
  
  const navigationItems = [
    { href: '/', label: 'Accueil', icon: '/images/8.png' },
    { href: '/recipes', label: 'Recettes', icon: '/images/2.png' },
    { href: '/favoris', label: 'Favoris', icon: '/images/5.png' }
  ];
</script>

<header class="relative z-50 bg-[#FFCAD4] p-4 shadow-md">
  <nav class="mx-auto flex max-w-6xl items-center justify-center px-4 md:w-full md:justify-between">
    <div class="flex items-center gap-2">
      <a href="/" class="flex items-center gap-2">
        <img src="/logo.webp" alt="Intellicook Logo" class="menu-link-kawaii h-10 w-auto" />
        <span class="menu-link-kawaii font-title text-3xl text-[#9D8189]">Intellicook</span>
      </a>
    </div>

    <div
      role="button"
      tabindex="0"
      aria-label="Toggle menu"
      aria-expanded={isMenuOpen}
      class="absolute left-4 top-2 z-[10000] block cursor-pointer md:hidden"
      on:click={() => (isMenuOpen = !isMenuOpen)}
      on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && (isMenuOpen = !isMenuOpen)}
    >
      <Hamburger
        open={isMenuOpen}
        class="ease-[cubic-bezier(0.25, 0.8, 0.5, 1)] transition-all duration-400"
        --color="#9D8189"
      />
    </div>

    <ul class="nav-links-desktop hidden gap-6 font-body text-lg md:flex">
      {#each navigationItems as item}
        <NavLink
          href={item.href}
          label={item.label}
          icon={item.icon}
          isActive={currentPath === item.href}
        />
      {/each}
    </ul>
  </nav>

  <!-- Menu Burger -->
  <div
    class="menu-overlay fixed inset-0 z-[9999] transform bg-[#FFCAD4] text-[#9D8189] transition-transform duration-400 ease-in-out"
    style="transform: translateX({isMenuOpen ? '0%' : '-100%'})"
  >
    <!-- Animation kawaii -->
    <div class="absolute bottom-12 left-1/2 -translate-x-1/2 transform">
      <img src="/images/cute.gif" alt="Kawaii Animation" class="h-40 w-auto object-contain" />
    </div>

    <!-- Liste de navigation -->
    <ul class="menu-links flex h-full flex-col items-center justify-center gap-12 text-center font-body text-2xl">
      <h2 class="kawaii-mascot menu-section-title text-3xl font-semibold uppercase text-[#9D8189]">
        Navigation
      </h2>
      {#each navigationItems as item}
        <NavLink
          href={item.href}
          label={item.label}
          icon="/images/3.png"
          isActive={currentPath === item.href}
          isMobile={true}
          onClick={() => (isMenuOpen = false)}
        />
      {/each}
    </ul>

    <!-- Pied de menu -->
    <div class="menu-footer absolute bottom-0 left-0 right-0 flex flex-col items-center gap-4 bg-[#FFCAD4] py-4 shadow-inner">
      <p class="text-sm text-[#9D8189]">&copy; 2025 Intellicook. Tous droits réservés.</p>
    </div>
  </div>
</header> 