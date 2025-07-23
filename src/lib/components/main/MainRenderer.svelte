<script lang="ts">
	import { MAIN_RENDERER } from '$lib/constants/ids';
	import Calendar from './calendar/Calendar.svelte';
</script>

<div id={MAIN_RENDERER} class="relative h-full w-full p-2">
	<Calendar />
</div>
