import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { recipeStore, favorites } from './recipes';
import type { Recipe } from '$lib/types/Recipe';

// Mock des données de test
const mockRecipes: Recipe[] = [
    {
        id: 1,
        nom: "Sushi",
        description: "Délicieux sushis maison",
        image: "/images/sushi.jpg",
        temps_preparation: 30,
        temps_cuisson: 20,
        difficulte: "Moyen",
        ingredients: [
            {
                ingredient: { id: 1, nom: "Riz japonais" },
                quantite: 300,
                unite: "g"
            }
        ],
        etapes: ["Étape 1", "Étape 2"],
        allergenes: ["poisson"],
        categorie: "Plat principal",
        tags: ["japonais", "poisson"],
        favoris: false
    },
    {
        id: 2,
        nom: "Ramen",
        description: "Ramen traditionnel",
        image: "/images/ramen.jpg",
        temps_preparation: 45,
        temps_cuisson: 30,
        difficulte: "Difficile",
        ingredients: [
            {
                ingredient: { id: 2, nom: "Nouilles" },
                quantite: 200,
                unite: "g"
            }
        ],
        etapes: ["Étape 1", "Étape 2"],
        allergenes: ["gluten"],
        categorie: "Plat principal",
        tags: ["japonais", "soupe"],
        favoris: true
    }
];

describe('Recipe Store', () => {
    beforeEach(() => {
        // Réinitialise le store avant chaque test
        recipeStore.resetFilters();
        // Mock de fetch pour loadRecipes
        global.fetch = vi.fn().mockResolvedValue({
            json: () => Promise.resolve({ recettes: mockRecipes })
        });
    });

    it('devrait charger les recettes correctement', async () => {
        await recipeStore.loadRecipes();
        const state = get(recipeStore);
        expect(state.recipes).toHaveLength(2);
        expect(state.recipes[0].nom).toBe('Sushi');
    });

    it('devrait basculer les favoris correctement', () => {
        recipeStore.loadRecipes();
        recipeStore.toggleFavorite(1);
        const state = get(recipeStore);
        expect(state.recipes[0].favoris).toBe(true);
    });

    it('devrait filtrer par terme de recherche', () => {
        recipeStore.loadRecipes();
        recipeStore.setSearchTerm('sushi');
        const state = get(recipeStore);
        expect(state.filtered).toHaveLength(1);
        expect(state.filtered[0].nom).toBe('Sushi');
    });

    it('devrait filtrer par tags', () => {
        recipeStore.loadRecipes();
        recipeStore.setSelectedTags(['soupe']);
        const state = get(recipeStore);
        expect(state.filtered).toHaveLength(1);
        expect(state.filtered[0].nom).toBe('Ramen');
    });

    it('devrait filtrer par allergènes', () => {
        recipeStore.loadRecipes();
        recipeStore.setSelectedAllergens(['gluten']);
        const state = get(recipeStore);
        expect(state.filtered).toHaveLength(1);
        expect(state.filtered[0].nom).toBe('Sushi');
    });

    it('devrait réinitialiser les filtres correctement', () => {
        recipeStore.loadRecipes();
        recipeStore.setSearchTerm('sushi');
        recipeStore.setSelectedTags(['japonais']);
        recipeStore.resetFilters();
        const state = get(recipeStore);
        expect(state.searchTerm).toBe('');
        expect(state.selectedTags).toHaveLength(0);
        expect(state.filtered).toEqual(state.recipes);
    });

    it('devrait mettre à jour le store dérivé des favoris', () => {
        recipeStore.loadRecipes();
        const favs = get(favorites);
        expect(favs).toHaveLength(1);
        expect(favs[0].nom).toBe('Ramen');
    });
}); 