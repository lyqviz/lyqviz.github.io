<script>
	import { goToTop, scrollTo } from '../js/scrollTo.js';

	import { content, selected, showBackground } from '../stores.js';

	const toggleBackground = () => {
		showBackground.update((sB) => !sB);
	};
</script>

<header>
	<div class="header__content">
		<a href="#!section-cover"><div class="navigation__logo" /></a>

		<nav class="navigation">
			{#each $content as section, index}
				{#if section.toc}
					<a
						class="navigation__link
					{$selected.sectionLabel === section.label ? 'selected' : ''}"
						href="#!section-{section.id}">{section.label}</a
					>
				{/if}
			{/each}
		</nav>

		<div class="controls">
			<button
				class="toggle  {$showBackground ? 'selected' : 'unselected'}"
				on:click={toggleBackground}
			>
				<div class="toggle__control" />
				<span class="toggle__label">Behind the scenes</span>
			</button>
		</div>
	</div>
</header>
