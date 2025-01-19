import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import IconButton from './IconButton.svelte';

describe('IconButton', () => {
    it('devrait rendre le bouton avec les props par défaut', () => {
        const { container } = render(IconButton, {
            props: {
                ariaLabel: 'Ajouter aux favoris'
            }
        });

        const button = container.querySelector('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('aria-label', 'Ajouter aux favoris');
    });

    it('devrait appliquer la classe correcte selon l\'état favori', () => {
        const { container } = render(IconButton, {
            props: {
                ariaLabel: 'Ajouter aux favoris',
                isFavorite: true
            }
        });

        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg?.classList.toString()).toContain('text-[#FF6B8B]');
    });

    it('devrait rendre le cœur vide quand isFavorite est false', () => {
        const { container } = render(IconButton, {
            props: {
                ariaLabel: 'Ajouter aux favoris',
                isFavorite: false
            }
        });
        const svg = container.querySelector('svg');
        expect(svg).toHaveClass('text-gray-400');
    });

    it('devrait appliquer la taille correcte', () => {
        const { container } = render(IconButton, {
            props: {
                ariaLabel: 'Ajouter aux favoris',
                size: 'lg'
            }
        });

        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg?.classList.toString()).toContain('h-8');
        expect(svg?.classList.toString()).toContain('w-8');
    });

    it('devrait déclencher l\'événement click', async () => {
        let clicked = false;
        const { container } = render(IconButton, {
            props: {
                ariaLabel: 'Ajouter aux favoris',
                onClick: () => clicked = true
            }
        });

        const button = container.querySelector('button');
        expect(button).toBeInTheDocument();
        await fireEvent.click(button as HTMLElement);
        expect(clicked).toBe(true);
    });

    it('devrait avoir les transitions et animations correctes', () => {
        const { container } = render(IconButton, {
            props: {
                ariaLabel: 'Ajouter aux favoris'
            }
        });

        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg?.classList.toString()).toContain('transition-all');
        expect(svg?.classList.toString()).toContain('duration-300');
        expect(svg?.classList.toString()).toContain('ease-out');
    });
}); 