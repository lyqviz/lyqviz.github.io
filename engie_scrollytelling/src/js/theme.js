export function updateTheme(theme) {
	const classList = document.body.classList;

	if (classList.contains(theme)) return;

	classList.forEach((className) => {
		if (className.match(/^theme/)) {
			classList.remove(className);
		}
	});

	if (!theme) return;

	classList.add(`theme-${theme}`);
}
