<script lang="ts">
    import TiLocationArrowOutline from 'svelte-icons/ti/TiLocationArrowOutline.svelte';
    import { createEventDispatcher } from 'svelte';
    import type { LocationCoordinates } from '$lib/utils/DataTypes';
    import { slide } from 'svelte/transition';
    export let localLocation: boolean = false;

    const dispatch = createEventDispatcher();
    let latitude: number;
    let longitude: number;
    const submitForm = (): void => {
        errorMessage = '';
        dispatch('setlocation', { latitude, longitude } as LocationCoordinates);
    };

    let errorMessage: string = '';
    const getLocation = (): void => {
        errorMessage = '';
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    latitude = +position.coords.latitude.toFixed(3);
                    longitude = +position.coords.longitude.toFixed(3);
                },
                (error) => {
                    errorMessage = error.message;
                }
            );
        } else {
            errorMessage = 'Geolocation is not supported by this browser.';
        }
    };
</script>

<form on:submit|preventDefault={submitForm}>
    <label for="latitude">Latitude:</label>
    <input
        type="number"
        step="0.001"
        id="latitude"
        bind:value={latitude}
        placeholder="Latitude"
        min={-90}
        max={90}
        required
    />

    <label for="longitude">Longitude:</label>
    <input
        type="number"
        step="0.001"
        id="longitude"
        bind:value={longitude}
        placeholder="Longitude"
        min={-180}
        max={180}
        required
    />

    {#if localLocation}
        <button type="button" on:click={getLocation}>
            <span style:height="10px" style:display="inline-block">
                <TiLocationArrowOutline />
            </span>
        </button>
    {/if}
    <button type="submit">Submit</button>
</form>

{#if !!errorMessage}
    <p style:color="red" transition:slide>Error: {errorMessage}</p>
{/if}

<style lang="scss">
</style>
