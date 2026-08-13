<script lang="ts">
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { store } from '$lib/store/MainStore.svelte';

	let { teams = $bindable(), game = null }: { teams: any; game: string | null } = $props();

	let points = [10, 8, 6, 4, 2, 0];

	function placeClass(index: number): string {
		if (index === 0) return 'border-yellow-300 bg-yellow-50';
		if (index === 1) return 'border-neutral-300 bg-neutral-50';
		if (index === 2) return 'border-emerald-300 bg-emerald-50';
		return 'border-stone-200 bg-white';
	}

	function mobilePlaceClass(index: number): string {
		if (index === 0) return 'bg-yellow-300';
		if (index === 1) return 'bg-gray-300';
		if (index === 2) return 'bg-[#1cd086]';
		return 'bg-white';
	}
</script>

<div class="grid w-full grid-cols-1 gap-4 px-2 md:hidden">
	{#each teams as team, i}
		<Card
			class={`relative overflow-hidden rounded-2xl p-4 text-lg ${mobilePlaceClass(i)} text-stone-800 shadow-md`}
		>
			<CardContent class="relative z-10 flex items-center justify-between gap-4">
				<div class="w-[40px] text-xl font-black">{i + 1}.</div>
				<div class="flex-1 truncate text-lg font-bold">
					{team == -1 ? '---' : store.teams[team]}
				</div>
				<div class="w-[80px] text-right font-semibold">{points[i]}P</div>
			</CardContent>
		</Card>
	{/each}
</div>

<div class="hidden w-full grid-cols-1 gap-4 md:grid md:grid-cols-2 xl:grid-cols-3">
	{#each teams as team, i}
		<Card class={`overflow-hidden rounded-lg border-2 ${placeClass(i)} text-stone-900 shadow-sm`}>
			<CardContent class="grid grid-cols-[72px_1fr_76px] items-center gap-4 p-5">
				<div class="text-4xl font-black text-stone-400">{i + 1}.</div>
				<div class="min-w-0">
					<div class="truncate text-xl font-black">{team == -1 ? '---' : store.teams[team]}</div>
					<div class="mt-1 text-sm font-medium text-stone-500">Platzierung</div>
				</div>
				<div
					class="rounded-full bg-white px-3 py-2 text-center text-lg font-black text-[#1cd086] shadow-sm"
				>
					{points[i]}P
				</div>
			</CardContent>
		</Card>
	{/each}
</div>
