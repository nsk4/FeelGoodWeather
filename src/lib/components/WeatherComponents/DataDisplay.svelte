<script lang="ts">
    import { type LocationWeatherData } from '$lib/utils/WeatherUtils';
    export let data: LocationWeatherData[];
</script>

<div>
    {#if data && data[0] && data[0].weatherData}
        <div class="table">
            <div class="row">
                <div class="cell">Date</div>
                {#each data as dataItem}
                    <div class="cell">
                        <p>{dataItem.location.name}</p>
                        <p>{`${dataItem.location.latitude}:${dataItem.location.longitude}`}</p>
                    </div>
                {/each}
            </div>
            {#each data[0].weatherData as weatherData}
                <div class="row">
                    <div class="cell">{weatherData.date}</div>
                    {#each data as dataItem}
                        {#if dataItem.weatherData.find((w) => w.date === weatherData.date)}
                            <div class="cell">
                                {#each dataItem.weatherData as wd}
                                    {#if wd.date === weatherData.date}
                                        {wd.percipation}mm | {wd.percipationProbablility}%
                                        <p>
                                            <span style:height="60px" style:display="inline-block">
                                                <svelte:component this={wd.codeDescription.icon} />
                                            </span>
                                        </p>
                                    {/if}
                                {/each}
                            </div>
                        {:else}
                            <div class="cell"></div>
                        {/if}
                    {/each}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style lang="scss">
    .table {
        display: table;
        border-collapse: collapse;
        width: 100%;

        .row {
            display: table-row;

            .cell {
                display: table-cell;
                border: 1px solid #30363d;
                padding: 8px;
                text-align: center;
            }
        }
    }
</style>
