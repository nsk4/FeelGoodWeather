<script lang="ts">
    import TiLocationArrowOutline from 'svelte-icons/ti/TiLocationArrowOutline.svelte';
    import { createEventDispatcher, onMount } from 'svelte';
    import type LocationCoordinates from '$lib/utils/LocationCoordinates';
    import { slide } from 'svelte/transition';
    import ComboBox from '$components/ComboBox.svelte';
    import ToggleExpand from '$components/ToggleExpand.svelte';

    export let localLocation: boolean = false;

    const dispatch = createEventDispatcher();
    let location: LocationCoordinates = {
        name: '',
        latitude: undefined as unknown as number,
        longitude: undefined as unknown as number
    };
    let errorMessage: string = '';
    let cities: LocationCoordinates[];
    $: cityNames = cities?.map((city) => city.name);

    // Load list of cities from a static CSV file
    const loadCities = async (): Promise<LocationCoordinates[]> => {
        const response = await fetch('cityLocations.csv');
        const text = await response.text();
        return text?.split('\r\n')?.flatMap((line) => {
            const splits = line.split('\t');
            if (splits.length >= 3) {
                return {
                    name: splits[0],
                    latitude: +splits[1],
                    longitude: +splits[2]
                } as LocationCoordinates;
            } else {
                return [];
            }
        });
    };

    // Convert degrees to radians
    const degToRad = (x: number): number => {
        return (x * Math.PI) / 180;
    };
    // Calculate the distance between 2 points
    const calculateHaversineDistance = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number => {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = degToRad(lat2 - lat1);
        const dLon = degToRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(degToRad(lat1)) *
                Math.cos(degToRad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    };

    // Get city coordinates from city name.
    const getCityLocation = (name: string): LocationCoordinates | undefined => {
        const foundCity = cities?.find((city) => city.name === name);
        if (!foundCity) {
            return undefined;
        }
        // Return copy of the found city object.
        return { ...foundCity };
    };

    // Get closest city to the given coordinates. If no city is closer than threshold then return back the same point.
    const getClosestCityLocation = (
        latitude: number,
        longitude: number,
        threshold: number
    ): LocationCoordinates => {
        // Iterate over distances and pick the closest city if it is within threshold distance.
        let minDistance = threshold;
        let closestCity: LocationCoordinates | undefined = undefined;
        cities?.forEach((city) => {
            const distance = calculateHaversineDistance(
                latitude,
                longitude,
                city.latitude,
                city.longitude
            );
            if (distance < minDistance) {
                closestCity = city;
                minDistance = distance;
            }
        });

        // If close city is found then return a copy of it. If not then return a N/A location with user coordinates.
        return closestCity
            ? structuredClone(closestCity)
            : { name: `N/A (${latitude}:${longitude})`, latitude, longitude };
    };

    // Initialize cities
    onMount(async () => {
        cities = await loadCities();
    });

    // Get location through combobox
    const locationSelected = (event: { detail: { text: string } }): void => {
        const selectedCity = getCityLocation(event.detail.text);
        if (!selectedCity) {
            errorMessage = 'City not found.';
        } else {
            location = selectedCity;
            dispatch('setlocation', location);
        }
    };

    // Get location via browser location
    const getLocation = (): void => {
        errorMessage = '';
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    location = getClosestCityLocation(
                        position.coords.latitude,
                        position.coords.longitude,
                        100
                    );
                    dispatch('setlocation', location);
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
    const submitCoordinatesForm = (): void => {
        errorMessage = '';
        location = getClosestCityLocation(location.latitude, location.longitude, 100);
        dispatch('setlocation', location);
    };
</script>

<ComboBox suggestions={cityNames} on:selected={locationSelected} value={location.name} />

{#if localLocation}
    <button type="button" on:click={getLocation}>
        <span style:height="10px" style:display="inline-block">
            <TiLocationArrowOutline />
        </span>
    </button>
{/if}

<ToggleExpand>
    <form on:submit|preventDefault={submitCoordinatesForm} transition:slide>
        <input
            type="number"
            step="0.0001"
            id="latitude"
            bind:value={location.latitude}
            placeholder="Latitude"
            min={-90}
            max={90}
            style:width="75px"
            required
        />
        :
        <input
            type="number"
            step="0.0001"
            id="longitude"
            bind:value={location.longitude}
            placeholder="Longitude"
            min={-180}
            max={180}
            style:width="75px"
            required
        />
        <button type="submit">Set</button>
    </form>
</ToggleExpand>

{#if !!errorMessage}
    <p style:color="red" transition:slide>Error: {errorMessage}</p>
{/if}

<style lang="scss">
</style>
