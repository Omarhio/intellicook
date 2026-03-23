import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import TextInput from './TextInput.svelte';

interface TextInputProps {
    value?: string;
    type?: 'text' | 'email' | 'password' | 'search';
    placeholder?: string;
    label?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    oninput?: (e: Event) => void;
    onchange?: (e: Event) => void;
    onfocus?: (e: FocusEvent) => void;
    onblur?: (e: FocusEvent) => void;
}

describe('TextInput', () => {
    it('devrait rendre correctement l\'input avec les props par défaut', () => {
        const { getByRole } = render(TextInput, { props: {} });

        const input = getByRole('textbox') as HTMLInputElement;
        expect(input).toBeTruthy();
        expect(input).toHaveAttribute('type', 'text');
        expect(input.value).toBe('');
    });

    it('devrait afficher le label quand il est fourni', () => {
        const { getByText, getByLabelText } = render(TextInput, {
            props: { label: 'Test Input', required: true }
        });

        expect(getByText('Test Input')).toBeTruthy();
        expect(getByText('*')).toBeTruthy();
        expect(getByLabelText('Test Input *')).toBeTruthy();
    });

    it('devrait utiliser le type correct', () => {
        const { container } = render(TextInput, { props: { type: 'email' } });

        const input = container.querySelector('input');
        expect(input).toHaveAttribute('type', 'email');
    });

    it('devrait afficher le placeholder', () => {
        const { getByPlaceholderText } = render(TextInput, { props: { placeholder: 'Enter text...' } });

        expect(getByPlaceholderText('Enter text...')).toBeTruthy();
    });

    it('devrait être désactivé quand disabled est true', () => {
        const { getByRole } = render(TextInput, { props: { disabled: true } });

        const input = getByRole('textbox') as HTMLInputElement;
        expect(input.disabled).toBe(true);
        expect(input.classList.toString()).toContain('opacity-50');
        expect(input.classList.toString()).toContain('cursor-not-allowed');
    });

    it('devrait afficher le message d\'erreur', () => {
        const { getByText, getByRole } = render(TextInput, { props: { error: 'This field is required' } });

        const input = getByRole('textbox');
        expect(getByText('This field is required')).toBeTruthy();
        expect(input.classList.toString()).toContain('border-red-400');
    });

    it('devrait mettre à jour la valeur lors de la saisie', async () => {
        const { getByRole } = render(TextInput, { props: {} });

        const input = getByRole('textbox') as HTMLInputElement;
        await fireEvent.input(input, { target: { value: 'test value' } });
        expect(input.value).toBe('test value');
    });

    it('devrait déclencher les événements appropriés', async () => {
        const handleInput = vi.fn();
        const handleChange = vi.fn();
        const handleFocus = vi.fn();
        const handleBlur = vi.fn();

        const { getByRole } = render(TextInput, {
            props: {
                oninput: handleInput,
                onchange: handleChange,
                onfocus: handleFocus,
                onblur: handleBlur
            }
        });

        const input = getByRole('textbox');

        await fireEvent.input(input, { target: { value: 'test' } });
        expect(handleInput).toHaveBeenCalled();

        await fireEvent.change(input, { target: { value: 'test' } });
        expect(handleChange).toHaveBeenCalled();

        await fireEvent.focus(input);
        expect(handleFocus).toHaveBeenCalled();

        await fireEvent.blur(input);
        expect(handleBlur).toHaveBeenCalled();
    });

    it('devrait avoir les styles de transition corrects', () => {
        const { getByRole } = render(TextInput);
        const input = getByRole('textbox');

        expect(input.classList.toString()).toContain('transition-all');
        expect(input.classList.toString()).toContain('duration-300');
    });
});
