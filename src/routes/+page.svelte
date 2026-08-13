<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import logo from '$lib/assets/logo.png';
	import Label from '$lib/components/ui/label/label.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import { store } from '$lib/store/MainStore.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { loadTeams } from '$lib/service/supabaseAPI.svelte';
	let teams = $state([]);
	let loaded = $state(false);
	let selectedTeam = $state();
	function selectTeam() {
		console.log(selectedTeam);
		store.teamID = selectedTeam - 1;
		localStorage.setItem('teamID', selectedTeam - 1);
		goto('/punktetabelle');
	}

	console.log(selectedTeam);
	onMount(async () => {
		const teamID = localStorage.getItem('teamID');
		if (teamID) {
			goto('/punktetabelle');
		}
		store.teams = await loadTeams();
		teams = store.teams;
		loaded = true;
	});
</script>

{#if loaded}
	<div class="flex min-h-[100svh] flex-col justify-center overflow-y-auto bg-stone-100 px-4 py-8">
		<div
			class="mx-auto flex w-full max-w-5xl flex-col items-center justify-center md:grid md:grid-cols-[1fr_420px] md:gap-16"
		>
			<div class="flex flex-col items-center md:items-start">
				<Label class="pb-4 text-2xl font-light md:text-3xl">Willkommen zum</Label>
				<img src={logo} alt="Logo" class="w-[70%] max-w-sm md:w-full" />
			</div>
			<div
				class="mt-12 flex w-full max-w-md flex-col items-center justify-center rounded-lg bg-neutral-50 p-3 shadow-lg md:mt-0 md:p-5"
			>
				<Label class=" p-1 text-xl font-light">Wähle dein Team</Label>
				<Separator />

				<ToggleGroup.Root
					type="single"
					bind:value={selectedTeam}
					class="grid w-full grid-cols-2 gap-2 p-3 md:grid-cols-1"
				>
					{#each teams as team, i}
						<ToggleGroup.Item
							value={i + 1}
							class="border-primary h-12 w-full rounded-md text-base font-normal data-[state=on]:bg-neutral-200 data-[state=on]:text-black"
						>
							{team}
						</ToggleGroup.Item>
					{/each}
				</ToggleGroup.Root>
				<div class="w-full px-3">
					<Button class="h-12 w-full" disabled={!selectedTeam} onclick={selectTeam}
						>Team Beitreten</Button
					>
				</div>
			</div>
		</div>
	</div>
{/if}
