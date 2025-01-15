import { writable } from 'svelte/store';

// Store pour contenir les recettes
export const recettes = writable([]);

// Fonction pour charger les recettes depuis recette.json
export async function getRecettes() {
    const res = await fetch('/recette.json');
    const data = await res.json();
    recettes.set(data.recettes); // Met à jour le store avec les recettes
    return data.recettes;
}
