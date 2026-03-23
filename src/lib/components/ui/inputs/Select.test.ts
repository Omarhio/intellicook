import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Select from './Select.svelte';

interface SelectProps {
    value?: string;
    options?: Array<{ value: string; label: string }>;
    placeholder?: string;
    label?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    onchange?: (e: Event) => void;
    onfocus?: (e: FocusEvent) => void;
    onblur?: (e: FocusEvent) => void;
}

describe('Select', () => {
    const defaultOptions = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
    ];

    it('devrait rendre correctement le select avec les props par défaut', () => {
        const { container } = render(Select, { props: { options: defaultOptions } });

        const select = container.querySelector('select');
        expect(select).toBeTruthy();
        expect(select?.value).toBe('');
        expect(select?.options.length).toBe(4); // placeholder + 3 options
    });

    it('devrait afficher le label quand il est fourni', () => {
        const { getByText, getByLabelText } = render(Select, {
            props: { label: 'Test Select', required: true, options: defaultOptions }
        });

        expect(getByText('Test Select')).toBeTruthy();
        expect(getByText('*')).toBeTruthy();
        expect(getByLabelText('Test Select *')).toBeTruthy();
    });

    it('devrait afficher le placeholder', () => {
        const { container } = render(Select, {
            props: { placeholder: 'Choose an option...', options: defaultOptions }
        });

        const select = container.querySelector('select');
        expect(select?.options[0].text).toBe('Choose an option...');
    });

    it('devrait être désactivé quand disabled est true', () => {
        const { container } = render(Select, {
            props: { disabled: true, options: defaultOptions }
        });

        const select = container.querySelector('select');
        expect(select?.disabled).toBe(true);
        expect(select?.classList.toString()).toContain('opacity-50');
        expect(select?.classList.toString()).toContain('cursor-not-allowed');
    });

    it('devrait afficher le message d\'erreur', () => {
        const { getByText, container } = render(Select, {
            props: { error: 'This field is required', options: defaultOptions }
        });

        const select = container.querySelector('select');
        expect(getByText('This field is required')).toBeTruthy();
        expect(select?.classList.toString()).toContain('border-red-400');
    });

    it('devrait rendre toutes les options', () => {
        const { container } = render(Select, { props: { options: defaultOptions } });

        const select = container.querySelector('select');
        const options = Array.from(select?.options || []).slice(1);

        expect(options.length).toBe(3);
        options.forEach((option, index) => {
            expect(option.value).toBe(defaultOptions[index].value);
            expect(option.text).toBe(defaultOptions[index].label);
        });
    });

    it('devrait mettre à jour la valeur lors de la sélection', async () => {
        const { container } = render(Select, { props: { options: defaultOptions } });

        const select = container.querySelector('select') as HTMLSelectElement;
        await fireEvent.change(select, { target: { value: 'option2' } });
        expect(select.value).toBe('option2');
    });

    it('devrait déclencher les événements appropriés', async () => {
        const handleChange = vi.fn();
        const handleFocus = vi.fn();
        const handleBlur = vi.fn();

        const { container } = render(Select, {
            props: { options: defaultOptions, onchange: handleChange, onfocus: handleFocus, onblur: handleBlur }
        });

        const select = container.querySelector('select') as HTMLSelectElement;

        await fireEvent.change(select, { target: { value: 'option1' } });
        expect(handleChange).toHaveBeenCalled();

        await fireEvent.focus(select);
        expect(handleFocus).toHaveBeenCalled();

        await fireEvent.blur(select);
        expect(handleBlur).toHaveBeenCalled();
    });

    it('devrait avoir les styles de transition corrects', () => {
        const { container } = render(Select, { props: { options: defaultOptions } });

        const select = container.querySelector('select');
        expect(select?.classList.toString()).toContain('transition-all');
        expect(select?.classList.toString()).toContain('duration-300');
    });

    it('devrait avoir l\'icône de flèche personnalisée', () => {
        const { container } = render(Select, { props: { options: defaultOptions } });

        const svg = container.querySelector('svg');
        expect(svg).toBeTruthy();
        expect(svg?.classList.toString()).toContain('transition-transform');
        expect(svg?.classList.toString()).toContain('duration-300');
    });
});
