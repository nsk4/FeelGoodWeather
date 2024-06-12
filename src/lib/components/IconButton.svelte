<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    const click = (): void => {
        dispatch('click');
    };

    export let height: string = '';
</script>

<button type="button" class="location-button" on:click={click} style:height>
    <div class="location-icon">
        <slot />
    </div>
</button>

<style lang="scss">
    .location-button {
        background-color: #21262d;
        color: #c9d1d9;
        background: none;
        border: none;
        cursor: pointer;
        vertical-align: middle;
        padding: 0;

        .location-icon {
            height: 100%;
            width: 100%;
        }
    }
</style>
