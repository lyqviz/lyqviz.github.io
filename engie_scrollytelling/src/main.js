import './css/main.css';

import '../public/client/css/branding.css';
import '../public/client/css/content.css';
import '../public/client/css/fonts.css';
import '../public/client/css/hero.css';
import '../public/client/css/themes.css';
import '../public/client/css/variables.css';
import '../public/client/css/pathways.css';

import '../public/client/css/components/map.css';
import '../public/client/css/components/treemap.css';

import App from './App.svelte';

var app = new App({
	target: document.getElementById('app'),
	hydrate: true,
});

export default app;
