<script lang="ts">
	import '../app.css';

	import { Calendario } from '$lib/states/calendario.svelte';
	import { Data } from '$lib/data/data.svelte';

	$effect(() => {
		Data.init();
		Calendario.init(localStorage);
	});

	let { children } = $props();
</script>

	{@render children()}
