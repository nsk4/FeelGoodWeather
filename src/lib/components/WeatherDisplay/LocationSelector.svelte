<script lang="ts">
    import TiLocationArrowOutline from 'svelte-icons/ti/TiLocationArrowOutline.svelte';
    import { createEventDispatcher, onMount } from 'svelte';
    import type { LocationCoordinates } from '$lib/utils/DataTypes';
    import { slide } from 'svelte/transition';
    import ComboBox from '$components/ComboBox.svelte';
    import type { CityLocation } from '$lib/utils/LocationUtils';

    export let localLocation: boolean = false;

    const dispatch = createEventDispatcher();
    let latitude: number;
    let longitude: number;
    let errorMessage: string = '';
    let cities: CityLocation[];
    $: cityNames = cities?.map((city) => city.name);

    // Load list of cities from a static CSV file
    const loadCities = async (): Promise<CityLocation[]> => {
        const response = await fetch('cityLocations.csv');
        const text = await response.text();
        return text?.split('\r\n')?.flatMap((line) => {
            const splits = line.split('\t');
            if (splits.length >= 3) {
                return {
                    name: splits[0],
                    latitude: +splits[1],
                    longitude: +splits[2]
                } as CityLocation;
            } else {
                return [];
            }
        });
    };

    // Get city coordinates
    const getCityCoordinates = (name: string): CityLocation | undefined => {
        return cities?.find((city) => city.name === name);
    };

    // Initialize cities
    onMount(async () => {
        cities = await loadCities();
    });

    // Get location through combobox
    const locationSelected = (event: { detail: { text: string } }): void => {
        const city = getCityCoordinates(event.detail.text);
        if (!city) {
            errorMessage = 'City not found.';
        } else {
            latitude = city.latitude;
            longitude = city.longitude;
            dispatch('setlocation', { latitude, longitude } as LocationCoordinates);
        }
    };

    // Get location via browser location
    const getLocation = (): void => {
        errorMessage = '';
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // TODO: Switch form input from city combobox to coordinates
                    latitude = +position.coords.latitude.toFixed(3);
                    longitude = +position.coords.longitude.toFixed(3);
                    // TODO: propagate city name if it is available
                    dispatch('setlocation', { latitude, longitude } as LocationCoordinates);
                },
                (error) => {
                    errorMessage = error.message;
                }
            );
        } else {
            errorMessage = 'Geolocation is not supported by this browser.';
        }
    };

    // Submit selected coordinates
    const submitForm = (): void => {
        errorMessage = '';
        dispatch('setlocation', { latitude, longitude } as LocationCoordinates);
    };
</script>

<!-- TODO: Add logic to switch entry between ComboBox and coordinates. If user clicks on local location then a coordinates input should be shown. -->
<ComboBox suggestions={cityNames} on:selected={locationSelected} />

{#if localLocation}
    <button type="button" on:click={getLocation}>
        <span style:height="10px" style:display="inline-block">
            <TiLocationArrowOutline />
        </span>
    </button>
{/if}

<form on:submit|preventDefault={submitForm}>
    <input
        type="number"
        step="0.001"
        id="latitude"
        bind:value={latitude}
        placeholder="Latitude"
        min={-90}
        max={90}
        style:width="75px"
        required
    />
    :
    <input
        type="number"
        step="0.001"
        id="longitude"
        bind:value={longitude}
        placeholder="Longitude"
        min={-180}
        max={180}
        style:width="75px"
        required
    />
    <button type="submit">Submit</button>
</form>

{#if !!errorMessage}
    <p style:color="red" transition:slide>Error: {errorMessage}</p>
{/if}

<style lang="scss">
</style>
