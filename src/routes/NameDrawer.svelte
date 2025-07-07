<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import Input from "$lib/components/ui/input/input.svelte";
	import { updateTeamname } from "$lib/service/supabaseAPI.svelte";
	import { store } from "$lib/store/MainStore.svelte";
let open=$state(false);
let value:string=$state("");
function cancel() {
    open=false;
}
	function save() {
        if(value && value != "" )
         store.teams[store.teamID] = value;
        open=false;
        updateTeamname(value,store.teamID);
        
    }
</script>
<Drawer.Root bind:open>
	<Drawer.Trigger class=" mt-4 px-4 py-2  absolute bottom-0">
        <button class=" rounded bg-sidebar-accent text-left hover:bg-sidebar-accent/80">
			✏️ Teamnamen bearbeiten
			</button>
	</Drawer.Trigger>

	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title class="text-2xl text-center">Teamnamen ändern</Drawer.Title>
			<Drawer.Description></Drawer.Description>
		</Drawer.Header>

		<!-- Auswahl 1–6 -->
		<div class="grid  pb-4 px-12">
			<Input bind:value class="h-16 text-lg " placeholder={store.teams[store.teamID]}/>
		</div>
	
		<Drawer.Footer class="flex justify-end p-4">
			<Drawer.Close>
				<Button variant="outline" onclick={cancel}>Abbrechen</Button>
                <Button onclick={save} >Speichern</Button>
			</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>