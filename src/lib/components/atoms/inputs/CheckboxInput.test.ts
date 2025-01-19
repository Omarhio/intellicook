import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import CheckboxInput from './CheckboxInput.svelte';

describe('CheckboxInput', () => {
    it('devrait rendre correctement la checkbox avec son label', () => {
        const { getByLabelText } = render(CheckboxInput, {
            props: {
                label: 'Test Checkbox',
                value: 'test',
                group: []
            }
        });
        
        const checkbox = getByLabelText('Test Checkbox') as HTMLInputElement;
        expect(checkbox).toBeTruthy();
        expect(checkbox.checked).toBe(false);
    });

    it('devrait refléter l\'état checked quand la valeur est dans le groupe', () => {
        const { getByLabelText } = render(CheckboxInput, {
            props: {
                label: 'Test Checkbox',
                value: 'test',
                group: ['test']
            }
        });
        
        const checkbox = getByLabelText('Test Checkbox') as HTMLInputElement;
        expect(checkbox.checked).toBe(true);
    });

    it('devrait émettre l\'événement change lors du clic', async () => {
        const mockChange = vi.fn();
        const { getByLabelText } = render(CheckboxInput, {
            props: {
                label: 'Test Checkbox',
                value: 'test',
                group: []
            }
        });

        const checkbox = getByLabelText('Test Checkbox') as HTMLInputElement;
        checkbox.addEventListener('change', () => {
            mockChange(checkbox.checked);
        });

        await fireEvent.click(checkbox);
        expect(mockChange).toHaveBeenCalledWith(true);
    });

    it('devrait mettre à jour l\'état visuel lors du changement de groupe', async () => {
        const { getByLabelText, rerender } = render(CheckboxInput, {
            props: {
                label: 'Test Checkbox',
                value: 'test',
                group: []
            }
        });

        const checkbox = getByLabelText('Test Checkbox') as HTMLInputElement;
        expect(checkbox.checked).toBe(false);

        await rerender({ label: 'Test Checkbox', value: 'test', group: ['test'] });
        expect(checkbox.checked).toBe(true);
    });
}); 