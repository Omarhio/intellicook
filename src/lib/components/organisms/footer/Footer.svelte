<!-- Footer.svelte -->
<script lang="ts">
  export let currentPath: string = '/';
  
  const navigationItems = [
    { href: '/', label: 'Accueil' },
    { href: '/recipes', label: 'Recettes' },
    { href: '/favoris', label: 'Favoris' }
  ];
</script>

<footer class="bg-[#FFCAD4] py-6 font-body text-[#9D8189]">
  <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
    <div class="flex items-center gap-2">
      <img src="/logo.webp" alt="Intellicook Logo" class="h-12 w-auto" />
      <p class="max-w-sm text-center text-sm md:text-left">
        <strong class="font-title text-lg text-[#9D8189]">Intellicook</strong> — Découvrez des recettes
        japonaises et kawaii pour illuminer vos repas !
      </p>
    </div>

    <ul class="flex gap-6 text-sm">
      {#each navigationItems as item}
        <li>
          <a
            href={item.href}
            class={`hover:text-[#F4ACB7] ${currentPath === item.href ? 'font-bold underline underline-offset-1' : ''}`}
          >
            {item.label}
          </a>
        </li>
      {/each}
    </ul>

    <p class="text-center text-sm md:text-right">&copy; Intellicook. Tous droits réservés.</p>
  </div>
</footer> 