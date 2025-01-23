import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import type { RenderResult } from '@testing-library/svelte';
import SearchInput from './SearchInput.svelte';

interface SearchInputProps {
    value?: string;
    placeholder?: string;
    id?: string;
}

describe('SearchInput', () => {
    it('devrait rendre correctement l\'input de recherche', () => {
        const props: SearchInputProps = {};
        const { getByPlaceholderText, getByRole } = render(SearchInput, { props });
        
        const input = getByPlaceholderText('Rechercher une recette...');
        expect(input).toBeTruthy();
        expect(input).toHaveAttribute('type', 'search');
        expect(input).toHaveAttribute('role', 'searchbox');
        expect(input).toHaveAttribute('aria-label', 'Rechercher une recette');
    });

    it('devrait accepter un placeholder personnalisé', () => {
        const props: SearchInputProps = { placeholder: 'Chercher...' };
        const { getByPlaceholderText } = render(SearchInput, { props });
        
        expect(getByPlaceholderText('Chercher...')).toBeTruthy();
    });

    it('devrait utiliser l\'id fourni', () => {
        const props: SearchInputProps = { id: 'custom-search' };
        const { container } = render(SearchInput, { props });
        
        const input = container.querySelector('#custom-search');
        expect(input).toBeTruthy();
    });

    it('devrait mettre à jour la valeur lors de la saisie', async () => {
        const props: SearchInputProps = {};
        const { getByRole } = render(SearchInput, { props });
        const input = getByRole('searchbox') as HTMLInputElement;
        
        await fireEvent.input(input, { target: { value: 'sushi' } });
        expect(input.value).toBe('sushi');
    });

    it('devrait émettre l\'événement input avec la nouvelle valeur', async () => {
        const handleInput = vi.fn();
        const props: SearchInputProps = {};
        const { getByRole, component } = render(SearchInput, { props });
        
        component.$on('input', (e) => handleInput(e.detail));
        const input = getByRole('searchbox');
        await fireEvent.input(input, { target: { value: 'ramen' } });
        
        expect(handleInput).toHaveBeenCalledWith('ramen');
    });

    it('devrait afficher le bouton clear quand il y a une valeur', async () => {
        const props: SearchInputProps = { value: 'sushi' };
        const { getByRole } = render(SearchInput, { props });
        
        const clearButton = getByRole('button', { name: 'Effacer la recherche' });
        expect(clearButton).toBeTruthy();
    });

    it('ne devrait pas afficher le bouton clear quand la valeur est vide', () => {
        const props: SearchInputProps = { value: '' };
        const { queryByRole } = render(SearchInput, { props });
        
        const clearButton = queryByRole('button', { name: 'Effacer la recherche' });
        expect(clearButton).toBeNull();
    });

    it('devrait effacer l\'input et émettre les événements lors du clic sur clear', async () => {
        const handleClear = vi.fn();
        const handleInput = vi.fn();
        const props: SearchInputProps = { value: 'sushi' };
        const { getByRole, component } = render(SearchInput, { props });
        
        component.$on('clear', handleClear);
        component.$on('input', (e) => handleInput(e.detail));
        
        const clearButton = getByRole('button', { name: 'Effacer la recherche' });
        await fireEvent.click(clearButton);
        
        const input = getByRole('searchbox') as HTMLInputElement;
        expect(input.value).toBe('');
        expect(handleClear).toHaveBeenCalled();
        expect(handleInput).toHaveBeenCalledWith('');
    });

    it('devrait avoir les styles de transition corrects', () => {
        const { getByRole } = render(SearchInput);
        const input = getByRole('searchbox');
        
        expect(input.classList.toString()).toContain('transition-all');
        expect(input.classList.toString()).toContain('duration-200');
    });
}); 