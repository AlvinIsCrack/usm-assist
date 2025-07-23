<script lang="ts">
	import type { Bloque } from '$lib/data/data.svelte';

	let { bloques }: { bloques: Bloque[] } = $props();
</script>

<div>
	{bloques.length}
</div>
