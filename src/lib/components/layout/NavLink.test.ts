import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import type { RenderResult } from '@testing-library/svelte';
import NavLink from './NavLink.svelte';

interface NavLinkProps {
    href?: string;
    label: string;
    icon: string;
    isActive?: boolean;
    isMobile?: boolean;
    onClick?: () => void;
}

describe('NavLink', () => {
    const defaultProps: NavLinkProps = {
        label: 'Accueil',
        icon: '/icons/home.svg'
    };

    it('devrait rendre correctement le lien en version desktop', () => {
        const props = { ...defaultProps };
        const { container, getByText, getByAltText } = render(NavLink, { props });
        
        const link = container.querySelector('a');
        const span = getByText('Accueil');
        const icon = getByAltText('Accueil');
        
        expect(link).toBeTruthy();
        expect(link?.getAttribute('href')).toBe('/');
        expect(span).toBeTruthy();
        expect(icon).toBeTruthy();
        expect(icon.classList.toString()).toContain('icon-kawaii-desktop');
    });

    it('devrait rendre correctement le lien en version mobile', () => {
        const props = { ...defaultProps, isMobile: true };
        const { container, getByText, getAllByAltText } = render(NavLink, { props });
        
        const link = container.querySelector('a');
        const span = getByText('Accueil');
        const icons = getAllByAltText('Accueil');
        
        expect(link).toBeTruthy();
        expect(span).toBeTruthy();
        expect(icons).toHaveLength(2);
        expect(icons[0].classList.toString()).toContain('icon-kawaii');
    });

    it('devrait appliquer les styles actifs quand isActive est true', () => {
        const props = { ...defaultProps, isActive: true };
        const { container } = render(NavLink, { props });
        
        const link = container.querySelector('a');
        expect(link?.classList.toString()).toContain('font-bold');
        expect(link?.classList.toString()).toContain('underline');
    });

    it('devrait utiliser le href personnalisé', () => {
        const props = { ...defaultProps, href: '/recettes' };
        const { container } = render(NavLink, { props });
        
        const link = container.querySelector('a');
        expect(link?.getAttribute('href')).toBe('/recettes');
    });

    it('devrait appeler onClick en version mobile', async () => {
        const handleClick = vi.fn();
        const props = { ...defaultProps, isMobile: true, onclick: handleClick };
        const { container } = render(NavLink, { props });
        
        const link = container.querySelector('a');
        await fireEvent.click(link as HTMLElement);
        
        expect(handleClick).toHaveBeenCalled();
    });

    it('ne devrait pas avoir onClick en version desktop', () => {
        const handleClick = vi.fn();
        const props = { ...defaultProps, onClick: handleClick };
        const { container } = render(NavLink, { props });
        
        const link = container.querySelector('a');
        expect(link?.getAttribute('on:click')).toBeNull();
    });
}); 