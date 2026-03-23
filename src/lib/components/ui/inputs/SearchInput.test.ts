import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import SearchInput from './SearchInput.svelte';

interface SearchInputProps {
    value?: string;
    placeholder?: string;
    id?: string;
    oninput?: (value: string) => void;
    onclear?: () => void;
}

describe('SearchInput', () => {
    it('devrait rendre correctement l\'input de recherche', () => {
        const { getByPlaceholderText } = render(SearchInput, { props: {} });

        const input = getByPlaceholderText('Rechercher une recette...');
        expect(input).toBeTruthy();
        expect(input).toHaveAttribute('type', 'search');
        expect(input).toHaveAttribute('aria-label', 'Rechercher une recette');
    });

    it('devrait accepter un placeholder personnalisé', () => {
        const { getByPlaceholderText } = render(SearchInput, {
            props: { placeholder: 'Chercher...' }
        });

        expect(getByPlaceholderText('Chercher...')).toBeTruthy();
    });

    it('devrait utiliser l\'id fourni', () => {
        const { container } = render(SearchInput, { props: { id: 'custom-search' } });

        const input = container.querySelector('#custom-search');
        expect(input).toBeTruthy();
    });

    it('devrait mettre à jour la valeur lors de la saisie', async () => {
        const { getByRole } = render(SearchInput, { props: {} });
        const input = getByRole('searchbox') as HTMLInputElement;

        await fireEvent.input(input, { target: { value: 'sushi' } });
        expect(input.value).toBe('sushi');
    });

    it('devrait appeler oninput avec la nouvelle valeur', async () => {
        const handleInput = vi.fn();
        const { getByRole } = render(SearchInput, { props: { oninput: handleInput } });

        const input = getByRole('searchbox');
        await fireEvent.input(input, { target: { value: 'ramen' } });

        expect(handleInput).toHaveBeenCalledWith('ramen');
    });

    it('devrait afficher le bouton clear quand il y a une valeur', () => {
        const { getByRole } = render(SearchInput, { props: { value: 'sushi' } });

        const clearButton = getByRole('button', { name: 'Effacer la recherche' });
        expect(clearButton).toBeTruthy();
    });

    it('ne devrait pas afficher le bouton clear quand la valeur est vide', () => {
        const { queryByRole } = render(SearchInput, { props: { value: '' } });

        const clearButton = queryByRole('button', { name: 'Effacer la recherche' });
        expect(clearButton).toBeNull();
    });

    it('devrait appeler onclear et vider l\'input lors du clic sur clear', async () => {
        const handleClear = vi.fn();
        const handleInput = vi.fn();
        const { getByRole } = render(SearchInput, {
            props: { value: 'sushi', onclear: handleClear, oninput: handleInput }
        });

        const clearButton = getByRole('button', { name: 'Effacer la recherche' });
        await fireEvent.click(clearButton);

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
