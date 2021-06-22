import { selected } from './stores.js';

export function handleIntersections(entries, observer) {
	entries.forEach(function (entry) {
		if (!entry.isIntersecting) return;

		const dataId = entry.target.getAttribute('data-intersection-id');
		const dataIndex = entry.target.getAttribute('data-intersection-index');
		const dataSection = entry.target.getAttribute(
			'data-intersection-section'
		);

		const [section, scene, step] = dataId.split('/');

		selected.set({
			id: dataId,
			sectionLabel: dataSection,
			section: section ? Number(section) : null,
			scene: scene ? Number(scene) : null,
			step: step ? Number(step) : null,
			index: Number(dataIndex),
		});
	});
}
