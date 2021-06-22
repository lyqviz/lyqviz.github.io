import * as d3 from 'd3';

export function importData(sources) {

	const fetchers = {
		csv: (source) => {
			return fetch(source.url)
				.then((response) => response.text())
				.then((text) => {
					return d3.csvParse(text);
				});
		},
		json: (source) => {
			return fetch(source.url).then((response) => response.json());
		},
		text: (source) => {
			return fetch(source.url).then((response) => response.text());
		},
	};

	function get(source) {
		const fetcher = fetchers[source.type]
			? fetchers[source.type]
			: fetchers.text;

		return fetcher(source);
	}

	return Promise.all(sources.map(get)).then((values) => {
		const data = {};

		values.forEach((value, index) => {
			data[sources[index].name] = value;
		});

		return data;
	});
}
