<script lang="ts">
    import DataDisplay from './DataDisplay.svelte';
    import LocationSelector from './LocationSelector.svelte';
    import type LocationCoordinates from '$lib/utils/LocationCoordinates';
    import { fetchWeatherData, type LocationWeatherData } from '$lib/utils/WeatherUtils';
    import WeatherComparator from './WeatherComparator.svelte';
    import { fade, slide } from 'svelte/transition';
    let sourceCoordinates: LocationCoordinates;
    let source: LocationWeatherData;
    let targetCoordinates: LocationCoordinates;
    let target: LocationWeatherData;
    let inputIndex = 0;

    const handleSetMyLocation = async (event: CustomEvent<LocationCoordinates>): Promise<void> => {
        inputIndex += 1;
        sourceCoordinates = event.detail;
    };

    const handleSetTargetLocation = async (
        event: CustomEvent<LocationCoordinates>
    ): Promise<void> => {
        inputIndex += 1;
        targetCoordinates = event.detail;
    };

    const handleGetWeatherData = async (): Promise<void> => {
        source = await fetchWeatherData(sourceCoordinates);
        target = await fetchWeatherData(targetCoordinates);
        inputIndex += 1;
    };
</script>

<ul>
    <li class:full-opacity={inputIndex === 0} transition:fade>
        I live in:
        <div>
            <LocationSelector on:setlocation={handleSetMyLocation} localLocation />
        </div>
    </li>
    <li class:full-opacity={inputIndex === 1} transition:fade>
        <div>
            I flex over: <LocationSelector on:setlocation={handleSetTargetLocation} />
        </div>
    </li>
    <li class:full-opacity={inputIndex === 2} transition:fade>
        <input type="button" value="Flex" on:click={handleGetWeatherData} />
    </li>

    {#if inputIndex !== 3}
        <li>???</li>
    {:else}
        <li class:full-opacity={inputIndex === 3} transition:fade>
            <WeatherComparator {source} {target} />
        </li>
        <li class:full-opacity={inputIndex === 3} transition:slide={{ delay: 500 }}>
            <DataDisplay data={[source, target]} />
        </li>
    {/if}
</ul>

<style lang="scss">
    ul {
        display: flex;
        flex-direction: column;
        align-items: center;
        list-style-type: none;
        padding: 0;
        gap: 20px;

        li {
            padding: 10px;
            border: 1px solid #ccc;
            text-align: center;
            opacity: 1;
            transition: opacity 0.3s ease-in-out;
            width: 400px;
        }

        li:not(.full-opacity) {
            opacity: 0.5;
        }
    }
</style>
