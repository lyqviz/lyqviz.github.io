export function hydrateData(data) {
	let headers = data.values[0];

	return data.values.slice(1).map((row) => {
		const d = {};

		headers.forEach((h, i) => {
			d[h] = row[i] || null;
		});

		return d;
	});
}

export function processData(data) {
	return data.map((d) => {
		let label = [Number(d.labelLon), Number(d.labelLat)];

		let location =
			d.locationLon && d.locationLat
				? [Number(d.locationLon), Number(d.locationLat)]
				: null;

		let nameBreaks =
			d.nameBreakLine1 && d.nameBreakLine2
				? [d.nameBreakLine1, d.nameBreakLine2]
				: null;

		let notes = [d.notes1, d.notes2, d.notes3].filter((n) => n);

		return {
			name: d.name,
			title: d.title,
			nameBreaks,
			label,
			link: d.link,
			type: d.type,
			location,
			status: d.status,
			year_started: d.year_started,
			sectors: d.sectors,
			ghgs: d.ghgs,
			inclusion_thresholds: d.inclusion_thresholds,
			entities: d.entities,
			emissions_cap: d.emissions_cap,
			coverage: d.coverage,
			notes: notes.length ? notes : null,
		};
	});
}
