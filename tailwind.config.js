import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				title: ['Pacifico', 'cursive'], // Police pour les titres
				body: ['Noto Sans JP', 'sans-serif'], // Police pour le texte principal
			}
		}
	},

	plugins: [typography, forms, containerQueries]
};
