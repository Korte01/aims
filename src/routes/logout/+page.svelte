<script lang="ts">
	import { onMount } from 'svelte';
    import type { PageData } from './$types';


onMount(() => {
    localStorage.removeItem("teamID");
    localStorage.removeItem("admin");
});
</script>
Du wurdest abgemeldet.