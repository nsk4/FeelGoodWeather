<script lang="ts">
    import { type LocationWeatherData } from '$lib/utils/WeatherUtils';
    export let data: LocationWeatherData[];
</script>

<div>
    {#if data && data[0] && data[0].weatherData}
        <table>
            <tr>
                <td>Date</td>

                {#each data as dataItem}
                    <td>
                        <p>{dataItem.location.name}</p>
                        <p>{`${dataItem.location.latitude}:${dataItem.location.longitude}`}</p>
                    </td>
                {/each}
            </tr>

            {#each data[0].weatherData as weatherData}
                <tr>
                    <td>{weatherData.date}</td>
                    {#each data as dataItem}
                        {#if dataItem.weatherData.find((w) => w.date === weatherData.date)}
                            <td>
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
                            </td>
                        {:else}
                            <div class="cell"></div>
                        {/if}
                    {/each}
                </tr>
            {/each}
        </table>
    {/if}
</div>

<style lang="scss">
    table {
        width: 100%;
        border: 1px solid #30363d;
        border-radius: 6px;
        border-spacing: 0;
        tr {
            td {
                border-bottom: 1px solid #30363d;
                border-right: 1px solid #30363d;
                padding: 8px;
                text-align: center;
            }
            td:last-child {
                border-right: none;
            }
        }

        tr:last-child > td {
            border-bottom: none;
        }
    }
</style>
