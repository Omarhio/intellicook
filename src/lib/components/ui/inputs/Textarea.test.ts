import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Textarea from './Textarea.svelte';

describe('Textarea', () => {
    it('devrait rendre correctement le textarea avec les props par défaut', () => {
        const { container } = render(Textarea, { props: {} });

        const textarea = container.querySelector('textarea');
        expect(textarea).toBeTruthy();
        expect(textarea).toHaveAttribute('rows', '4');
        expect(textarea?.value).toBe('');
    });

    it('devrait afficher le label quand il est fourni', () => {
        const { getByText, getByLabelText } = render(Textarea, {
            props: { label: 'Test Textarea', required: true }
        });

        expect(getByText('Test Textarea')).toBeTruthy();
        expect(getByText('*')).toBeTruthy();
        expect(getByLabelText('Test Textarea *')).toBeTruthy();
    });

    it('devrait afficher le placeholder', () => {
        const { getByPlaceholderText } = render(Textarea, {
            props: { placeholder: 'Enter text...' }
        });

        expect(getByPlaceholderText('Enter text...')).toBeTruthy();
    });

    it('devrait être désactivé quand disabled est true', () => {
        const { container } = render(Textarea, { props: { disabled: true } });

        const textarea = container.querySelector('textarea');
        expect(textarea?.disabled).toBe(true);
        expect(textarea?.classList.toString()).toContain('opacity-50');
        expect(textarea?.classList.toString()).toContain('cursor-not-allowed');
    });

    it('devrait afficher le message d\'erreur', () => {
        const { getByText, container } = render(Textarea, {
            props: { error: 'This field is required' }
        });

        const textarea = container.querySelector('textarea');
        expect(getByText('This field is required')).toBeTruthy();
        expect(textarea?.classList.toString()).toContain('border-red-400');
    });

    it('devrait mettre à jour la valeur lors de la saisie', async () => {
        const { container } = render(Textarea, { props: {} });

        const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
        await fireEvent.input(textarea, { target: { value: 'test value' } });
        expect(textarea.value).toBe('test value');
    });

    it('devrait respecter le nombre de lignes spécifié', () => {
        const { container } = render(Textarea, { props: { rows: 6 } });

        const textarea = container.querySelector('textarea');
        expect(textarea).toHaveAttribute('rows', '6');
    });

    it('devrait afficher le nombre de caractères restants', () => {
        const { getByText } = render(Textarea, {
            props: { maxlength: 100, value: 'Hello' }
        });

        expect(getByText('95 caractères restants')).toBeTruthy();
    });

    it('devrait déclencher les événements appropriés', async () => {
        const handleInput = vi.fn();
        const handleChange = vi.fn();
        const handleFocus = vi.fn();
        const handleBlur = vi.fn();

        const { container } = render(Textarea, {
            props: {
                oninput: handleInput,
                onchange: handleChange,
                onfocus: handleFocus,
                onblur: handleBlur
            }
        });

        const textarea = container.querySelector('textarea') as HTMLTextAreaElement;

        await fireEvent.input(textarea, { target: { value: 'test' } });
        expect(handleInput).toHaveBeenCalled();

        await fireEvent.change(textarea, { target: { value: 'test' } });
        expect(handleChange).toHaveBeenCalled();

        await fireEvent.focus(textarea);
        expect(handleFocus).toHaveBeenCalled();

        await fireEvent.blur(textarea);
        expect(handleBlur).toHaveBeenCalled();
    });

    it('devrait avoir les styles de transition corrects', () => {
        const { container } = render(Textarea);
        const textarea = container.querySelector('textarea');

        expect(textarea?.classList.toString()).toContain('transition-all');
        expect(textarea?.classList.toString()).toContain('duration-300');
    });

    it('ne devrait pas afficher le compteur de caractères sans maxlength', () => {
        const { container } = render(Textarea);

        const counter = container.querySelector('p.text-xs');
        expect(counter).toBeNull();
    });
});
