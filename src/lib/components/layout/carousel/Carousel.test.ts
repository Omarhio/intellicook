import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import Carousel from './Carousel.svelte';
import type { Recipe } from '$lib/types/Recipe';

const mockRecipes: Recipe[] = [
    {
        id: 1,
        nom: 'Recette 1',
        description: 'Description de test 1',
        image: '/images/1.jpg',
        temps_preparation: 15,
        temps_cuisson: 20,
        difficulte: 'Facile',
        ingredients: [{ ingredient: { id: 1, nom: 'Ingrédient 1' }, quantite: 100, unite: 'g' }],
        etapes: ['Étape 1', 'Étape 2'],
        categorie: 'Plat principal',
        tags: ['test'],
        favoris: false
    },
    {
        id: 2,
        nom: 'Recette 2',
        description: 'Description de test 2',
        image: '/images/2.jpg',
        temps_preparation: 25,
        temps_cuisson: 30,
        difficulte: 'Moyen',
        ingredients: [{ ingredient: { id: 2, nom: 'Ingrédient 2' }, quantite: 200, unite: 'g' }],
        etapes: ['Étape 1', 'Étape 2'],
        categorie: 'Dessert',
        tags: ['test'],
        favoris: false
    },
    {
        id: 3,
        nom: 'Recette 3',
        description: 'Description de test 3',
        image: '/images/3.jpg',
        temps_preparation: 10,
        temps_cuisson: 15,
        difficulte: 'Difficile',
        ingredients: [{ ingredient: { id: 3, nom: 'Ingrédient 3' }, quantite: 300, unite: 'g' }],
        etapes: ['Étape 1', 'Étape 2'],
        categorie: 'Entrée',
        tags: ['test'],
        favoris: false
    }
];

describe('Carousel', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    it('devrait rendre le carousel avec les items fournis', () => {
        const { container } = render(Carousel, { props: { items: mockRecipes } });
        expect(container.querySelectorAll('img')).toHaveLength(3);
    });

    it('devrait changer l\'index lors du clic sur le bouton suivant', async () => {
        const { container } = render(Carousel, {
            props: { items: mockRecipes, currentIndex: 0 }
        });

        const nextButton = container.querySelector('button[aria-label="Recette suivante"]') as Element;
        await fireEvent.click(nextButton);

        const images = container.querySelectorAll('img');
        expect(images[1].alt).toBe('Recette 2');
    });

    it('devrait changer l\'index lors du clic sur le bouton précédent', async () => {
        const { container } = render(Carousel, {
            props: { items: mockRecipes, currentIndex: 1 }
        });

        const prevButton = container.querySelector('button[aria-label="Recette précédente"]') as Element;
        await fireEvent.click(prevButton);

        const images = container.querySelectorAll('img');
        expect(images[1].alt).toBe('Recette 1');
    });

    it('devrait démarrer le défilement automatique', () => {
        render(Carousel, { props: { items: mockRecipes } });
        expect(vi.getTimerCount()).toBe(1);
    });

    it('devrait s\'arrêter et redémarrer le défilement automatique lors d\'une interaction', async () => {
        const { container } = render(Carousel, { props: { items: mockRecipes } });
        const nextButton = container.querySelector('button[aria-label="Recette suivante"]') as Element;

        await fireEvent.click(nextButton);
        expect(vi.getTimerCount()).toBe(1);
    });
});
