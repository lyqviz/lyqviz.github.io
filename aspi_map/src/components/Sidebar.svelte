<script>
	export let selected;
	export let tooltip;

	$: t = tooltip || {};

	const close = () => {
		selected = null;
	};
</script>

<div class="sidebar">
	<div class="sidebar__detail {tooltip ? 'visible' : ''}">
		<div class="sidebar__country">{t.title || ''}</div>

		<div class="sidebar__close" on:click={close}>
			<svg
				width="30"
				height="30"
				viewBox="0 0 30 30"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M6 6L24 24" stroke="#7e868b" />
				<path d="M24 6L6 24" stroke="#7e868b" />
			</svg>
		</div>

		{#if t.status === 'yes'}
			<div class="sidebar__sections">
				<div class="sidebar__sections">
					<div class="sidebar__section">
						<div class="sidebar__section__label">Year Started</div>
						<div class="sidebar__section__content">
							{t.year_started || ''}
						</div>
					</div>

					<div class="sidebar__section">
						<div class="sidebar__section__label">Sectors</div>
						<div class="sidebar__section__content">
							{t.sectors || ''}
						</div>
					</div>

					<div class="sidebar__section">
						<div class="sidebar__section__label">GHGs</div>
						<div class="sidebar__section__content">
							{t.ghgs || ''}
						</div>
					</div>

					<div class="sidebar__section">
						<div class="sidebar__section__label">
							Inclusion Threshold
						</div>
						<div class="sidebar__section__content">
							{t.inclusion_thresholds || ''}
						</div>
					</div>

					<div class="sidebar__section">
						<div class="sidebar__section__label">Entities</div>
						<div class="sidebar__section__content">
							{t.entities || ''}
						</div>
					</div>

					<div class="sidebar__section">
						<div class="sidebar__section__label">Emissions Cap</div>
						<div class="sidebar__section__content">
							{t.emissions_cap || ''}
						</div>
					</div>

					<div class="sidebar__section">
						<div class="sidebar__section__label">
							Coverage of National Emissions
						</div>
						<div class="sidebar__section__content">
							{t.coverage || ''}
						</div>
					</div>
				</div>

				<div class="learn__more">
					<a class="learn__more__button" href={t.link}>Learn More</a>
				</div>
			</div>
		{/if}

		{#if t.notes}
			<div class="sidebar__notes">
				{#each t.notes as bullet}
					<div class="sidebar__section">
						<span class="sidebar__section__content sidebar__bullet"
							>{bullet || ''}</span
						>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.sidebar {
		position: absolute;
		z-index: 9999;
		top: 320px;
		left: 0;
	}

	.sidebar__detail {
		width: 100%;
		max-width: 288px;
		padding: 24px;

		transition: opacity .5s;
		pointer-events: none;

		opacity: 0;
		border: 1px solid #ececec;
		background: #f9f9f9;
		box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .15);
	}

	.sidebar__detail.visible {
		pointer-events: all;

		opacity: 1;
	}

	.sidebar__navigation {
		position: absolute;
		z-index: 9999;
		right: 30px;
		bottom: 30px;

		width: 100%;
		max-width: 300px;

		background: #acb693;
	}

	.sidebar__close {
		position: absolute;
		top: 24px;
		right: 24px;

		width: 30px;
		height: 30px;
	}

	.sidebar__country {
		font-size: 18px;
		font-weight: 700;
		line-height: 24px;
		/* height: 30px; */

		margin: 0 0 12px 0;
	}

	.sidebar__section {
		display: flex;
		/* margin: 0 0 18px 0; */

		padding: 6px 0 9px 0;

		border-top: 1px solid rgba(0, 0, 0, .2);
	}

	.sidebar__section__label {
		font-size: 14px;
		font-weight: 600;
		/* line-height: 18px; */

		flex: 0 0 96px;

		padding: 0 18px 0 0;
	}

	.sidebar__section__content {
		font-size: 14px;
		/* line-height: 18px; */

		color: rgba(0, 0, 0, .75);
	}

	.sidebar__bullet {
		position: relative;

		padding: 0 16px 0 24px;
	}

	.sidebar__bullet::before {
		position: absolute;
		top: 6px;
		left: 0;

		width: 6px;
		height: 6px;

		content: ' ';

		border-radius: 6px;
		background: #000;
	}

	.sidebar__notes:last-child {
		border-bottom: 1px solid rgba(0, 0, 0, .2);
	}

	.learn__more__button {
		font-size: 14px;
		font-weight: 700;
		line-height: 30px;

		display: block;

		box-sizing: border-box;
		width: 100%;
		height: 36px;
		margin: 0;
		padding: 0;

		text-align: center;
		text-decoration: none;

		color: #000;
		border: 3px solid;
		outline: 0;
	}

	.sidebar__navigation__country {
		line-height: 36px;

		height: 36px;
		padding: 0 30px;

		border-bottom: 1px solid rgba(0, 0, 0, .5);
	}

</style>
