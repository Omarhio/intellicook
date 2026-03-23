<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { quintOut, elasticOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import type { Recipe } from '$lib/types/Recipe';

	let {
		items = [],
		currentIndex = $bindable(0),
		autoplayInterval = 5000
	}: {
		items?: Recipe[];
		currentIndex?: number;
		autoplayInterval?: number;
	} = $props();

	let interval: number;
	let direction = $state(1);
	let isPaused = $state(false);
	let imgErrors = $state<Record<number, boolean>>({});
	const defaultImage = '/images/recipe-placeholder.webp';

	const [send, receive] = crossfade({
		duration: 600,
		easing: elasticOut,
		fallback(node) {
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
		if (!isPaused) {
			interval = window.setInterval(() => {
				handleNext();
			}, autoplayInterval);
		}
	}

	function stopAutoSlide() {
		if (interval) {
			window.clearInterval(interval);
			interval = undefined;
		}
	}

	function handlePrevious() {
		direction = -1;
		stopAutoSlide();
		currentIndex = (currentIndex - 1 + items.length) % items.length;
		startAutoSlide();
	}

	function handleNext() {
		direction = 1;
		stopAutoSlide();
		currentIndex = (currentIndex + 1) % items.length;
		startAutoSlide();
	}

	function handleSelect(index: number) {
		direction = index > currentIndex ? 1 : -1;
		stopAutoSlide();
		currentIndex = index;
		startAutoSlide();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			handlePrevious();
		} else if (event.key === 'ArrowRight') {
			handleNext();
		} else if (event.key === ' ') {
			event.preventDefault();
			togglePause();
		}
	}

	function togglePause() {
		isPaused = !isPaused;
		if (isPaused) {
			stopAutoSlide();
		} else {
			startAutoSlide();
		}
	}

	let previousIndex = $derived((currentIndex - 1 + items.length) % items.length);
	let nextIndex = $derived((currentIndex + 1) % items.length);
</script>

<div
	class="mx-auto mt-10 w-full max-w-6xl"
	role="region"
	aria-roledescription="carousel"
	aria-label="Carousel de recettes"
	onkeydown={handleKeydown}
	tabindex="0"
>
	{#if items.length > 0}
		<div class="relative">
			<div class="absolute left-0 right-0 top-0 z-20 flex justify-between px-4">
				<button
					type="button"
					class="rounded-full bg-white/80 p-2 text-[#F4ACB7] shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
					onclick={togglePause}
					aria-label={isPaused
						? 'Reprendre le défilement automatique'
						: 'Mettre en pause le défilement automatique'}
				>
					{#if isPaused}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
							/>
						</svg>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					{/if}
				</button>
			</div>

			<button
				type="button"
				class="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#F4ACB7]"
				onclick={handlePrevious}
				aria-label="Recette précédente"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="#F4ACB7"
					class="h-6 w-6"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>

			<div class="flex items-center justify-center gap-8 px-20" role="presentation">
				<button
					type="button"
					class="relative aspect-video w-80 cursor-pointer overflow-hidden rounded-lg opacity-50 transition-all duration-300 hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#F4ACB7]"
					onclick={handlePrevious}
					aria-label="Voir la recette précédente : {items[previousIndex].nom}"
				>
					<div in:receive={{ key: previousIndex }} out:send={{ key: previousIndex }}>
						<img
							src={imgErrors[previousIndex] ? defaultImage : items[previousIndex].image}
							alt=""
							class="h-full w-full transform object-cover transition-transform duration-300 hover:scale-110"
							onerror={() => (imgErrors[previousIndex] = true)}
						/>
						<div
							class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4"
						>
							<h3 class="text-sm font-bold text-white">{items[previousIndex].nom}</h3>
						</div>
					</div>
				</button>

				<div
					class="relative aspect-video w-96 scale-110 overflow-hidden rounded-lg shadow-xl transition-all duration-500"
					role="group"
					aria-label="Recette actuelle : {items[currentIndex].nom}"
				>
					<div in:receive={{ key: currentIndex }} out:send={{ key: currentIndex }}>
						<img
							src={imgErrors[currentIndex] ? defaultImage : items[currentIndex].image}
							alt=""
							class="h-full w-full transform object-cover transition-transform duration-500 hover:scale-110"
							onerror={() => (imgErrors[currentIndex] = true)}
						/>
						<div
							class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4"
						>
							<h3 class="text-xl font-bold text-white">{items[currentIndex].nom}</h3>
						</div>
					</div>
				</div>

				<button
					type="button"
					class="relative aspect-video w-80 cursor-pointer overflow-hidden rounded-lg opacity-50 transition-all duration-300 hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#F4ACB7]"
					onclick={handleNext}
					aria-label="Voir la recette suivante : {items[nextIndex].nom}"
				>
					<div in:receive={{ key: nextIndex }} out:send={{ key: nextIndex }}>
						<img
							src={imgErrors[nextIndex] ? defaultImage : items[nextIndex].image}
							alt=""
							class="h-full w-full transform object-cover transition-transform duration-300 hover:scale-110"
							onerror={() => (imgErrors[nextIndex] = true)}
						/>
						<div
							class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4"
						>
							<h3 class="text-sm font-bold text-white">{items[nextIndex].nom}</h3>
						</div>
					</div>
				</button>
			</div>

			<button
				type="button"
				class="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#F4ACB7]"
				onclick={handleNext}
				aria-label="Recette suivante"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="#F4ACB7"
					class="h-6 w-6"
					aria-hidden="true"
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

		<div class="mt-4 flex justify-center space-x-2" role="tablist">
			{#each items as _, i}
				<button
					type="button"
					class="h-2 w-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#F4ACB7] {i === currentIndex
						? 'bg-[#F4ACB7]'
						: 'bg-[#F4ACB7]/30 hover:bg-[#F4ACB7]/50'}"
					onclick={() => handleSelect(i)}
					aria-label="Voir la recette {items[i].nom}"
					aria-selected={i === currentIndex}
					role="tab"
				/>
			{/each}
		</div>
	{:else}
		<p class="text-center text-lg text-[#9D8189]">Aucune recette à afficher</p>
	{/if}
</div>

<style>
	button {
		-webkit-tap-highlight-color: transparent;
	}
</style>
