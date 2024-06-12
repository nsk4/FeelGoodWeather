<script lang="ts">
    import { calculateWeatherScore, type LocationWeatherData } from '$lib/utils/WeatherUtils';

    export let source: LocationWeatherData;
    export let target: LocationWeatherData;
    const threshold = 0.6;
    let comparisonScore: number;
    let comparisonTitle: string;
    let comparisonMessage: string;
    $: {
        if (source && target) {
            comparisonScore = calculateWeatherScore(source, target);
            if (comparisonScore > threshold) {
                comparisonTitle = 'Feel good!';
                comparisonMessage =
                    betterWeatherDescriptions[
                        Math.floor(Math.random() * betterWeatherDescriptions.length)
                    ];
            } else if (comparisonScore < 1 - threshold) {
                comparisonTitle = 'Feel bad!';
                comparisonMessage =
                    worseWeatherDescriptions[
                        Math.floor(Math.random() * worseWeatherDescriptions.length)
                    ];
            } else {
                comparisonTitle = 'Feel the same!';
                comparisonMessage =
                    neutralWeatherDescriptions[
                        Math.floor(Math.random() * neutralWeatherDescriptions.length)
                    ];
            }
        }
    }

    const betterWeatherDescriptions = [
        "Oh, look at you with your perfect weather. Bet you're feeling pretty smug about that, huh?",
        "Congratulations, your weather is marginally better. You're still not winning at life though.",
        "Your weather is better, but let's be honest, it's not exactly beach weather.",
        "Well, well, well, aren't you Mr./Ms. Sunshine with your slightly better weather?",
        "You think your weather is better? That's cute.",
        'Wow, your weather is marginally better. What are you going to do with all this luxury?',
        'Oh joy, your weather is slightly less awful. Celebrate by staying indoors.',
        "Your weather is better, but let's not get carried away. It's still pretty miserable.",
        'Your weather is slightly less terrible. Enjoy it while it lasts.',
        "Your weather is better, but don't worry, something will come along to ruin it."
    ];

    const worseWeatherDescriptions = [
        'Ha! Your weather is worse than a soggy sandwich left out in the rain.',
        'Wow, your weather is actually worse than yesterday. Did you do something to upset the weather gods?',
        'Your weather is worse than a damp sock in a puddle.',
        'Congratulations, your weather is worse than a cold cup of coffee.',
        'Your weather is worse than a Monday morning commute.',
        'Your weather is worse than a bad hair day.',
        'Your weather is worse than watching paint dry.',
        'Your weather is worse than a flat tire on a rainy day.',
        'Your weather is worse than a broken umbrella in a storm.',
        'Your weather is worse than a canceled vacation.'
    ];

    const neutralWeatherDescriptions = [
        'Well, well, well, looks like you and the target are both stuck in the same miserable weather. How delightful for you both.',
        "You call this weather an improvement? It's like going from bad to slightly less bad.",
        'Your weather is as exciting as watching grass grow.',
        'Your weather is as uninspiring as a blank wall.',
        'Your weather is as thrilling as watching paint dry.',
        'Your weather is as lively as a graveyard at midnight.',
        'Your weather is as vibrant as a black-and-white movie.',
        'Your weather is as invigorating as a nap in a hammock.',
        'Your weather is as stimulating as reading the phone book.',
        'Your weather is as exhilarating as watching a pot boil.'
    ];
</script>

{#if comparisonTitle && comparisonMessage}
    <h2>{comparisonTitle}</h2>
    <p>{comparisonMessage}</p>
{/if}
