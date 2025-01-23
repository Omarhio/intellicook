import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import type { RenderResult } from '@testing-library/svelte';
import CloseButton from './CloseButton.svelte';

interface CloseButtonProps {
    className?: string;
    ariaLabel?: string;
    position?: 'absolute' | 'relative';
}

describe('CloseButton', () => {
    it('devrait rendre le bouton avec les props par défaut', () => {
        const { getByRole } = render(CloseButton, {});
        const button = getByRole('button');
        
        expect(button).toBeTruthy();
        expect(button).toHaveAttribute('aria-label', 'Fermer');
        expect(button.classList.toString()).toContain('absolute');
        expect(button.classList.toString()).toContain('right-4');
        expect(button.classList.toString()).toContain('top-4');
    });

    it('devrait appliquer la classe personnalisée', () => {
        const props: CloseButtonProps = { className: 'test-class' };
        const { getByRole } = render(CloseButton, { props });
        const button = getByRole('button');
        
        expect(button.classList.toString()).toContain('test-class');
    });

    it('devrait utiliser le aria-label personnalisé', () => {
        const props: CloseButtonProps = { ariaLabel: 'Fermer le modal' };
        const { getByRole } = render(CloseButton, { props });
        const button = getByRole('button');
        
        expect(button).toHaveAttribute('aria-label', 'Fermer le modal');
    });

    it('devrait appliquer la position relative', () => {
        const props: CloseButtonProps = { position: 'relative' };
        const { getByRole } = render(CloseButton, { props });
        const button = getByRole('button');
        
        expect(button.classList.toString()).not.toContain('absolute');
        expect(button.classList.toString()).not.toContain('right-4');
        expect(button.classList.toString()).not.toContain('top-4');
    });

    it('devrait déclencher l\'événement click', async () => {
        const handleClick = vi.fn();
        const { getByRole } = render(CloseButton, {});
        const button = getByRole('button');
        
        button.addEventListener('click', handleClick);
        await fireEvent.click(button);
        expect(handleClick).toHaveBeenCalled();
    });

    it('devrait avoir les transitions et animations correctes', () => {
        const { getByRole } = render(CloseButton, {});
        const button = getByRole('button');
        
        expect(button.classList.toString()).toContain('transition-colors');
        expect(button.classList.toString()).toContain('duration-200');
    });
}); 