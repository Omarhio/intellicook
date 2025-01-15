import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				title: ['Pacifico', 'cursive'],
				body: ['Noto Sans JP', 'sans-serif'],
			},
			transitionProperty: {
				// Active des transitions sur transform et autres propriétés
				transform: 'transform',
				all: 'all',
			},
			transitionDuration: {
				// Ajout de durées personnalisées
				DEFAULT: '300ms',
				'400': '400ms',
			},
			transitionTimingFunction: {
				DEFAULT: 'ease-in-out',
				'ease-in': 'ease-in',
				'ease-out': 'ease-out',
				'custom-smooth': 'cubic-bezier(0.25, 0.8, 0.5, 1)', // Courbe plus fluide
			},

			translate: {
				// Ajout de valeurs pour `translate`
				'-full': '-100%',
				'full': '100%',
				'-half': '-50%',
				'half': '50%',
			},
		},
		screens: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
		},
	},
	plugins: [typography, forms, containerQueries],
};
