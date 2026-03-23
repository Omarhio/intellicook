import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Heading from './Heading.svelte';

interface HeadingProps {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    color?: string;
}

describe('Heading', () => {
    it('devrait rendre correctement le heading avec les props par défaut', () => {
        const { container } = render(Heading, { props: {} });

        const h1 = container.querySelector('h1');
        expect(h1).toBeTruthy();
        expect(h1?.classList.toString()).toContain('font-title');
        expect(h1?.classList.toString()).toContain('text-4xl');
        expect(h1?.classList.toString()).toContain('md:text-5xl');
        expect(h1?.classList.toString()).toContain('text-[#9d8189]');
    });

    it('devrait rendre le bon niveau de heading', () => {
        const levels = [1, 2, 3, 4, 5, 6] as const;

        levels.forEach(level => {
            const { container } = render(Heading, { props: { level } });

            const heading = container.querySelector(`h${level}`);
            expect(heading).toBeTruthy();

            const sizeClasses: Record<number, string[]> = {
                1: ['text-4xl', 'md:text-5xl'],
                2: ['text-3xl', 'md:text-4xl'],
                3: ['text-2xl', 'md:text-3xl'],
                4: ['text-xl', 'md:text-2xl'],
                5: ['text-lg', 'md:text-xl'],
                6: ['text-base', 'md:text-lg']
            };

            sizeClasses[level].forEach(className => {
                expect(heading?.classList.toString()).toContain(className);
            });
        });
    });

    it('devrait appliquer la couleur personnalisée', () => {
        const { container } = render(Heading, { props: { color: 'text-red-500' } });

        const heading = container.querySelector('h1');
        expect(heading?.classList.toString()).toContain('text-red-500');
    });
});
