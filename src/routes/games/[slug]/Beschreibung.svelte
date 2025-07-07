<script lang="ts">
	import Label from "$lib/components/ui/label/label.svelte";


let {game_disciption}:{game_disciption:any}=$props();


</script>


<div class={`p-4 text-lg rounded-2xl shadow-md text-stone-800`}>
    <Label class="text-base pb-2">ℹ️ Erklärung</Label>
   
    {#each game_disciption.split('\n') as line}
    <Label class="text-base font-normal">{line}</Label>
  {/each}
</div>
