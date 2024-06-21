<script lang="ts">
    import IoIosBuild from 'svelte-icons/io/IoIosBuild.svelte';
    import DataDisplay from '$components/WeatherComponents/DataDisplay.svelte';
    import LocationSelector from '$components/WeatherComponents/LocationSelector.svelte';
    import type LocationCoordinates from '$lib/utils/LocationCoordinates';
    import { fetchWeatherData, type LocationWeatherData } from '$lib/utils/WeatherUtils';
    import WeatherComparator from '$components/WeatherComponents/WeatherComparator.svelte';
    import { slide } from 'svelte/transition';
    import IconButton from '$components/IconButton.svelte';
    import type { PageData } from './$types';

    export let data: PageData;
    let sourceComponent: LocationSelector;
    let sourceCoordinates: LocationCoordinates;
    let source: LocationWeatherData;
    let targetComponent: LocationSelector;
    let targetCoordinates: LocationCoordinates;
    let target: LocationWeatherData;
    let inputIndex = 0;

    const handleSetMyLocation = async (event: CustomEvent<LocationCoordinates>): Promise<void> => {
        sourceCoordinates = event.detail;
        goToTargetEntry();
    };

    const handleSetTargetLocation = async (
        event: CustomEvent<LocationCoordinates>
    ): Promise<void> => {
        targetCoordinates = event.detail;
        goToFlex();
    };

    const handleGetWeatherData = async (): Promise<void> => {
        source = await fetchWeatherData(sourceCoordinates);
        target = await fetchWeatherData(targetCoordinates);
        goToComparison();
    };

    const goToStart = (): void => {
        sourceComponent.clearInputs();
        targetComponent.clearInputs();
        inputIndex = 0;
    };

    const goToSourceEntry = (): void => {
        targetComponent.clearInputs();
        inputIndex = 0;
    };

    const goToTargetEntry = (): void => {
        inputIndex = 1;
    };

    const goToFlex = (): void => {
        inputIndex = 2;
    };

    const goToComparison = (): void => {
        inputIndex = 3;
    };
</script>

<!--Own location entry -->
<div class="box">
    <div class="full-opacity" class:partial-opacity={inputIndex !== 0}>
        I live in:
        <div class="align-center">
            <LocationSelector
                bind:this={sourceComponent}
                on:setlocation={handleSetMyLocation}
                cities={data.cities}
                localLocation
            />
        </div>
    </div>
    {#if inputIndex > 0}
        <div class="edit-component">
            <IconButton on:click={goToSourceEntry} height="20px">
                <IoIosBuild />
            </IconButton>
        </div>
    {/if}
</div>

<!--Target location entry -->
<div class="box">
    <div class="full-opacity" class:partial-opacity={inputIndex !== 1}>
        I flex over:
        <div class="align-center">
            <LocationSelector
                bind:this={targetComponent}
                on:setlocation={handleSetTargetLocation}
                cities={data.cities}
            />
        </div>
    </div>
    {#if inputIndex > 1}
        <div class="edit-component">
            <IconButton on:click={goToTargetEntry} height="20px">
                <IoIosBuild />
            </IconButton>
        </div>
    {/if}
</div>
<!--Flex button -->
<div class="box">
    <div class="full-opacity" class:partial-opacity={inputIndex !== 2}>
        <input type="button" class="action-button" value="Flex" on:click={handleGetWeatherData} />
    </div>
</div>

<!--Results -->
<div class="box">
    <div class="full-opacity" class:partial-opacity={inputIndex !== 3}>
        {#if inputIndex === 3}
            <!--Weather comparison text -->
            <div transition:slide><WeatherComparator {source} {target} /></div>

            <!--Weather data display -->
            <div in:slide={{ delay: 500 }} out:slide>
                <DataDisplay data={[source, target]} />
            </div>
        {:else}
            <div transition:slide>???</div>
        {/if}
    </div>
</div>

<!--Start over button, only visible after comparison is done. -->
{#if inputIndex === 3}
    <div class="box" in:slide={{ delay: 750 }} out:slide>
        <div>
            <input type="button" class="action-button" value="Start over" on:click={goToStart} />
        </div>
    </div>
{/if}

<style lang="scss">
    .box {
        text-align: center;
        width: 100%;
        min-width: 320px;
        max-width: 700px;

        padding: 10px;
        border: 1px solid #30363d;
        border-radius: 6px;
        box-sizing: border-box;
        position: relative; // Relative position for edit-component absolute positioning.

        .full-opacity {
            // Since svelte only supports transition for elements entering or leaving DOM a CSS transition is needed for elements that only change opacity.
            //By default a full opacity is set, which is then overriden by the partial-opacity class.
            opacity: 1;
            transition: opacity 0.5s ease-in-out;
        }

        .partial-opacity {
            opacity: 0.5;
            pointer-events: none;
        }

        .edit-component {
            position: absolute;
            right: 5px;
            top: 5px;
        }
    }

    .align-center {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .action-button {
        background-color: #3b5998;
        color: #c9d1d9;
        font-family: 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
        border: none;
        border-radius: 50%;
        padding: 24px 24px;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: background-color 0.2s ease;

        &:active {
            background-color: #2d4373;
        }
    }
</style>
