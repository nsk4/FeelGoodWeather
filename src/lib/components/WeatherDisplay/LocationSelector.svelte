<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { GpsLocation } from '$lib/utils/DataTypes';

    const dispatch = createEventDispatcher();
    let latitude: number;
    let longitude: number;
    const submitForm = (): void => {
        dispatch('setlocation', { latitude, longitude } as GpsLocation);
    };
</script>

<form on:submit|preventDefault={submitForm}>
    <label for="latitude">Latitude:</label>
    <input
        type="number"
        step="0.01"
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
        step="0.01"
        id="longitude"
        bind:value={longitude}
        placeholder="Longitude"
        min={-180}
        max={180}
        required
    />

    <button type="submit">Submit</button>
</form>
