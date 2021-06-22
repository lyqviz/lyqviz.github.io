import * as _ from 'lodash';

export function dataToHierarchy(view, data) {
	if (!view || !data) return;

	const scope = _.chain(data)
		.groupBy('scope')
		.map((value, key) => ({
			name: key,
			children: _.chain(value)
				.groupBy('emissions_category')
				.map((value, key) => ({
					name: key,
					children: _.chain(value)
						.groupBy('emissions_source')
						.map((value, key) => ({
							name: key,
							children: _.chain(value).value(),
						}))
						.value(),
				}))
				.value(),
		}))
		.value();

	const bu = _.chain(data)
		.groupBy('bu')
		.map((value, key) => ({
			name: key,
			children: _.chain(value)
				.groupBy('last_bu')
				.map((value, key) => ({
					name: key,
					children: _.chain(value).value(),
				}))
				.value(),
		}))
		.value();

	const activity = _.chain(data)
		.groupBy('activity')
		.map((value, key) => ({
			name: key,
			children: _.chain(value)
				.groupBy('sub_activity')
				.map((value, key) => ({
					name: key,
					children: _.chain(value).value(),
				}))
				.value(),
		}))
		.value();

	let children;

	if (view === 'activity') children = activity;
	if (view === 'bu') children = bu;
	if (view === 'scope') children = scope;

	return {
		name: '',
		children,
	};
}
