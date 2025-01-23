import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import FilterGroup from './FilterGroup.svelte';

describe('FilterGroup', () => {
    const mockItems = ['japonais', 'vegetarien', 'epice'];

    it('devrait rendre correctement le groupe de filtres', () => {
        const { getByText, getAllByRole } = render(FilterGroup, {
            props: {
                title: 'Catégories',
                items: mockItems,
                selected: []
            }
        });

        expect(getByText('Catégories')).toBeInTheDocument();
        const checkboxes = getAllByRole('checkbox');
        expect(checkboxes).toHaveLength(mockItems.length);
        checkboxes.forEach((checkbox, index) => {
            expect(checkbox).toHaveAttribute('aria-labelledby');
            expect(document.getElementById(checkbox.getAttribute('aria-labelledby'))).toHaveTextContent(mockItems[index]);
        });
    });

    it('devrait afficher les filtres avec leur état initial', () => {
        const selected = ['japonais'];
        const { getAllByRole } = render(FilterGroup, {
            props: {
                title: 'Catégories',
                items: mockItems,
                selected
            }
        });

        const checkboxes = getAllByRole('checkbox') as HTMLInputElement[];
        expect(checkboxes[0].checked).toBe(true);
        expect(checkboxes[1].checked).toBe(false);
        expect(checkboxes[2].checked).toBe(false);
    });

    it('devrait émettre l\'événement change lors de la sélection d\'un filtre', async () => {
        const mockChange = vi.fn();
        const { getAllByRole, component } = render(FilterGroup, {
            props: {
                title: 'Catégories',
                items: mockItems,
                selected: []
            }
        });

        component.$on('change', (e) => mockChange(e.detail));
        const checkboxes = getAllByRole('checkbox');
        await fireEvent.click(checkboxes[0]);

        expect(mockChange).toHaveBeenCalledWith(['japonais']);
    });

    it('devrait gérer la désélection d\'un filtre', async () => {
        const mockChange = vi.fn();
        const { getAllByRole, component } = render(FilterGroup, {
            props: {
                title: 'Catégories',
                items: mockItems,
                selected: ['japonais', 'vegetarien']
            }
        });

        component.$on('change', (e) => mockChange(e.detail));
        const checkboxes = getAllByRole('checkbox');
        await fireEvent.click(checkboxes[0]);

        expect(mockChange).toHaveBeenCalledWith(['vegetarien']);
    });
}); 