/**
 * Type représentant un ingrédient
 */
export interface Ingredient {
	id: number;
	nom: string;
}

/**
 * Type représentant une recette
 */
export interface Recipe {
	id: number;
	nom: string;
	description: string;
	image: string;
	temps_preparation: number;
	temps_cuisson: number;
	difficulte: 'Facile' | 'Moyen' | 'Difficile';
	ingredients: {
		ingredient: Ingredient;
		quantite: number;
		unite?: string;
	}[];
	etapes: string[];
	allergenes?: string[];
	categorie: string;
	tags: string[];
	favoris?: boolean;
}

/**
 * Type représentant la réponse de l'API
 */
export interface RecipeResponse {
	ingredients: Ingredient[];
	recettes: Recipe[];
} 