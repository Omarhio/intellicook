import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import type { RenderResult } from '@testing-library/svelte';
import Select from './Select.svelte';

interface SelectProps {
    value?: string;
    options?: Array<{ value: string; label: string }>;
    placeholder?: string;
    label?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
}

describe('Select', () => {
    const defaultOptions = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
    ];

    it('devrait rendre correctement le select avec les props par défaut', () => {
        const props: SelectProps = {
            options: defaultOptions
        };
        const { container } = render(Select, { props });
        
        const select = container.querySelector('select');
        expect(select).toBeTruthy();
        expect(select?.value).toBe('');
        expect(select?.options.length).toBe(4); // placeholder + 3 options
    });

    it('devrait afficher le label quand il est fourni', () => {
        const props: SelectProps = {
            label: 'Test Select',
            required: true,
            options: defaultOptions
        };
        const { getByText, getByLabelText } = render(Select, { props });
        
        expect(getByText('Test Select')).toBeTruthy();
        expect(getByText('*')).toBeTruthy();
        expect(getByLabelText('Test Select *')).toBeTruthy();
    });

    it('devrait afficher le placeholder', () => {
        const props: SelectProps = {
            placeholder: 'Choose an option...',
            options: defaultOptions
        };
        const { container } = render(Select, { props });
        
        const select = container.querySelector('select');
        expect(select?.options[0].text).toBe('Choose an option...');
    });

    it('devrait être désactivé quand disabled est true', () => {
        const props: SelectProps = {
            disabled: true,
            options: defaultOptions
        };
        const { container } = render(Select, { props });
        
        const select = container.querySelector('select');
        expect(select?.disabled).toBe(true);
        expect(select?.classList.toString()).toContain('opacity-50');
        expect(select?.classList.toString()).toContain('cursor-not-allowed');
    });

    it('devrait afficher le message d\'erreur', () => {
        const props: SelectProps = {
            error: 'This field is required',
            options: defaultOptions
        };
        const { getByText, container } = render(Select, { props });
        
        const select = container.querySelector('select');
        expect(getByText('This field is required')).toBeTruthy();
        expect(select?.classList.toString()).toContain('border-red-400');
    });

    it('devrait rendre toutes les options', () => {
        const props: SelectProps = {
            options: defaultOptions
        };
        const { container } = render(Select, { props });
        
        const select = container.querySelector('select');
        const options = Array.from(select?.options || []).slice(1); // Ignore placeholder
        
        expect(options.length).toBe(3);
        options.forEach((option, index) => {
            expect(option.value).toBe(defaultOptions[index].value);
            expect(option.text).toBe(defaultOptions[index].label);
        });
    });

    it('devrait mettre à jour la valeur lors de la sélection', async () => {
        const props: SelectProps = {
            options: defaultOptions
        };
        const { container } = render(Select, { props });
        
        const select = container.querySelector('select') as HTMLSelectElement;
        await fireEvent.change(select, { target: { value: 'option2' } });
        expect(select.value).toBe('option2');
    });

    it('devrait déclencher les événements appropriés', async () => {
        const handleChange = vi.fn();
        const handleFocus = vi.fn();
        const handleBlur = vi.fn();
        
        const props: SelectProps = {
            options: defaultOptions
        };
        const { container, component } = render(Select, { props });
        
        component.$on('change', handleChange);
        component.$on('focus', handleFocus);
        component.$on('blur', handleBlur);
        
        const select = container.querySelector('select') as HTMLSelectElement;
        
        await fireEvent.change(select, { target: { value: 'option1' } });
        expect(handleChange).toHaveBeenCalled();
        
        await fireEvent.focus(select);
        expect(handleFocus).toHaveBeenCalled();
        
        await fireEvent.blur(select);
        expect(handleBlur).toHaveBeenCalled();
    });

    it('devrait avoir les styles de transition corrects', () => {
        const props: SelectProps = {
            options: defaultOptions
        };
        const { container } = render(Select, { props });
        
        const select = container.querySelector('select');
        expect(select?.classList.toString()).toContain('transition-all');
        expect(select?.classList.toString()).toContain('duration-300');
    });

    it('devrait avoir l\'icône de flèche personnalisée', () => {
        const props: SelectProps = {
            options: defaultOptions
        };
        const { container } = render(Select, { props });
        
        const svg = container.querySelector('svg');
        expect(svg).toBeTruthy();
        expect(svg?.classList.toString()).toContain('transition-transform');
        expect(svg?.classList.toString()).toContain('duration-300');
    });
}); 