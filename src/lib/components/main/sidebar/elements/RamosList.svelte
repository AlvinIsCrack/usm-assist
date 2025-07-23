<script lang="ts">
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import Add from '$lib/icons/add.svelte';
	import Teachers from '$lib/icons/teachers.svelte';
	import { Calendario } from '$lib/states/calendario.svelte';
</script>

{#if Calendario.ramos.length}
	<div class="flex flex-col gap-2">
		{#each Calendario.ramos as ramo, i (i)}
			<div
				class="bg-popover text-popover-foreground relative overflow-hidden rounded-lg border px-3 py-1.5 pl-5"
			>
				<div
					class="absolute left-0 h-full w-2 scale-y-150"
					style:background={ramo.color!.hexa()}
				></div>
				<Tooltip content={ramo.nombre}>
					<div class="max-w-1/2 font-bold">{ramo.sigla}</div>
				</Tooltip>
				<div class="-mt-2 text-sm opacity-50">PAR. {ramo.paralelo}</div>

				{#snippet profesoresSnippet()}
					<ul class="text-left">
						{#each ramo.profesor as profesor, i (i)}
							<li>{profesor}</li>
						{/each}
					</ul>
				{/snippet}

				<Tooltip content={profesoresSnippet}>
					<Badge class="text-sm"><Teachers class="mr-1 inline scale-150" /> Profesores</Badge>
				</Tooltip>

				<Button
					class="pointer-events-auto absolute top-0 right-0 m-2 h-6! w-6!"
					variant="destructive"
					size="icon"
					onclick={() => Calendario.removeRamo(ramo.sigla)}
				>
					<Add class="scale-150 rotate-45" />
				</Button>
			</div>
		{/each}
	</div>
{/if}
