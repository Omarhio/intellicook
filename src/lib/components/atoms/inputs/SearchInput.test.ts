import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import SearchInput from './SearchInput.svelte';

describe('SearchInput', () => {
    it('devrait rendre correctement l\'input de recherche', () => {
        const { getByPlaceholderText } = render(SearchInput);
        expect(getByPlaceholderText('Rechercher une recette...')).toBeTruthy();
    });

    it('devrait mettre à jour la valeur lors de la saisie', async () => {
        const { getByPlaceholderText } = render(SearchInput);
        const input = getByPlaceholderText('Rechercher une recette...') as HTMLInputElement;
        
        await fireEvent.input(input, { target: { value: 'sushi' } });
        expect(input.value).toBe('sushi');
    });

    it('devrait émettre l\'événement input avec la nouvelle valeur', async () => {
        const mockInput = vi.fn();
        const { getByPlaceholderText } = render(SearchInput);
        const input = getByPlaceholderText('Rechercher une recette...') as HTMLInputElement;

        input.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            mockInput(target.value);
        });
        await fireEvent.input(input, { target: { value: 'ramen' } });
        
        expect(mockInput).toHaveBeenCalledWith('ramen');
    });

    it('devrait effacer l\'input lors du clic sur le bouton clear', async () => {
        const { getByPlaceholderText, getByRole } = render(SearchInput);
        const input = getByPlaceholderText('Rechercher une recette...') as HTMLInputElement;
        
        await fireEvent.input(input, { target: { value: 'sushi' } });
        expect(input.value).toBe('sushi');

        const clearButton = getByRole('button');
        await fireEvent.click(clearButton);
        expect(input.value).toBe('');
    });
}); 