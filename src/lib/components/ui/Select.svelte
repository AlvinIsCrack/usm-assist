<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { tv } from 'tailwind-variants';

	const select = tv({
		base: 'border-input border bg-input rounded-md p-2'
	});
	const option = tv({
		base: 'bg-popover text-popover-foreground border rounded-sm'
	});

	let {
		placeholder,
		value = $bindable(''),
		items,
		disabled,
		class: _class,
		...props
	}: HTMLAttributes<HTMLSelectElement> & {
		disabled?: boolean;
		placeholder?: string;
		items: { label?: string; value: string }[];
		value?: string;
	} = $props();
</script>

<select
	class="{select({})} {disabled ? 'pointer-events-none opacity-50' : ''} {_class}"
	bind:value
	{...props}
>
	{#if placeholder}
		<option hidden selected value="">{placeholder}</option>
	{/if}
	{#each items as item, i (i)}
		<option class={option({})} value={item.value}>{item.label ?? item.value}</option>
	{/each}
</select>
