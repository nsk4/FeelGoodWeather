<script lang="ts">
    import TiArrowSortedDown from 'svelte-icons/ti/TiArrowSortedDown.svelte';
    import TiArrowSortedUp from 'svelte-icons/ti/TiArrowSortedUp.svelte';
    let isExpanded = false;
</script>

<div>
    <button type="button" class="toggle-button" on:click={() => (isExpanded = !isExpanded)}>
        <div class="toggle-icon">
            {#if isExpanded}
                <TiArrowSortedUp />
            {:else}
                <TiArrowSortedDown />
            {/if}
        </div>
    </button>

    {#if isExpanded}
        <slot />
    {/if}
</div>

<style lang="scss">
    .toggle-button {
        background: none;
        border: none;
        cursor: pointer;
        height: 15px;
        width: 100%;
        padding: 0;
    }

    .toggle-icon {
        height: 100%;
        width: 100%;
    }
</style>
