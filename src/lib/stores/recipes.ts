import { writable, derived } from 'svelte/store';
import type { Recipe, RecipeResponse } from '$lib/types/Recipe';

interface RecipeStore {
    recipes: Recipe[];
    favorites: Recipe[];
    filtered: Recipe[];
    searchTerm: string;
    selectedTags: string[];
    selectedAllergens: string[];
}

const initialState: RecipeStore = {
    recipes: [],
    favorites: [],
    filtered: [],
    searchTerm: '',
    selectedTags: [],
    selectedAllergens: []
};

function createRecipeStore() {
    const { subscribe, set, update } = writable<RecipeStore>(initialState);

    return {
        subscribe,
        
        // Charge les recettes depuis le fichier JSON
        async loadRecipes() {
            try {
                const response = await fetch('/data/recipes.json');
                const data: RecipeResponse = await response.json();
                update(state => ({
                    ...state,
                    recipes: data.recettes,
                    filtered: data.recettes
                }));
            } catch (error) {
                console.error('Erreur lors du chargement des recettes:', error);
            }
        },

        // Gestion des favoris
        toggleFavorite(recipeId: number) {
            update(state => {
                const recipes = state.recipes.map(recipe => 
                    recipe.id === recipeId 
                        ? { ...recipe, favoris: !recipe.favoris }
                        : recipe
                );
                return {
                    ...state,
                    recipes,
                    filtered: state.filtered.map(recipe =>
                        recipe.id === recipeId
                            ? { ...recipe, favoris: !recipe.favoris }
                            : recipe
                    )
                };
            });
        },

        // Filtrage des recettes
        setSearchTerm(term: string) {
            update(state => ({
                ...state,
                searchTerm: term,
                filtered: filterRecipes({ ...state, searchTerm: term })
            }));
        },

        setSelectedTags(tags: string[]) {
            update(state => ({
                ...state,
                selectedTags: tags,
                filtered: filterRecipes({ ...state, selectedTags: tags })
            }));
        },

        setSelectedAllergens(allergens: string[]) {
            update(state => ({
                ...state,
                selectedAllergens: allergens,
                filtered: filterRecipes({ ...state, selectedAllergens: allergens })
            }));
        },

        // Réinitialisation des filtres
        resetFilters() {
            update(state => ({
                ...state,
                searchTerm: '',
                selectedTags: [],
                selectedAllergens: [],
                filtered: state.recipes
            }));
        }
    };
}

// Fonction utilitaire pour filtrer les recettes
function filterRecipes(state: RecipeStore): Recipe[] {
    return state.recipes.filter(recipe => {
        const matchesSearch = state.searchTerm === '' || 
            recipe.nom.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            recipe.description.toLowerCase().includes(state.searchTerm.toLowerCase());

        const matchesTags = state.selectedTags.length === 0 ||
            state.selectedTags.some(tag => recipe.tags.includes(tag));

        const matchesAllergens = state.selectedAllergens.length === 0 ||
            !state.selectedAllergens.some(allergen => 
                recipe.allergenes?.includes(allergen)
            );

        return matchesSearch && matchesTags && matchesAllergens;
    });
}

// Création du store principal
export const recipeStore = createRecipeStore();

// Store dérivé pour les favoris
export const favorites = derived(
    recipeStore,
    $store => $store.recipes.filter(recipe => recipe.favoris)
); 