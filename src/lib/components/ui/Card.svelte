<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	let { children, class: _class, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	class="bg-accent text-accent-foreground flex flex-col gap-1 rounded-lg border p-4 shadow-lg/50 {_class}"
	{...props}
>
	{@render children?.()}
</div>
