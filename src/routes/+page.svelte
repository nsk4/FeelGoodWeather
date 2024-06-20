<script lang="ts">
    import IoIosBuild from 'svelte-icons/io/IoIosBuild.svelte';
    import DataDisplay from '$components/WeatherComponents/DataDisplay.svelte';
    import LocationSelector from '$components/WeatherComponents/LocationSelector.svelte';
    import type LocationCoordinates from '$lib/utils/LocationCoordinates';
    import { fetchWeatherData, type LocationWeatherData } from '$lib/utils/WeatherUtils';
    import WeatherComparator from '$components/WeatherComponents/WeatherComparator.svelte';
    import { slide } from 'svelte/transition';
    import IconButton from '$components/IconButton.svelte';
    let sourceCoordinates: LocationCoordinates;
    let source: LocationWeatherData;
    let targetCoordinates: LocationCoordinates;
    let target: LocationWeatherData;
    let inputIndex = 0;

    const handleSetMyLocation = async (event: CustomEvent<LocationCoordinates>): Promise<void> => {
        inputIndex = 1;
        sourceCoordinates = event.detail;
    };

    const handleSetTargetLocation = async (
        event: CustomEvent<LocationCoordinates>
    ): Promise<void> => {
        inputIndex = 2;
        targetCoordinates = event.detail;
    };

    const handleGetWeatherData = async (): Promise<void> => {
        source = await fetchWeatherData(sourceCoordinates);
        target = await fetchWeatherData(targetCoordinates);
        inputIndex = 3;
    };
</script>

<div class="main">
    <h1>Welcome to Feel Good Weather!</h1>
    <p>Make yourself feel good by flexing over rainier places than yours.</p>

    <!--Own location entry -->
    <div class="box">
        <div class="full-opacity" class:partial-opacity={inputIndex !== 0}>
            I live in:
            <div>
                <LocationSelector on:setlocation={handleSetMyLocation} localLocation />
            </div>
        </div>
        {#if inputIndex > 0}
            <div class="edit-component">
                <IconButton on:click={() => (inputIndex = 0)} height="20px">
                    <IoIosBuild />
                </IconButton>
            </div>
        {/if}
    </div>

    <!--Target location entry -->
    <div class="box">
        <div class="full-opacity" class:partial-opacity={inputIndex !== 1}>
            I flex over:
            <div>
                <LocationSelector on:setlocation={handleSetTargetLocation} />
            </div>
        </div>
        {#if inputIndex > 1}
            <div class="edit-component">
                <IconButton on:click={() => (inputIndex = 1)} height="20px">
                    <IoIosBuild />
                </IconButton>
            </div>
        {/if}
    </div>
    <!--Flex button -->
    <div class="box">
        <div class="full-opacity" class:partial-opacity={inputIndex !== 2}>
            <input type="button" value="Flex" on:click={handleGetWeatherData} />
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
                <input type="button" value="Start over" on:click={() => (inputIndex = 0)} />
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    :global(body) {
        // Set global styles
        background-color: #0d1117;
        color: #c9d1d9;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif,
            'Apple Color Emoji', 'Segoe UI Emoji';
    }

    .main {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 320px;
        gap: 20px;
    }

    .box {
        text-align: center;
        width: 400px;
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
</style>
