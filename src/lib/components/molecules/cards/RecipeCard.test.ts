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
        const { getByText, getByAltText } = render(RecipeCard, {
            props: { recipe: mockRecipe }
        });

        expect(getByText('Sushi')).toBeTruthy();
        expect(getByText('Ingrédients : Riz japonais')).toBeTruthy();
        expect(getByAltText('Sushi')).toBeTruthy();
    });

    it('devrait émettre l\'événement click lors du clic sur la carte', async () => {
        const mockClick = vi.fn();
        const { container } = render(RecipeCard, {
            props: { 
                recipe: mockRecipe,
                isFavorite: false
            }
        });

        const component = container.querySelector('button[aria-label="Voir les détails de la recette"]');
        component.addEventListener('click', mockClick);
        
        await fireEvent.click(component);
        expect(mockClick).toHaveBeenCalled();
    });

    it('devrait émettre l\'événement favorite lors du clic sur le bouton favori', async () => {
        const mockFavorite = vi.fn();
        const { container } = render(RecipeCard, {
            props: { 
                recipe: mockRecipe,
                isFavorite: false
            }
        });

        const favoriteButton = container.querySelector('button[aria-label="Ajouter ou retirer des favoris"]');
        favoriteButton.addEventListener('favorite', mockFavorite);
        
        await fireEvent.click(favoriteButton);
        expect(mockFavorite).toHaveBeenCalled();
    });

    it('devrait afficher le bon état du bouton favori', () => {
        const { container, rerender } = render(RecipeCard, {
            props: { 
                recipe: mockRecipe,
                isFavorite: false
            }
        });

        let favoriteButton = container.querySelector('button[aria-label="Ajouter ou retirer des favoris"]');
        expect(favoriteButton.classList.contains('text-gray-400')).toBeTruthy();

        rerender({ recipe: mockRecipe, isFavorite: true });
        expect(favoriteButton.classList.contains('text-red-500')).toBeTruthy();
    });
}); 