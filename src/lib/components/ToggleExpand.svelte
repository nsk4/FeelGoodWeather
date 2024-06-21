<script lang="ts">
    import TiArrowSortedDown from 'svelte-icons/ti/TiArrowSortedDown.svelte';
    import TiArrowSortedUp from 'svelte-icons/ti/TiArrowSortedUp.svelte';
    import IconButton from '$components/IconButton.svelte';
    let isExpanded = false;

    export const collapse = (): void => {
        isExpanded = false;
        console.log(isExpanded);
    };
</script>

<IconButton on:click={() => (isExpanded = !isExpanded)} height="30px">
    {#if isExpanded}
        <TiArrowSortedUp />
    {:else}
        <TiArrowSortedDown />
    {/if}
</IconButton>

{#if isExpanded}
    <slot />
{/if}

<style lang="scss">
</style>
