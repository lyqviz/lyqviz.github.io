export function processData(sections) {
	let intersection = 0;

	return sections.map((section, sectionIndex) => {
		section.index = sectionIndex;

		section.intersectionId = `${section.index}`;
		section.intersectionIndex = intersection++;

		section.scenes = section.scenes.map((scene, sceneIndex) => {
			scene.index = sceneIndex;

			scene.intersectionId = `${section.index}/${scene.index}`;
			scene.intersectionIndex = intersection++;

			scene.steps = scene.steps.map((step, stepIndex) => {
				step.index = stepIndex;

				step.intersectionId = `${section.index}/${scene.index}/${step.index}`;
				step.intersectionIndex = intersection++;

				return step;
			});

			return scene;
		});

		return section;
	});
}
