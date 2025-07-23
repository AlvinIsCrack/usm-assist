<script lang="ts">
	import MainRenderer from '$lib/components/main/MainRenderer.svelte';
	import SideBar from '$lib/components/main/sidebar/SideBar.svelte';

	export const prerender = true;
</script>

<div role="application" class="bg-primary/80 relative h-full w-full overflow-hidden">
	<div class="flex h-full w-full flex-row items-center justify-center">
		<SideBar />
		<MainRenderer />
	</div>
	<div
		id="tooltip-portal"
		class="pointer-events-none absolute top-0 left-0 z-[1000] h-full w-full"
	></div>
</div>
