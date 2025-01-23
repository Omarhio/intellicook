import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import type { RenderResult } from '@testing-library/svelte';
import Textarea from './Textarea.svelte';

interface TextareaProps {
    value?: string;
    placeholder?: string;
    label?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    rows?: number;
    maxlength?: number;
}

describe('Textarea', () => {
    it('devrait rendre correctement le textarea avec les props par défaut', () => {
        const props: TextareaProps = {};
        const { container } = render(Textarea, { props });
        
        const textarea = container.querySelector('textarea');
        expect(textarea).toBeTruthy();
        expect(textarea).toHaveAttribute('rows', '4');
        expect(textarea?.value).toBe('');
    });

    it('devrait afficher le label quand il est fourni', () => {
        const props: TextareaProps = {
            label: 'Test Textarea',
            required: true
        };
        const { getByText, getByLabelText } = render(Textarea, { props });
        
        expect(getByText('Test Textarea')).toBeTruthy();
        expect(getByText('*')).toBeTruthy();
        expect(getByLabelText('Test Textarea *')).toBeTruthy();
    });

    it('devrait afficher le placeholder', () => {
        const props: TextareaProps = {
            placeholder: 'Enter text...'
        };
        const { getByPlaceholderText } = render(Textarea, { props });
        
        expect(getByPlaceholderText('Enter text...')).toBeTruthy();
    });

    it('devrait être désactivé quand disabled est true', () => {
        const props: TextareaProps = {
            disabled: true
        };
        const { container } = render(Textarea, { props });
        
        const textarea = container.querySelector('textarea');
        expect(textarea?.disabled).toBe(true);
        expect(textarea?.classList.toString()).toContain('opacity-50');
        expect(textarea?.classList.toString()).toContain('cursor-not-allowed');
    });

    it('devrait afficher le message d\'erreur', () => {
        const props: TextareaProps = {
            error: 'This field is required'
        };
        const { getByText, container } = render(Textarea, { props });
        
        const textarea = container.querySelector('textarea');
        expect(getByText('This field is required')).toBeTruthy();
        expect(textarea?.classList.toString()).toContain('border-red-400');
    });

    it('devrait mettre à jour la valeur lors de la saisie', async () => {
        const props: TextareaProps = {};
        const { container } = render(Textarea, { props });
        
        const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
        await fireEvent.input(textarea, { target: { value: 'test value' } });
        expect(textarea.value).toBe('test value');
    });

    it('devrait respecter le nombre de lignes spécifié', () => {
        const props: TextareaProps = {
            rows: 6
        };
        const { container } = render(Textarea, { props });
        
        const textarea = container.querySelector('textarea');
        expect(textarea).toHaveAttribute('rows', '6');
    });

    it('devrait afficher le nombre de caractères restants', async () => {
        const props: TextareaProps = {
            maxlength: 100,
            value: 'Hello'
        };
        const { getByText } = render(Textarea, { props });
        
        expect(getByText('95 caractères restants')).toBeTruthy();
    });

    it('devrait déclencher les événements appropriés', async () => {
        const handleInput = vi.fn();
        const handleChange = vi.fn();
        const handleFocus = vi.fn();
        const handleBlur = vi.fn();
        
        const { container, component } = render(Textarea);
        
        component.$on('input', handleInput);
        component.$on('change', handleChange);
        component.$on('focus', handleFocus);
        component.$on('blur', handleBlur);
        
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