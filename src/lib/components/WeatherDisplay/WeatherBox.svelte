<script lang="ts">
    import DataDisplay from './DataDisplay.svelte';
    import LocationSelector from './LocationSelector.svelte';
    import type { GpsLocation } from '$lib/utils/DataTypes';
    import { fetchWeatherData, type LocationWeatherData } from '$lib/utils/WeatherUtils';
    import WeatherComparator from './WeatherComparator.svelte';

    let source: LocationWeatherData;
    let target: LocationWeatherData;

    const handleSetMyLocation = async (event: CustomEvent<GpsLocation>): Promise<void> => {
        source = await fetchWeatherData(event.detail);
    };

    const handleSetTargetLocation = async (event: CustomEvent<GpsLocation>): Promise<void> => {
        target = await fetchWeatherData(event.detail);
    };
</script>

<div>
    <LocationSelector on:setlocation={handleSetMyLocation} />
    <LocationSelector on:setlocation={handleSetTargetLocation} />

    <DataDisplay data={source} />
    <DataDisplay data={target} />

    <WeatherComparator {source} {target} />
</div>

<style lang="scss">
    div {
        background-color: #c5c6d0;
        padding: 20px;
    }
</style>
