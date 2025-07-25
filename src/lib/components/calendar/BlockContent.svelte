<script lang="ts">
	import RamoCard from './RamoCard.svelte';
	import type { Bloque } from '$lib/types/horario';
	import { TipoBloque } from '$lib/types/horario';

	let { bloques }: { bloques: Bloque[] | null } = $props();
</script>

<div class="bg-background/20 ring-input h-full w-full rounded-lg ring ring-inset">
	{#if !bloques || bloques.length === 0}{:else if bloques.length === 1}
		<RamoCard bloqueObject={bloques[0]} />
	{:else if bloques.length === 2}
		<div class="bg-warning flex h-full w-full flex-row gap-1 p-1">
			<RamoCard bloqueObject={bloques[0]} />
			<RamoCard bloqueObject={bloques[1]} />
		</div>
	{:else}
		<div class="h-full w-full p-2"></div>
	{/if}
</div>
