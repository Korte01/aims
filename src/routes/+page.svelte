<script lang="ts">


	import Button from "$lib/components/ui/button/button.svelte";
    import logo from '$lib/assets/logo.png';
	import Label from "$lib/components/ui/label/label.svelte";
	import Separator from "$lib/components/ui/separator/separator.svelte";
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
	import { store } from "$lib/store/MainStore.svelte";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import { loadTeams } from "$lib/service/supabaseAPI.svelte";
    let teams=$state([]);
    let loaded=$state(false);
let selectedTeam=$state();
function selectTeam() {
    console.log(selectedTeam);
    store.teamID=selectedTeam-1;
    localStorage.setItem('teamID',selectedTeam-1);
    goto("/punktetabelle");
}

console.log(selectedTeam);
onMount(async ()=>{
    const teamID = localStorage.getItem('teamID');
    if (teamID) {
      goto('/punktetabelle');
    }
        store.teams = await loadTeams();
        teams=store.teams;
    loaded=true;
    });
</script>
{#if loaded}
<div class="flex flex-col justify-center origin-center min-h-[100svh] overflow-y-hidden">
    <div class="flex flex-col justify-center items-center h-full">
<Label class="text-2xl font-light pb-4">Willkommen zum</Label>
<img src={logo} alt="Logo" class="w-[70%]   " />
<div class="flex flex-col items-center justify-center mt-12 w-[80%] p-2 rounded-lg bg-slate-50 shadow-lg">
<Label class=" text-xl font-light p-1">Wähle dein Team</Label>
<Separator/>


    <ToggleGroup.Root type="single" bind:value={selectedTeam} class="grid grid-cols-2 gap-2 p-3 w-[90%]"  >
      

    
       {#each teams as team,i}
       <ToggleGroup.Item
       value={i+1}
       class="rounded-md border-primary text-base font-normal h-12 w-full data-[state=on]:bg-slate-200 data-[state=on]:text-black"
     >
       {team}
     </ToggleGroup.Item>
      
  {/each}
</ToggleGroup.Root>  
<div class=" px-3 w-[80%]">
    <Button class="h-12 w-full" disabled={!selectedTeam} onclick={selectTeam}>Team Beitreten</Button>
    </div>
</div>

</div>

</div>
{/if}