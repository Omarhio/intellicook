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
        {
            ingredient: { id: 1, nom: 'Riz japonais' },
            quantite: 300,
            unite: 'g'
        },
        {
            ingredient: { id: 2, nom: 'Saumon' },
            quantite: 200,
            unite: 'g'
        }
    ],
    etapes: [
        'Cuire le riz',
        'Couper le saumon',
        'Assembler les sushis'
    ],
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
        const { getByText, getByRole, getAllByRole } = render(RecipeModal, {
            props: { recipe: mockRecipe }
        });

        expect(getByText('Sushi')).toBeTruthy();
        expect(getByText('Ingrédients :')).toBeTruthy();
        expect(getByText('Riz japonais - 300 g')).toBeTruthy();
        expect(getByText('Saumon - 200 g')).toBeTruthy();
        expect(getByText('Préparation :')).toBeTruthy();
        expect(getByText('Cuire le riz')).toBeTruthy();
        expect(getByText('Temps de préparation : 30 minutes')).toBeTruthy();
        expect(getByText('Temps de cuisson : 20 minutes')).toBeTruthy();
        expect(getByText('Difficulté : Moyen')).toBeTruthy();
        expect(getByText('Allergènes : poisson, soja')).toBeTruthy();
        expect(getByRole('img', { name: 'Sushi' })).toBeTruthy();
    });

    it('devrait fermer la modale lors du clic sur le bouton fermer', async () => {
        const handleClose = vi.fn();
        const { getByRole, component } = render(RecipeModal, {
            props: { recipe: mockRecipe }
        });

        component.$on('close', handleClose);
        const closeButton = getByRole('button', { name: 'Fermer' });
        await fireEvent.click(closeButton);

        expect(handleClose).toHaveBeenCalled();
    });

    it('devrait fermer la modale lors du clic à l\'extérieur', async () => {
        const handleClose = vi.fn();
        const { getByRole, component } = render(RecipeModal, {
            props: { recipe: mockRecipe }
        });

        component.$on('close', handleClose);
        const overlay = getByRole('button', { name: 'Fermer la recette' });
        await fireEvent.click(overlay);

        expect(handleClose).toHaveBeenCalled();
    });

    it('devrait fermer la modale lors de l\'appui sur Escape', async () => {
        const handleClose = vi.fn();
        const { component } = render(RecipeModal, {
            props: { recipe: mockRecipe }
        });

        component.$on('close', handleClose);
        await fireEvent.keyDown(window, { key: 'Escape' });

        expect(handleClose).toHaveBeenCalled();
    });

    it('devrait gérer les erreurs de chargement d\'image', async () => {
        const { getByRole } = render(RecipeModal, {
            props: { recipe: mockRecipe }
        });

        const img = getByRole('img', { name: 'Sushi' });
        await fireEvent.error(img);

        expect(img.getAttribute('src')).toBe('/images/recipe-placeholder.webp');
    });

    it('devrait désactiver le scroll du body au montage', () => {
        render(RecipeModal, {
            props: { recipe: mockRecipe }
        });

        expect(document.body.style.overflow).toBe('hidden');
    });

    it('devrait réactiver le scroll du body à la destruction', () => {
        const { unmount } = render(RecipeModal, {
            props: { recipe: mockRecipe }
        });

        unmount();
        expect(document.body.style.overflow).toBe('');
    });
}); 