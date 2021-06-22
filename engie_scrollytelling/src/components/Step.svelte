<script>
	import { onMount } from 'svelte';

	import { handleIntersections } from '../intersection.js';
	import { content, selected, theme, trigger } from '../stores.js';

	import { getCurrentClass } from '../js/helpers.js';
	import { updateTheme } from '../js/theme.js';

	export let section;
	export let scene;
	export let step;

	let node;

	$: classes = step.style.join(' ');
	$: currentClass = getCurrentClass($selected.index, step.intersectionIndex);

	onMount(() => {
		const options = {
			threshold: 0,
		};

		const observer = new IntersectionObserver(handleIntersections, options);

		observer.observe(node);

		selected.subscribe((selected) => {
			if (selected.id === step.intersectionId) {
				trigger.set({
					scene: scene.index,
					trigger: step.trigger,
				});

				// theme.set(step.theme);
			}
		});
	});
</script>

<div
	bind:this={node}
	class="scene__step {classes} {currentClass}"
	data-intersection-id={step.intersectionId}
	data-intersection-index={step.intersectionIndex}
	data-intersection-section={section.label}
>
	<div class="scene__step__content">
		{#each step.content as content}
			{@html content}
		{/each}
	</div>
</div>
