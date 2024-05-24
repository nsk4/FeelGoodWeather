<script lang="ts">
    import IoIosBuild from 'svelte-icons/io/IoIosBuild.svelte';
    import DataDisplay from './DataDisplay.svelte';
    import LocationSelector from './LocationSelector.svelte';
    import type LocationCoordinates from '$lib/utils/LocationCoordinates';
    import { fetchWeatherData, type LocationWeatherData } from '$lib/utils/WeatherUtils';
    import WeatherComparator from './WeatherComparator.svelte';
    import { slide } from 'svelte/transition';
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

<!-- TODO: refactor this step by step part into separate components -->
<ul>
    <li>
        <div class={inputIndex === 0 ? 'full-opacity' : 'not-full-opacity'}>
            I live in:
            <div>
                <LocationSelector on:setlocation={handleSetMyLocation} localLocation />
            </div>
        </div>

        {#if inputIndex > 0}
            <div class="top-right-component">
                <!-- TODO: This icon wrapping is commonly used throughout application. Extract it to a separate component. -->
                <button type="button" class="top-right-button" on:click={() => (inputIndex = 0)}>
                    <div class="top-right-button-icon">
                        <IoIosBuild />
                    </div>
                </button>
            </div>
        {/if}
    </li>
    <li>
        <div class={inputIndex === 1 ? 'full-opacity' : 'not-full-opacity'}>
            I flex over:
            <div>
                <LocationSelector on:setlocation={handleSetTargetLocation} />
            </div>
        </div>
        {#if inputIndex > 1}
            <div class="top-right-component">
                <button type="button" class="top-right-button" on:click={() => (inputIndex = 1)}>
                    <div class="top-right-button-icon">
                        <IoIosBuild />
                    </div>
                </button>
            </div>
        {/if}
    </li>
    <li>
        <div class={inputIndex === 2 ? 'full-opacity' : 'not-full-opacity'}>
            <input type="button" value="Flex" on:click={handleGetWeatherData} />
        </div>
    </li>
    <li>
        <div class={inputIndex === 3 ? 'full-opacity' : 'not-full-opacity'}>
            {#if inputIndex === 3}
                <div transition:slide><WeatherComparator {source} {target} /></div>
            {:else}
                <div transition:slide>???</div>
            {/if}
        </div>
    </li>
    <li>
        <div class={inputIndex === 3 ? 'full-opacity' : 'not-full-opacity'}>
            {#if inputIndex === 3}
                <div in:slide={{ delay: 500 }} out:slide>
                    <DataDisplay data={[source, target]} />
                </div>
            {:else}
                <div transition:slide>???</div>
            {/if}
        </div>
    </li>

    {#if inputIndex === 3}
        <li in:slide={{ delay: 750 }} out:slide>
            <div class="full-opacity">
                <input type="button" value="Start over" on:click={() => (inputIndex = 0)} />
            </div>
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
            position: relative; // For top-right-component absolute position.
            padding: 10px;
            border: 1px solid #ccc;
            text-align: center;
            width: 400px;

            // Since svelte only supports transition for elements entering or leaving DOM a CSS transition is needed for elements that only change opacity.
            .full-opacity {
                transition: opacity 0.5s ease-in-out;
            }

            .not-full-opacity {
                opacity: 0.5;
                pointer-events: none;
                transition: opacity 0.5s ease-in-out;
            }

            .top-right-component {
                position: absolute;
                right: 5px;
                top: 5px;

                .top-right-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    height: 20px;
                    width: 100%;
                    padding: 0;

                    .top-right-button-icon {
                        height: 100%;
                        width: 100%;
                    }
                }
            }
        }
    }
</style>
