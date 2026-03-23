import '@testing-library/jest-dom';
import { vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

// Étendre les matchers de test
expect.extend(matchers);

// Mock des transitions Svelte
vi.mock('svelte/transition', () => ({
    fade: () => ({ delay: 0, duration: 0, easing: (t: number) => t, css: () => '' }),
    scale: () => ({ delay: 0, duration: 0, easing: (t: number) => t, css: () => '' }),
    crossfade: () => [
        () => ({ delay: 0, duration: 0, easing: (t: number) => t, css: () => '' }),
        () => ({ delay: 0, duration: 0, easing: (t: number) => t, css: () => '' })
    ]
}));

// Mock des easings Svelte
vi.mock('svelte/easing', () => ({
    elasticOut: (t: number) => t
}));

// Mock de fetch pour les tests du store
global.fetch = vi.fn(() =>
    Promise.resolve({
        ok: true,
        json: () =>
            Promise.resolve({
                ingredients: [
                    { id: 1, nom: 'Riz japonais' },
                    { id: 2, nom: 'Saumon' },
                    { id: 3, nom: 'Avocat' }
                ],
                recettes: [
                    {
                        id: 1,
                        nom: 'Sushi',
                        description: 'Sushi au saumon',
                        image: '/images/sushi.webp',
                        temps_preparation: 30,
                        temps_cuisson: 20,
                        difficulte: 'Moyen',
                        ingredients: [
                            { ingredient: { id: 1, nom: 'Riz japonais' }, quantite: 200, unite: 'g' },
                            { ingredient: { id: 2, nom: 'Saumon' }, quantite: 100, unite: 'g' }
                        ],
                        etapes: ['Cuire le riz', 'Couper le saumon'],
                        allergenes: ['gluten', 'poisson'],
                        categorie: 'Plat principal',
                        tags: ['japonais', 'poisson', 'riz'],
                        favoris: false
                    }
                ]
            })
    })
) as unknown as typeof fetch; 