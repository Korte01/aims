<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import { setPlace } from "$lib/service/supabaseAPI.svelte";
	import { store } from "$lib/store/MainStore.svelte";
	import { writable } from "svelte/store";
let open=$state(false);
	const selectedPlace = writable<number | null>(null);
let {game, results=$bindable()}=$props();
	function selectPlace(n: number) {
	for (let index = 0; index < results.length; index++) {
		 
		if(results[index]==store.teamID){
			setPlace(game,null,index+1);
			results[index]=-1;
		}
		
		
	}
results[n]=store.teamID;
setPlace(game,store.teamID,n+1);
open=false;

		// hier könntest du später z. B. ein API-Call machen
	}
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger class="w-full">
		<Button class="w-full bg-primary text-white font-bold text-lg py-8 rounded-xl shadow hover:bg-primary/90 transition">
			Platz eintragen
		</Button>
	</Drawer.Trigger>

	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title class="text-2xl">Platz wählen</Drawer.Title>
			<Drawer.Description>Wähle deinen erziehlte Platzierung</Drawer.Description>
		</Drawer.Header>

		<!-- Auswahl 1–6 -->
		<div class="grid grid-cols-3 gap-4 p-4">
			{#each [1, 2, 3, 4, 5, 6] as n}
				<Button
					onclick={() => selectPlace(n-1)}
					class="py-6 text-xl font-bold"
					variant="secondary"
				>
					{n}.
				</Button>
			{/each}
		</div>

		<Drawer.Footer class="flex justify-end p-4">
			<Drawer.Close>
				<Button variant="outline">Abbrechen</Button>
			</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
