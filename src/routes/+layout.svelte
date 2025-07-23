<script lang="ts">
	import '../app.css';

	export const prerender = true;

	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import 'dayjs/locale/es-mx';
	import localeData from 'dayjs/plugin/localeData';

	dayjs.locale('es-mx');
	dayjs.extend(relativeTime);
	dayjs.extend(localeData);

	import { Calendario } from '$lib/states/calendario.svelte';
	import { Data } from '$lib/data/data.svelte';

	let loaded = $state(false);
	$effect(() => {
		Data.init();
		Calendario.init(localStorage);
		loaded = true;
	});

	let { children } = $props();
</script>

{#if loaded}
	{@render children()}
{/if}
