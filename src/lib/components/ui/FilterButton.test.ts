import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import type { RenderResult } from '@testing-library/svelte';
import FilterButton from './FilterButton.svelte';

interface FilterButtonProps {
    active?: boolean;
    label: string;
    className?: string;
    disabled?: boolean;
}

describe('FilterButton', () => {
    it('devrait rendre le bouton avec les props par défaut', () => {
        const props: FilterButtonProps = { label: 'Filtres' };
        const { getByRole } = render(FilterButton, { props });
        const button = getByRole('button');
        
        expect(button).toBeTruthy();
        expect(button).toHaveTextContent('Filtres');
        expect(button).toHaveAttribute('aria-pressed', 'false');
        expect(button.classList.toString()).toContain('bg-[#F4ACB7]');
    });

    it('devrait afficher le texte correct quand actif', () => {
        const props: FilterButtonProps = { 
            label: 'Filtres',
            active: true
        };
        const { getByRole } = render(FilterButton, { props });
        const button = getByRole('button');
        
        expect(button).toHaveTextContent('Fermer filtres');
        expect(button).toHaveAttribute('aria-pressed', 'true');
        expect(button.classList.toString()).toContain('bg-[#e690a0]');
    });

    it('devrait appliquer la classe personnalisée', () => {
        const props: FilterButtonProps = { 
            label: 'Filtres',
            className: 'test-class'
        };
        const { getByRole } = render(FilterButton, { props });
        const button = getByRole('button');
        
        expect(button.classList.toString()).toContain('test-class');
    });

    it('devrait être désactivé quand disabled est true', () => {
        const props: FilterButtonProps = { 
            label: 'Filtres',
            disabled: true
        };
        const { getByRole } = render(FilterButton, { props });
        const button = getByRole('button');
        
        expect(button).toBeDisabled();
        expect(button.classList.toString()).toContain('opacity-50');
        expect(button.classList.toString()).toContain('cursor-not-allowed');
    });

    it('devrait déclencher l\'événement click', async () => {
        const handleClick = vi.fn();
        const props: FilterButtonProps = { label: 'Filtres' };
        const { getByRole } = render(FilterButton, { props });
        const button = getByRole('button');
        
        button.addEventListener('click', handleClick);
        await fireEvent.click(button);
        expect(handleClick).toHaveBeenCalled();
    });

    it('ne devrait pas déclencher l\'événement click quand désactivé', async () => {
        const handleClick = vi.fn();
        const props: FilterButtonProps = { 
            label: 'Filtres',
            disabled: true
        };
        const { getByRole } = render(FilterButton, { props });
        const button = getByRole('button');
        
        button.addEventListener('click', handleClick);
        await fireEvent.click(button);
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('devrait avoir les transitions et animations correctes', () => {
        const props: FilterButtonProps = { label: 'Filtres' };
        const { getByRole } = render(FilterButton, { props });
        const button = getByRole('button');
        
        expect(button.classList.toString()).toContain('transition-colors');
        expect(button.classList.toString()).toContain('duration-200');
    });
}); 