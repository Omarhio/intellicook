import { describe, it, expect } from 'vitest';
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
            const labelledBy = checkbox.getAttribute('aria-labelledby');
            if (labelledBy) {
                expect(document.getElementById(labelledBy)).toHaveTextContent(mockItems[index]);
            }
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

    it('devrait cocher une checkbox lors du clic', async () => {
        const { getAllByRole } = render(FilterGroup, {
            props: {
                title: 'Catégories',
                items: mockItems,
                selected: []
            }
        });

        const checkboxes = getAllByRole('checkbox') as HTMLInputElement[];
        await fireEvent.click(checkboxes[0]);
        expect(checkboxes[0].checked).toBe(true);
    });

    it('devrait décocher une checkbox déjà sélectionnée', async () => {
        const { getAllByRole } = render(FilterGroup, {
            props: {
                title: 'Catégories',
                items: mockItems,
                selected: ['japonais']
            }
        });

        const checkboxes = getAllByRole('checkbox') as HTMLInputElement[];
        expect(checkboxes[0].checked).toBe(true);
        await fireEvent.click(checkboxes[0]);
        expect(checkboxes[0].checked).toBe(false);
    });
});
