<script lang="ts">
    import { type LocationWeatherData } from '$lib/utils/WeatherUtils';
    export let data: LocationWeatherData;
</script>

<div>
    <h2>
        Weather for: {data ? `${data.location.latitude}:${data.location.longitude}` : 'N/A'}
    </h2>
    <div class="table">
        <div class="row">
            <div class="cell">Date</div>
            <div class="cell">Code</div>
            <div class="cell">Description</div>
            <div class="cell">Percipation</div>
            <div class="cell">Probability</div>
        </div>
        {#if data}
            {#each data.weatherData as weatherData}
                <div class="row">
                    <div class="cell">{weatherData.date}</div>
                    <div class="cell">{weatherData.code}</div>
                    <div class="cell">{weatherData.codeDescription}</div>
                    <div class="cell">{weatherData.percipation}</div>
                    <div class="cell">{weatherData.percipationProbablility}</div>
                </div>
            {/each}
        {/if}
    </div>
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
            }
        }
    }
</style>
