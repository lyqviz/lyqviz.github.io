import { derived, readable, writable } from 'svelte/store';

export const content = writable([]);

export const selected = writable({
	sectionLabel: 'Challenge',
	section: 0,
	scene: 0,
	step: 0,
	index: 0,
});

export const theme = writable();
export const trigger = writable();

// Custom

export const showBackground = writable(true);
