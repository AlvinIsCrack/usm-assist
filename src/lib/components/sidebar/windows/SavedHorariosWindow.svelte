<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Separator from '$lib/components/ui/Separator.svelte';
	import Add from '$lib/icons/add.svelte';
	import { Calendario } from '$lib/states/calendario.svelte';
	import { SideBar } from '../SideBar.svelte';
</script>

<div class="flex h-full w-full flex-col gap-2 overflow-y-auto">
	<p>Horarios guardados</p>
	{#if Calendario.hasSaved()}
		{#each Calendario.getSaved() as key (key)}
			<button
				type="button"
				class="bg-popover text-popover-foreground hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer flex-row items-center justify-between rounded-lg border px-3 py-2"
				onclick={async () => (await Calendario.load(key)) && SideBar.closeActiveWindow()}
			>
				<p class="w-full truncate text-sm" title={key}>{key}</p>
				<Button
					type="button"
					class="w-full p-1!"
					variant="destructive"
					size="icon"
					onclick={async () => {
						if (confirm(`¿Seguro que quieres eliminar el horario "${key}"?`)) {
							await Calendario.removeSaved(key);
						}
					}}
				>
					<Add class="scale-150 rotate-45" />
				</Button>
			</button>
		{/each}
	{:else}
		<div class="flex h-full w-full items-center justify-center">
			<p>No hay ningun horario guardado.</p>
		</div>
	{/if}
</div>
