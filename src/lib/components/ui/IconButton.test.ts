import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import IconButton from './IconButton.svelte';

describe('IconButton', () => {
    it('devrait rendre le bouton avec les props par défaut', () => {
        const { getByRole } = render(IconButton, {
            props: {
                ariaLabel: 'Ajouter aux favoris'
            }
        });

        const button = getByRole('button');
        expect(button).toBeTruthy();
        expect(button).toHaveAttribute('aria-label', 'Ajouter aux favoris');
    });

    it('devrait appliquer la classe correcte selon l\'état favori', () => {
        const { getByRole } = render(IconButton, {
            props: {
                ariaLabel: 'Ajouter aux favoris',
                isFavorite: true
            }
        });

        const button = getByRole('button');
        const svg = button.querySelector('svg');
        expect(svg).toBeTruthy();
        expect(svg?.classList.toString()).toContain('text-[#FF6B8B]');
    });

    it('devrait rendre le cœur vide quand isFavorite est false', () => {
        const { getByRole } = render(IconButton, {
            props: {
                ariaLabel: 'Ajouter aux favoris',
                isFavorite: false
            }
        });
        
        const button = getByRole('button');
        const svg = button.querySelector('svg');
        expect(svg).toBeTruthy();
        expect(svg?.classList.toString()).toContain('text-white/90');
    });

    it('devrait appliquer la taille correcte', () => {
        const { getByRole } = render(IconButton, {
            props: {
                ariaLabel: 'Ajouter aux favoris',
                size: 'lg'
            }
        });

        const button = getByRole('button');
        const svg = button.querySelector('svg');
        expect(svg).toBeTruthy();
        expect(svg?.classList.toString()).toContain('h-8');
        expect(svg?.classList.toString()).toContain('w-8');
    });

    it('devrait déclencher l\'événement click', async () => {
        const handleClick = vi.fn();
        const { getByRole, component } = render(IconButton, {
            props: {
                ariaLabel: 'Ajouter aux favoris'
            }
        });

        const button = getByRole('button');
        button.addEventListener('click', handleClick);
        await fireEvent.click(button);
        expect(handleClick).toHaveBeenCalled();
    });

    it('devrait avoir les transitions et animations correctes', () => {
        const { getByRole } = render(IconButton, {
            props: {
                ariaLabel: 'Ajouter aux favoris'
            }
        });

        const button = getByRole('button');
        const svg = button.querySelector('svg');
        expect(svg).toBeTruthy();
        expect(svg?.classList.toString()).toContain('transition-all');
        expect(svg?.classList.toString()).toContain('duration-300');
        expect(svg?.classList.toString()).toContain('ease-out');
    });
}); 