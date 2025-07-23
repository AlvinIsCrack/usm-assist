<script>
	import { MAIN_RENDERER } from '$lib/constants/ids';
</script>

<div role="application" class="bg-primary/80 relative h-full w-full overflow-hidden">
	<div class="flex h-full w-full flex-row items-center justify-center">
		{#await import('$lib/components/main/sidebar/SideBar.svelte') then { default: SideBar }}
			<SideBar />
		{/await}
		<div id={MAIN_RENDERER} class="relative h-full w-full p-2">
			{#await import('$lib/components/main/calendar/Calendar.svelte') then { default: Calendar }}
				<Calendar />
			{/await}
		</div>
	</div>
	<div
		id="tooltip-portal"
		class="pointer-events-none absolute top-0 left-0 z-[1000] h-full w-full"
	></div>
</div>
