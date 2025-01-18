<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import { quintOut, elasticOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import type { Recipe } from '$lib/types/Recipe';

	export let items: Recipe[] = [];
	export let currentIndex = 0;

	const dispatch = createEventDispatcher();
	let interval: number;
	let direction = 1;

	const [send, receive] = crossfade({
		duration: 600,
		easing: elasticOut,
		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t, u) => `
					transform: ${transform} translate(${direction * u * 100}%);
					opacity: ${t}
				`
			};
		}
	});

	onMount(() => {
		startAutoSlide();
	});

	onDestroy(() => {
		stopAutoSlide();
	});

	function startAutoSlide() {
		interval = window.setInterval(() => {
			handleNext();
		}, 5000);
	}

	function stopAutoSlide() {
		if (interval) {
			window.clearInterval(interval);
		}
	}

	function handlePrevious() {
		direction = -1;
		stopAutoSlide();
		currentIndex = (currentIndex - 1 + items.length) % items.length;
		dispatch('previous');
		startAutoSlide();
	}

	function handleNext() {
		direction = 1;
		stopAutoSlide();
		currentIndex = (currentIndex + 1) % items.length;
		dispatch('next');
		startAutoSlide();
	}

	function handleSelect(index: number) {
		direction = index > currentIndex ? 1 : -1;
		stopAutoSlide();
		currentIndex = index;
		dispatch('select', index);
		startAutoSlide();
	}

	$: previousIndex = (currentIndex - 1 + items.length) % items.length;
	$: nextIndex = (currentIndex + 1) % items.length;
</script>

<div class="mx-auto mt-10 w-full max-w-6xl">
	{#if items.length > 0}
		<div class="relative">
			<button
				class="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all hover:scale-110 hover:bg-gray-100"
				on:click={handlePrevious}
				aria-label="Recette précédente"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="#F4ACB7"
					class="h-6 w-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>

			<div class="flex items-center justify-center gap-8 px-20">
				<!-- Recette précédente -->
				<div
					class="relative aspect-video w-80 cursor-pointer overflow-hidden rounded-lg opacity-50 transition-all duration-300 hover:opacity-75"
					on:click={handlePrevious}
					in:receive={{key: previousIndex}}
					out:send={{key: previousIndex}}
				>
					<img
						src={items[previousIndex].image}
						alt={items[previousIndex].nom}
						class="h-full w-full transform object-cover transition-transform duration-300 hover:scale-110"
					/>
					<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
						<h3 class="text-sm font-bold text-white">{items[previousIndex].nom}</h3>
					</div>
				</div>

				<!-- Recette actuelle -->
				<div
					class="relative aspect-video w-96 scale-110 overflow-hidden rounded-lg shadow-xl transition-all duration-500"
					in:receive={{key: currentIndex}}
					out:send={{key: currentIndex}}
				>
					<img
						src={items[currentIndex].image}
						alt={items[currentIndex].nom}
						class="h-full w-full transform object-cover transition-transform duration-500 hover:scale-110"
					/>
					<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
						<h3 class="text-xl font-bold text-white">{items[currentIndex].nom}</h3>
					</div>
				</div>

				<!-- Recette suivante -->
				<div
					class="relative aspect-video w-80 cursor-pointer overflow-hidden rounded-lg opacity-50 transition-all duration-300 hover:opacity-75"
					on:click={handleNext}
					in:receive={{key: nextIndex}}
					out:send={{key: nextIndex}}
				>
					<img
						src={items[nextIndex].image}
						alt={items[nextIndex].nom}
						class="h-full w-full transform object-cover transition-transform duration-300 hover:scale-110"
					/>
					<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
						<h3 class="text-sm font-bold text-white">{items[nextIndex].nom}</h3>
					</div>
				</div>
			</div>

			<button
				class="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all hover:scale-110 hover:bg-gray-100"
				on:click={handleNext}
				aria-label="Recette suivante"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="#F4ACB7"
					class="h-6 w-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</button>
		</div>

		<div class="mt-4 flex justify-center gap-2">
			{#each items as _, i}
				<button
					class="h-3 w-3 rounded-full transition-all duration-300 {i === currentIndex ? 'scale-125 bg-[#F4ACB7]' : 'bg-gray-300 hover:scale-110 hover:bg-gray-400'}"
					on:click={() => handleSelect(i)}
					aria-label="Aller à la recette {i + 1}"
				></button>
			{/each}
		</div>
	{/if}
</div> 