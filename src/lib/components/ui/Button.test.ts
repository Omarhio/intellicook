import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Button from './Button.svelte';

interface ButtonProps {
    variant?: 'primary' | 'secondary';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    className?: string;
}

describe('Button', () => {
    it('devrait rendre le bouton avec les props par défaut', () => {
        const { getByRole } = render(Button, {});
        const button = getByRole('button');
        
        expect(button).toBeTruthy();
        expect(button).toHaveAttribute('type', 'button');
        expect(button.classList.toString()).toContain('bg-[#F4ACB7]');
    });

    it('devrait appliquer la classe correcte pour la variante secondary', () => {
        const props: ButtonProps = { variant: 'secondary' };
        const { getByRole } = render(Button, { props });
        const button = getByRole('button');
        
        expect(button.classList.toString()).toContain('bg-gray-200');
    });

    it('devrait appliquer le type correct', () => {
        const props: ButtonProps = { type: 'submit' };
        const { getByRole } = render(Button, { props });
        const button = getByRole('button');
        
        expect(button).toHaveAttribute('type', 'submit');
    });

    it('devrait être désactivé quand disabled est true', () => {
        const props: ButtonProps = { disabled: true };
        const { getByRole } = render(Button, { props });
        const button = getByRole('button');
        
        expect(button).toBeDisabled();
    });

    it('devrait appliquer la classe personnalisée', () => {
        const props: ButtonProps = { className: 'test-class' };
        const { getByRole } = render(Button, { props });
        const button = getByRole('button');
        
        expect(button.classList.toString()).toContain('test-class');
    });

    it('devrait déclencher l\'événement click', async () => {
        const handleClick = vi.fn();
        const { getByRole } = render(Button, {});
        const button = getByRole('button');
        
        button.addEventListener('click', handleClick);
        await fireEvent.click(button);
        expect(handleClick).toHaveBeenCalled();
    });

    it('ne devrait pas déclencher l\'événement click quand désactivé', async () => {
        const handleClick = vi.fn();
        const props: ButtonProps = { disabled: true };
        const { getByRole } = render(Button, { props });
        const button = getByRole('button');

        await userEvent.click(button);
        expect(handleClick).not.toHaveBeenCalled();
    });
}); 