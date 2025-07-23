<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		vertical,
		thickness = 1,
		class: _class,
		children,
		...props
	}: { vertical?: boolean; thickness?: 1 | 2 | 4 } & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	style="--thickness: {thickness}px;"
	class="{vertical
		? 'mx-1 h-full w-(--thickness) scale-y-200 border-r'
		: 'my-1 h-(--thickness) w-full scale-x-200 border-t'} {_class}"
	{...props}
>
	{@render children?.()}
</div>
