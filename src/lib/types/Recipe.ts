export interface Ingredient {
	nom: string;
	dosage: string;
}

export interface Recipe {
	nom: string;
	image: string;
	ingredients: Ingredient[];
	etapes: string[];
	allergenes?: string[];
} 