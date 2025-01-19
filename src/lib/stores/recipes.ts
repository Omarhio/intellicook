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
    // Charger les favoris depuis le localStorage
    function loadFavorites(): number[] {
        const storedFavorites = localStorage.getItem('favorites');
        const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
        console.log('Favoris chargés:', favorites);
        return favorites;
    }

    // Sauvegarder les favoris dans le localStorage
    function saveFavorites(favoriteIds: number[]) {
        console.log('Sauvegarde des favoris:', favoriteIds);
        localStorage.setItem('favorites', JSON.stringify(favoriteIds));
    }

    // Initialiser le store avec les favoris chargés
    const { subscribe, set, update } = writable<RecipeStore>({
        ...initialState,
        favorites: [] // Les favoris seront mis à jour lors du chargement des recettes
    });

    return {
        subscribe,
        
        // Charge les recettes depuis le fichier JSON
        async loadRecipes() {
            try {
                console.log('Chargement des recettes...');
                const response = await fetch('/data/recipes.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: RecipeResponse = await response.json();
                
                // Vérifier que les données sont valides
                if (!data || !Array.isArray(data.recettes)) {
                    throw new Error('Format de données invalide');
                }

                // Vérifier et nettoyer chaque recette
                const validRecipes = data.recettes.filter(recipe => {
                    // Vérifications de base
                    if (!recipe || typeof recipe !== 'object') {
                        console.warn('Recette invalide (null ou pas un objet)');
                        return false;
                    }

                    // Vérifier les champs requis
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

                // Charger les favoris depuis le localStorage
                const favoriteIds = loadFavorites();
                console.log('IDs des favoris chargés:', favoriteIds);
                
                const recipesWithFavorites = validRecipes.map(recipe => {
                    const isFavorite = favoriteIds.includes(recipe.id);
                    console.log(`Recette ${recipe.id} (${recipe.nom}) - Favorite: ${isFavorite}`);
                    return {
                        ...recipe,
                        favoris: isFavorite
                    };
                });

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

        // Gestion des favoris
        toggleFavorite(recipeId: number) {
            console.log('Toggle favori pour la recette:', recipeId);
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
                
                // Sauvegarder les favoris dans le localStorage
                const favoriteIds = favorites.map(r => r.id);
                console.log('Nouveaux favoris:', favoriteIds);
                saveFavorites(favoriteIds);

                return {
                    ...state,
                    recipes,
                    filtered,
                    favorites
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
    $store => $store.favorites
); 