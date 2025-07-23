<script lang="ts">
	import RamoCard from './RamoCard.svelte';
	import Warning from '$lib/icons/warning.svelte';
	import Door from '$lib/icons/door.svelte';
	import type { Bloque } from '$lib/data/data.svelte';

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
		<div class="h-full w-full p-2">
			<div
				class="bg-destructive/80 text-destructive-foreground flex h-full w-full flex-col gap-1 overflow-y-auto rounded-lg p-4 text-left ring ring-inset"
			>
				<div class="flex items-center gap-1 font-bold">
					<Warning class="icon" />
					<span>{bloques.length} RAMOS EN CONFLICTO</span>
				</div>
				{#each bloques as b (b.ramo.sigla + b.ramo.paralelo)}
					<div
						class="border-destructive-foreground/30 line-clamp-2 flex items-center justify-evenly rounded border p-1 text-sm"
					>
						<span class="font-bold">{b.ramo.sigla}</span>
						<span class="flex flex-row items-center justify-center gap-1">
							<Door class="inline" />
							{b.sala}
						</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
