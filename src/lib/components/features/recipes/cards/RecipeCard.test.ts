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

    it('devrait émettre l\'événement click lors du clic sur la carte', async () => {
        const { component, getByRole } = render(RecipeCard, {
            props: { 
                recipe: mockRecipe,
                isFavorite: false
            }
        });

        const mockClick = vi.fn();
        component.$on('click', mockClick);
        
        const button = getByRole('button', { name: 'Voir les détails de la recette' });
        await fireEvent.click(button);
        expect(mockClick).toHaveBeenCalled();
    });

    it('devrait émettre l\'événement favorite lors du clic sur le bouton favori', async () => {
        const { component, getByRole } = render(RecipeCard, {
            props: { 
                recipe: mockRecipe,
                isFavorite: false
            }
        });

        const mockFavorite = vi.fn();
        component.$on('favorite', mockFavorite);
        
        const favoriteButton = getByRole('button', { name: 'Ajouter ou retirer des favoris' });
        await fireEvent.click(favoriteButton);
        expect(mockFavorite).toHaveBeenCalled();
    });

    it('devrait afficher le bon état du bouton favori', async () => {
        const { getByRole, rerender } = render(RecipeCard, {
            props: { 
                recipe: mockRecipe,
                isFavorite: false
            }
        });

        const favoriteButton = getByRole('button', { name: 'Ajouter ou retirer des favoris' });
        expect(favoriteButton.querySelector('svg')?.classList.toString()).toContain('text-white/90');

        await rerender({ recipe: mockRecipe, isFavorite: true });
        expect(favoriteButton.querySelector('svg')?.classList.toString()).toContain('text-[#FF6B8B]');
    });
}); 