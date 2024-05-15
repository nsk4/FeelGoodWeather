<script lang="ts">
    import { type LocationWeatherData } from '$lib/utils/WeatherUtils';
    export let data: LocationWeatherData[];
</script>

<div>
    {#if data && data[0]}
        <div class="table">
            <div class="row">
                <div class="cell">Location</div>
                {#each data[0].weatherData as weatherData}
                    <div class="cell">{weatherData.date}</div>
                {/each}
            </div>
            {#each data as dataItem}
                {#if dataItem}
                    <div class="row">
                        <div class="cell">
                            <p>{dataItem.location.name}</p>
                            <p>{`${dataItem.location.latitude}:${dataItem.location.longitude}`}</p>
                        </div>
                        {#each dataItem.weatherData as weatherData}
                            <div class="cell">
                                {weatherData.percipation}mm | {weatherData.percipationProbablility}%
                                <p>
                                    <span style:height="60px" style:display="inline-block">
                                        <svelte:component this={weatherData.codeDescription.icon} />
                                    </span>
                                </p>
                            </div>
                        {/each}
                    </div>
                {/if}
            {/each}
        </div>
    {/if}
</div>

<style lang="scss">
    * {
        background-color: #c5c6d0;
    }

    .table {
        display: table;
        border-collapse: collapse;
        width: 100%;

        .row {
            display: table-row;

            .cell {
                display: table-cell;
                border: 1px solid #ccc;
                padding: 8px;
                text-align: center;
            }
        }
    }
</style>
