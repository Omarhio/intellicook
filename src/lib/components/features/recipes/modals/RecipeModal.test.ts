import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import type { Recipe } from '$lib/types/Recipe';
import RecipeModal from './RecipeModal.svelte';

const mockRecipe: Recipe = {
    id: 1,
    nom: 'Sushi',
    description: 'Délicieux sushis maison',
    image: '/images/sushi.webp',
    temps_preparation: 30,
    temps_cuisson: 20,
    difficulte: 'Moyen',
    ingredients: [
        { ingredient: { id: 1, nom: 'Riz japonais' }, quantite: 300, unite: 'g' },
        { ingredient: { id: 2, nom: 'Saumon' }, quantite: 200, unite: 'g' }
    ],
    etapes: ['Cuire le riz', 'Couper le saumon', 'Assembler les sushis'],
    categorie: 'Plat principal',
    tags: ['japonais', 'poisson'],
    favoris: false,
    allergenes: ['poisson', 'soja']
};

describe('RecipeModal', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
        document.body.style.overflow = '';
    });

    it('devrait rendre correctement les détails de la recette', () => {
        const { getByText, getByRole, container } = render(RecipeModal, {
            props: { recipe: mockRecipe }
        });

        // Helper to match text that may be split across child elements
        const hasText = (text: string) => (_: string, el: Element | null) =>
            el?.textContent?.replace(/\s+/g, ' ').trim() === text;

        expect(getByText('Sushi')).toBeTruthy();
        expect(getByText('Ingrédients :')).toBeTruthy();
        expect(getByText(hasText('Riz japonais - 300 g'))).toBeTruthy();
        expect(getByText(hasText('Saumon - 200 g'))).toBeTruthy();
        expect(getByText('Préparation :')).toBeTruthy();
        expect(getByText('Cuire le riz')).toBeTruthy();
        expect(getByText(hasText('Temps de préparation : 30 minutes'))).toBeTruthy();
        expect(getByText(hasText('Temps de cuisson : 20 minutes'))).toBeTruthy();
        expect(getByText(hasText('Difficulté : Moyen'))).toBeTruthy();
        expect(getByText(hasText('Allergènes : poisson, soja'))).toBeTruthy();
        expect(getByRole('img', { name: 'Sushi' })).toBeTruthy();
    });

    it('devrait appeler onclose lors du clic sur le bouton fermer', async () => {
        const handleClose = vi.fn();
        const { getByRole } = render(RecipeModal, {
            props: { recipe: mockRecipe, onclose: handleClose }
        });

        const closeButton = getByRole('button', { name: 'Fermer' });
        await fireEvent.click(closeButton);
        expect(handleClose).toHaveBeenCalled();
    });

    it('devrait appeler onclose lors du clic sur le backdrop', async () => {
        const handleClose = vi.fn();
        const { getByRole } = render(RecipeModal, {
            props: { recipe: mockRecipe, onclose: handleClose }
        });

        const overlay = getByRole('button', { name: 'Fermer la recette' });
        await fireEvent.click(overlay);
        expect(handleClose).toHaveBeenCalled();
    });

    it('devrait appeler onclose lors de l\'appui sur Escape', async () => {
        const handleClose = vi.fn();
        render(RecipeModal, {
            props: { recipe: mockRecipe, onclose: handleClose }
        });

        await fireEvent.keyDown(window, { key: 'Escape' });
        expect(handleClose).toHaveBeenCalled();
    });

    it('devrait désactiver le scroll du body au montage', () => {
        render(RecipeModal, { props: { recipe: mockRecipe } });
        expect(document.body.style.overflow).toBe('hidden');
    });

    it('devrait réactiver le scroll du body à la destruction', () => {
        const { unmount } = render(RecipeModal, { props: { recipe: mockRecipe } });
        unmount();
        expect(document.body.style.overflow).toBe('');
    });
});
