import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import type { RenderResult } from '@testing-library/svelte';
import Text from './Text.svelte';

interface TextProps {
    variant?: 'title' | 'body';
    size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
    color?: string;
}

describe('Text', () => {
    it('devrait rendre correctement le texte avec les props par défaut', () => {
        const props: TextProps = {};
        const { container } = render(Text, { props });
        
        const span = container.querySelector('span');
        expect(span).toBeTruthy();
        expect(span?.classList.toString()).toContain('font-body');
        expect(span?.classList.toString()).toContain('text-base');
    });

    it('devrait appliquer la variante title', () => {
        const props: TextProps = {
            variant: 'title'
        };
        const { container } = render(Text, { props });
        
        const span = container.querySelector('span');
        expect(span?.classList.toString()).toContain('font-title');
    });

    it('devrait appliquer la taille correcte', () => {
        const sizes: Array<TextProps['size']> = ['sm', 'base', 'lg', 'xl', '2xl'];
        
        sizes.forEach(size => {
            const props: TextProps = { size };
            const { container } = render(Text, { props });
            
            const span = container.querySelector('span');
            expect(span?.classList.toString()).toContain(`text-${size}`);
        });
    });

    it('devrait appliquer la couleur personnalisée', () => {
        const props: TextProps = {
            color: 'text-red-500'
        };
        const { container } = render(Text, { props });
        
        const span = container.querySelector('span');
        expect(span?.classList.toString()).toContain('text-red-500');
    });

    it('devrait rendre le contenu dans le slot', () => {
        const { getByText } = render(Text, {
            props: {},
            slots: {
                default: 'Test Content'
            }
        });
        
        expect(getByText('Test Content')).toBeTruthy();
    });
}); 