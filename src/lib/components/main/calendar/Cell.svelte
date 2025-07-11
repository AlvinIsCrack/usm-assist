<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import { Calendario, type Bloque, type Días } from '$lib/states/calendario.svelte';

	let { día, bloque: nBloque }: { día: Días; bloque: number } = $props();
	const bloque = Calendario.getBloque(día, nBloque);
</script>

<Card variant="soft" class="flex h-full w-full items-center justify-center p-2! text-lg">
	{#if bloque}
		{JSON.stringify(bloque)}
	{/if}
</Card>
