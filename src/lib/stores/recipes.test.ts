import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { recipeStore, favorites } from './recipes';

describe('Recipe Store', () => {
    beforeEach(() => {
        // Réinitialiser le store avant chaque test
        localStorage.clear();
        recipeStore.resetFilters();
    });

    it('devrait charger les recettes correctement', async () => {
        await recipeStore.loadRecipes();
        const state = get(recipeStore);
        expect(state.recipes).toHaveLength(1);
        expect(state.recipes[0].nom).toBe('Sushi');
    });

    it('devrait basculer les favoris correctement', async () => {
        await recipeStore.loadRecipes();
        recipeStore.toggleFavorite(1);
        const state = get(recipeStore);
        expect(state.recipes[0].favoris).toBe(true);
        
        // Vérifier que le favori est sauvegardé dans localStorage
        const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        expect(savedFavorites).toContain(1);
    });

    it('devrait filtrer par terme de recherche', async () => {
        await recipeStore.loadRecipes();
        recipeStore.setSearchTerm('sushi');
        const state = get(recipeStore);
        expect(state.filtered).toHaveLength(1);
        expect(state.filtered[0].nom).toBe('Sushi');
    });

    it('devrait filtrer par tags', async () => {
        await recipeStore.loadRecipes();
        recipeStore.setSelectedTags(['riz']);
        const state = get(recipeStore);
        expect(state.filtered).toHaveLength(1);
        expect(state.filtered[0].tags).toContain('riz');
    });

    it('devrait filtrer par allergènes', async () => {
        await recipeStore.loadRecipes();
        recipeStore.setSelectedAllergens(['gluten']);
        const state = get(recipeStore);
        expect(state.filtered).toHaveLength(1);
        expect(state.filtered[0].allergenes).toContain('gluten');
    });

    it('devrait réinitialiser les filtres correctement', async () => {
        await recipeStore.loadRecipes();
        recipeStore.setSearchTerm('sushi');
        recipeStore.setSelectedTags(['riz']);
        recipeStore.setSelectedAllergens(['gluten']);
        
        recipeStore.resetFilters();
        const state = get(recipeStore);
        
        expect(state.searchTerm).toBe('');
        expect(state.selectedTags).toHaveLength(0);
        expect(state.selectedAllergens).toHaveLength(0);
    });

    it('devrait mettre à jour le store dérivé des favoris', async () => {
        await recipeStore.loadRecipes();
        recipeStore.toggleFavorite(1);
        const favs = get(favorites);
        expect(favs).toHaveLength(1);
        expect(favs[0].nom).toBe('Sushi');
    });
}); 