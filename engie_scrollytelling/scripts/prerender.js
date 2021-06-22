const fs = require('fs');
const path = require('path');

const App = require(path.resolve(
	process.cwd(),
	'../public/prerender/.temp/ssr.js'
));

const { html, css } = App.render({});

const template = fs.readFileSync(
	path.resolve(process.cwd(), '../public/prerender/template/index.html'),
	'utf-8'
);

const result = template.replace(
	'<!-- PRERENDER -->',
	`<style>${css.code}</style>${html}`
);

fs.writeFileSync(
	path.resolve(process.cwd(), '../public/prerendered.html'),
	result
);
