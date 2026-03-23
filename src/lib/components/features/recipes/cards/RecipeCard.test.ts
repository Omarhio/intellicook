import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import RecipeCard from './RecipeCard.svelte';
import type { Recipe } from '$lib/types/Recipe';

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
        }
    ],
    etapes: ['Étape 1', 'Étape 2'],
    categorie: 'Plat principal',
    tags: ['japonais', 'poisson'],
    favoris: false
};

describe('RecipeCard', () => {
    it('devrait rendre correctement les informations de la recette', () => {
        const { getByText, getByRole } = render(RecipeCard, {
            props: { recipe: mockRecipe }
        });

        expect(getByText('Sushi')).toBeInTheDocument();
        expect(getByText('Ingrédients : Riz japonais')).toBeInTheDocument();
        expect(getByRole('img', { name: 'Sushi' })).toBeInTheDocument();
    });

    it('devrait appeler onclick lors du clic sur la carte', async () => {
        const mockClick = vi.fn();
        const { getByRole } = render(RecipeCard, {
            props: { recipe: mockRecipe, isFavorite: false, onclick: mockClick }
        });

        const button = getByRole('button', { name: /Voir les détails de la recette Sushi/ });
        await fireEvent.click(button);
        expect(mockClick).toHaveBeenCalled();
    });

    it('devrait appeler onfavorite lors du clic sur le bouton favori', async () => {
        const mockFavorite = vi.fn();
        const { getByRole } = render(RecipeCard, {
            props: { recipe: mockRecipe, isFavorite: false, onfavorite: mockFavorite }
        });

        const favoriteButton = getByRole('button', { name: 'Ajouter aux favoris' });
        await fireEvent.click(favoriteButton);
        expect(mockFavorite).toHaveBeenCalled();
    });

    it('devrait afficher le bon aria-label selon l\'état favori', async () => {
        const { getByRole, rerender } = render(RecipeCard, {
            props: { recipe: mockRecipe, isFavorite: false }
        });

        expect(getByRole('button', { name: 'Ajouter aux favoris' })).toBeInTheDocument();

        await rerender({ recipe: mockRecipe, isFavorite: true });
        expect(getByRole('button', { name: 'Retirer des favoris' })).toBeInTheDocument();
    });
});
