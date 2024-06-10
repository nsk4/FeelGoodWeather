<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    const click = (): void => {
        dispatch('click');
    };

    export let height: string = '';
    export let margin: string = '';
</script>

<button type="button" class="location-button" on:click={click} style:height style:margin>
    <div class="location-icon">
        <slot />
    </div>
</button>

<style lang="scss">
    .location-button {
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
