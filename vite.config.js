import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],

	optimizeDeps: {
		include: ['svelte-hamburgers'] // Force l'inclusion de svelte-hamburgers pour éviter les problèmes
	},

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
