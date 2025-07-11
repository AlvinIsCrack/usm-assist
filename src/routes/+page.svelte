<script lang="ts">
	import GlobalTooltipRenderer from '$lib/components/common/GlobalTooltip/GlobalTooltipRenderer.svelte';
	import MainRenderer from '$lib/components/main/MainRenderer.svelte';
	import SideBar from '$lib/components/main/SideBar.svelte';
</script>

<GlobalTooltipRenderer />
<div class="flex h-full w-full flex-row items-center justify-center">
	<SideBar />
	<MainRenderer />
</div>
