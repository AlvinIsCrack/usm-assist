import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		pages: 'build',
		assets: 'build',
		fallback: undefined,
		precompress: false,
		strict: true,
		adapter: adapter(),
		paths: {
			base: dev ? '' : process.env.BASE_PATH
		}
	}
};

export default config;
