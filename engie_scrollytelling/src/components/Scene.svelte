<script>
	import Hero from './Hero.svelte';
	import Step from './Step.svelte';

	import { onMount } from 'svelte';

	import { handleIntersections } from '../intersection.js';
	import { content, selected, theme, trigger } from '../stores.js';

	import { getCurrentClass } from '../js/helpers.js';
	import { updateTheme } from '../js/theme.js';

	export let section;
	export let scene;

	let node;

	$: classes = scene.style.join(' ');
	$: currentClass = getCurrentClass($selected.index, scene.intersectionIndex);

	onMount(() => {
		const options = {
			threshold: 0,
		};

		const observer = new IntersectionObserver(handleIntersections, options);

		observer.observe(node);

		selected.subscribe((selected) => {
			if (selected.id === scene.intersectionId) {
				trigger.set({
					scene: scene.index,
					trigger: scene.trigger,
				});

				// theme.set(scene.theme);
			}
		});
	});
</script>

<div
	bind:this={node}
	id={`scene-${scene.index}`}
	data-intersection-id={scene.intersectionId}
	data-intersection-index={scene.intersectionIndex}
	data-intersection-section={section.label}
	class="scene {classes} {currentClass}"
>
	{#if scene}
		<!-- <Hero {scene} /> -->

		<div class="scene__steps">
			{#each scene.steps as s}
				<Step {section} {scene} step={s} />
			{/each}
		</div>
	{/if}
</div>
