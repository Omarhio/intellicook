<script lang="ts">
	export let recipe: {
		nom: string;
		image: string;
		ingredients: Array<{ nom: string; dosage: string }>;
	};
</script>

<li class="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-lg">
	<img
		src={recipe.image}
		alt={recipe.nom}
		class="h-32 w-32 rounded-lg object-cover"
	/>
	<div>
		<h3 class="title-font text-2xl text-[#F4ACB7]">{recipe.nom}</h3>
		<p class="mt-2 text-sm">
			<strong>Ingrédients :</strong>
			{recipe.ingredients.map((ing) => ing.nom).join(', ')}
		</p>
	</div>
</li> 