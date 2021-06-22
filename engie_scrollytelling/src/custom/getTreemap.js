import * as d3 from 'd3';

import { dataToHierarchy } from './getTreemapData.js';

const width = 960;
const height = 600 - 48;

// uid from Observable/stdlib

var count = 0;

export function uid(name) {
	return new Id('O-' + (name == null ? '' : name + '-') + ++count);
}

function Id(id) {
	this.id = id;
	this.href = new URL(`#${id}`, location) + '';
}

Id.prototype.toString = function () {
	return 'url(' + this.href + ')';
};

//

export function getTreemap(view, data, interactive, callback) {
	if (!view || !data) return;

	// data = dataToHierarchy(view, data);

	const x = d3.scaleLinear().rangeRound([0, width]);
	const y = d3.scaleLinear().rangeRound([0, height]);

	//

	let back = () => {
		if (currentRoot.parent) zoomout(currentRoot);
	};

	let currentRoot;
	let depth = 0;

	//

	const svg = d3
		.create('svg')
		.attr('viewBox', [0, 0, width, height - 48])
		.style('font-size', '14px')
		.style('font-family', 'Lato, sans-serif');

	let group = svg
		.append('g')
		.call(render, treemap(dataToHierarchy(view, data)));

	function render(group, root) {
		currentRoot = root;
		depth = root.depth;

		const node = group
			.selectAll('g')
			.data(root.children)
			.join('g')
			.attr('class', (d) => {
				while (d.depth > 1) d = d.parent;

				return getColor(d.data.name);
			});

		if (interactive) {
			node.filter((d) => d.depth < 2)
				.attr('cursor', 'pointer')
				.on('click', (e, d) => zoomin(d));
		}

		// Adds leafs

		node.append('rect')
			.attr('id', (d) => (d.leafUid = uid('leaf')).id)
			.attr('stroke', '#fff')
			.attr('stroke-width', '5px');

		node.append('clipPath')
			.attr('id', (d) => (d.clipUid = uid('clip')).id)
			.append('use')
			.attr('xlink:href', (d) => d.leafUid.href);

		node.append('text')
			.attr('clip-path', (d) => d.clipUid)
			.selectAll('tspan')

			.data((d) => {
				const label = d.data.name;

				if (d.value / root.value < 0.03) return [];

				const tons = format(d.value);
				const percent = formatPercent(d.value / root.value);

				const text = [label, tons, percent];

				return text;
			})
			.join('tspan')
			.attr('x', 10)
			.attr(
				'y',
				(d, i, nodes) => `${(i === nodes.length) + 2 + i * 1.5}em`
			)
			.text((d) => d);

		group.call(position, root);

		//

		if (callback) callback({ back, depth });
	}

	function position(group, root) {
		group
			.selectAll('g')
			.attr('transform', (d) =>
				d === root
					? `translate(0,-30)`
					: `translate(${x(d.x0)},${y(d.y0)})`
			)
			.select('rect')
			.attr('width', (d) => (d === root ? width : x(d.x1) - x(d.x0)))
			.attr('height', (d) => (d === root ? 30 : y(d.y1) - y(d.y0)));
	}

	// When zooming in, draw the new nodes on top, and fade them in.

	function zoomin(d) {
		if (!interactive) return;

		const group0 = group.attr('pointer-events', 'none');
		const group1 = (group = svg.append('g').call(render, d));

		x.domain([d.x0, d.x1]);
		y.domain([d.y0, d.y1]);

		svg.transition()
			.duration(750)
			.call((t) => group0.transition(t).remove().call(position, d.parent))
			.call((t) =>
				group1
					.transition(t)
					.attrTween('opacity', () => d3.interpolate(0, 1))
					.call(position, d)
			);
	}

	// When zooming out, draw the old nodes on top, and fade them out.

	function zoomout(d) {
		if (!interactive) return;

		const group0 = group.attr('pointer-events', 'none');
		const group1 = (group = svg.insert('g', '*').call(render, d.parent));

		x.domain([d.parent.x0, d.parent.x1]);
		y.domain([d.parent.y0, d.parent.y1]);

		svg.transition()
			.duration(750)
			.call((t) =>
				group0
					.transition(t)
					.remove()
					.attrTween('opacity', () => d3.interpolate(1, 0))
					.call(position, d)
			)
			.call((t) => group1.transition(t).call(position, d.parent));
	}

	return {
		back,
		depth,
		node: svg.node(),
	};
}

const getColor = d3.scaleOrdinal().range(['yellow', 'purple', 'green']);

const format = d3.format(',d');
const formatPercent = d3.format('.1%');

function tile(node, x0, y0, x1, y1) {
	// d3.treemapBinary
	// d3.treemapSquarify
	// d3.treemapResquarify.ratio(height / width * (1 + Math.sqrt(5)))

	d3.treemapResquarify(node, 0, 0, width, height);

	for (const child of node.children) {
		child.x0 = x0 + (child.x0 / width) * (x1 - x0);
		child.x1 = x0 + (child.x1 / width) * (x1 - x0);
		child.y0 = y0 + (child.y0 / height) * (y1 - y0);
		child.y1 = y0 + (child.y1 / height) * (y1 - y0);
	}
}

const treemap = (data, view) => {
	const sorts = {
		Scope: (a, b) => {
			a.name < b.name;
		},
	};

	return d3.treemap().tile(tile)(
		d3
			.hierarchy(data)
			.sum((d) => d.value)
			.sort((a, b) => {
				return b.value - a.value;
			})
	);
};
