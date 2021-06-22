<script>
	import { goToTop, scrollTo } from '../js/scrollTo.js';

	import { content, selected } from '../stores.js';
</script>

<div class="debug">
	<!-- <div class='debug__mock'></div> -->

	<div class="debug__framework">
		{#if $selected}
			Index: {$selected.index} Section {$selected.section} Scene {$selected.scene}
			Step {$selected.step}
		{/if}
	</div>
</div>
