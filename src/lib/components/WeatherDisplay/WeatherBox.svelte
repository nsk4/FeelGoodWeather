<script lang="ts">
    import DataDisplay from './DataDisplay.svelte';
    import LocationSelector from './LocationSelector.svelte';
    import type { LocationCoordinates } from '$lib/utils/DataTypes';
    import { fetchWeatherData, type LocationWeatherData } from '$lib/utils/WeatherUtils';
    import WeatherComparator from './WeatherComparator.svelte';
    let source: LocationWeatherData;
    let target: LocationWeatherData;

    const handleSetMyLocation = async (event: CustomEvent<LocationCoordinates>): Promise<void> => {
        source = await fetchWeatherData(event.detail);
    };

    const handleSetTargetLocation = async (
        event: CustomEvent<LocationCoordinates>
    ): Promise<void> => {
        target = await fetchWeatherData(event.detail);
    };
</script>

<div>
    I live in: <LocationSelector on:setlocation={handleSetMyLocation} localLocation />
    I flex over: <LocationSelector on:setlocation={handleSetTargetLocation} />

    <DataDisplay data={[source, target]} />

    <WeatherComparator {source} {target} />
</div>

<style lang="scss">
    div {
        background-color: #c5c6d0;
        padding: 20px;
    }
</style>
