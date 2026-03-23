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
    function loadFavorites(): number[] {
        const storedFavorites = localStorage.getItem('favorites');
        return storedFavorites ? JSON.parse(storedFavorites) : [];
    }

    function saveFavorites(favoriteIds: number[]) {
        localStorage.setItem('favorites', JSON.stringify(favoriteIds));
    }

    const { subscribe, set, update } = writable<RecipeStore>({
        ...initialState,
        favorites: []
    });

    return {
        subscribe,

        async loadRecipes() {
            try {
                const response = await fetch('/data/recipes.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: RecipeResponse = await response.json();

                if (!data || !Array.isArray(data.recettes)) {
                    throw new Error('Format de données invalide');
                }

                const validRecipes = data.recettes.filter(recipe => {
                    if (!recipe || typeof recipe !== 'object') {
                        console.warn('Recette invalide (null ou pas un objet)');
                        return false;
                    }

                    const requiredFields = {
                        id: recipe.id !== undefined && recipe.id !== null,
                        nom: typeof recipe.nom === 'string',
                        description: typeof recipe.description === 'string',
                        ingredients: Array.isArray(recipe.ingredients)
                    };

                    const isValid = Object.values(requiredFields).every(v => v);
                    if (!isValid) {
                        console.warn('Champs manquants dans la recette:', recipe.nom, requiredFields);
                        return false;
                    }

                    return true;
                });

                const favoriteIds = loadFavorites();

                const recipesWithFavorites = validRecipes.map(recipe => ({
                    ...recipe,
                    favoris: favoriteIds.includes(recipe.id)
                }));

                update(state => ({
                    ...state,
                    recipes: recipesWithFavorites,
                    filtered: recipesWithFavorites,
                    favorites: recipesWithFavorites.filter(r => r.favoris)
                }));
            } catch (error) {
                console.error('Erreur lors du chargement des recettes:', error);
                throw error;
            }
        },

        toggleFavorite(recipeId: number) {
            update(state => {
                const recipes = state.recipes.map(recipe =>
                    recipe.id === recipeId
                        ? { ...recipe, favoris: !recipe.favoris }
                        : recipe
                );
                const filtered = state.filtered.map(recipe =>
                    recipe.id === recipeId
                        ? { ...recipe, favoris: !recipe.favoris }
                        : recipe
                );
                const favorites = recipes.filter(r => r.favoris);

                saveFavorites(favorites.map(r => r.id));

                return { ...state, recipes, filtered, favorites };
            });
        },

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

function filterRecipes(state: RecipeStore): Recipe[] {
    return state.recipes.filter(recipe => {
        const matchesSearch = state.searchTerm === '' ||
            recipe.nom.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            recipe.description.toLowerCase().includes(state.searchTerm.toLowerCase());

        const matchesTags = state.selectedTags.length === 0 ||
            state.selectedTags.some(tag => recipe.tags.includes(tag));

        const matchesAllergens = state.selectedAllergens.length === 0 ||
            state.selectedAllergens.some(allergen =>
                recipe.allergenes?.includes(allergen)
            );

        return matchesSearch && matchesTags && matchesAllergens;
    });
}

export const recipeStore = createRecipeStore();

export const favorites = derived(
    recipeStore,
    $store => $store.favorites
);
