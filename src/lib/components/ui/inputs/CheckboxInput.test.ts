import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import CheckboxInput from './CheckboxInput.svelte';

interface CheckboxInputProps {
    label: string;
    value: string;
    group?: string[];
    id?: string;
    disabled?: boolean;
    className?: string;
}

describe('CheckboxInput', () => {
    it('devrait rendre correctement la checkbox avec son label', () => {
        const props: CheckboxInputProps = { label: 'Test Checkbox', value: 'test', group: [] };
        const { getByLabelText, getByRole } = render(CheckboxInput, { props });

        const checkbox = getByRole('checkbox') as HTMLInputElement;
        expect(checkbox).toBeTruthy();
        expect(checkbox).toHaveAttribute('type', 'checkbox');
        expect(checkbox.checked).toBe(false);
        expect(getByLabelText('Test Checkbox')).toBeTruthy();
    });

    it('devrait utiliser l\'id personnalisé', () => {
        const props: CheckboxInputProps = { label: 'Test', value: 'test', id: 'custom-checkbox' };
        const { container } = render(CheckboxInput, { props });

        const checkbox = container.querySelector('#custom-checkbox');
        expect(checkbox).toBeTruthy();
        expect(checkbox?.getAttribute('aria-labelledby')).toBe('custom-checkbox-label');
    });

    it('devrait refléter l\'état checked quand la valeur est dans le groupe', () => {
        const props: CheckboxInputProps = { label: 'Test', value: 'test', group: ['test'] };
        const { getByRole } = render(CheckboxInput, { props });

        const checkbox = getByRole('checkbox') as HTMLInputElement;
        expect(checkbox.checked).toBe(true);
    });

    it('devrait être désactivé quand disabled est true', () => {
        const props: CheckboxInputProps = { label: 'Test', value: 'test', disabled: true };
        const { getByRole } = render(CheckboxInput, { props });

        const checkbox = getByRole('checkbox') as HTMLInputElement;
        expect(checkbox.disabled).toBe(true);
        expect(checkbox.classList.toString()).toContain('opacity-50');
        expect(checkbox.classList.toString()).toContain('cursor-not-allowed');
    });

    it('devrait appliquer la classe personnalisée', () => {
        const props: CheckboxInputProps = { label: 'Test', value: 'test', className: 'test-class' };
        const { getByRole } = render(CheckboxInput, { props });

        const checkbox = getByRole('checkbox');
        expect(checkbox.classList.toString()).toContain('test-class');
    });

    it('devrait cocher la checkbox lors du clic', async () => {
        const props: CheckboxInputProps = { label: 'Test', value: 'test', group: [] };
        const { getByRole } = render(CheckboxInput, { props });

        const checkbox = getByRole('checkbox') as HTMLInputElement;
        await fireEvent.click(checkbox);
        expect(checkbox.checked).toBe(true);
    });

    it('devrait décocher la checkbox lors du second clic', async () => {
        const props: CheckboxInputProps = { label: 'Test', value: 'test', group: ['test'] };
        const { getByRole } = render(CheckboxInput, { props });

        const checkbox = getByRole('checkbox') as HTMLInputElement;
        expect(checkbox.checked).toBe(true);
        await fireEvent.click(checkbox);
        expect(checkbox.checked).toBe(false);
    });

    it('devrait avoir les styles de transition corrects', () => {
        const props: CheckboxInputProps = { label: 'Test', value: 'test' };
        const { getByRole } = render(CheckboxInput, { props });

        const checkbox = getByRole('checkbox');
        expect(checkbox.classList.toString()).toContain('transition-colors');
        expect(checkbox.classList.toString()).toContain('duration-200');
    });
});
