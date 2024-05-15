import { error } from '@sveltejs/kit';
import type LocationCoordinates from './LocationCoordinates';
import WiCloudy from 'svelte-icons/wi/WiCloudy.svelte';
import WiDayCloudy from 'svelte-icons/wi/WiDayCloudy.svelte';
import WiFog from 'svelte-icons/wi/WiFog.svelte';
import WiDayHail from 'svelte-icons/wi/WiDayHail.svelte';
import WiDayRain from 'svelte-icons/wi/WiDayRain.svelte';
import WiDaySunny from 'svelte-icons/wi/WiDaySunny.svelte';
import WiDayThunderstorm from 'svelte-icons/wi/WiDayThunderstorm.svelte';
import WiDaySunnyOvercast from 'svelte-icons/wi/WiDaySunnyOvercast.svelte';
import WiHail from 'svelte-icons/wi/WiHail.svelte';
import WiSnow from 'svelte-icons/wi/WiSnow.svelte';
import WiSnowflakeCold from 'svelte-icons/wi/WiSnowflakeCold.svelte';
import WiRainWind from 'svelte-icons/wi/WiRainWind.svelte';
import WiRain from 'svelte-icons/wi/WiRain.svelte';
import WiDayShowers from 'svelte-icons/wi/WiDayShowers.svelte';
import WiShowers from 'svelte-icons/wi/WiShowers.svelte';
import WiDaySnow from 'svelte-icons/wi/WiDaySnow.svelte';

export interface LocationWeatherData {
    location: LocationCoordinates;
    weatherData: WeatherData[];
}

export interface weatherCodeDescription {
    description: string;
    score: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
}

export interface WeatherData {
    date: string;
    code: number;
    codeDescription: weatherCodeDescription;
    percipation: number;
    percipationProbablility: number;
}

export const WeatherCodes: Readonly<{ [key: string]: weatherCodeDescription }> = {
    '0': { score: 0, description: 'Clear sky', icon: WiDaySunny },
    '1': { score: 10, description: 'Mainly clear', icon: WiDayCloudy },
    '2': { score: 10, description: 'Partly cloudy', icon: WiCloudy },
    '3': { score: 10, description: 'Overcast', icon: WiDaySunnyOvercast },
    '45': { score: 40, description: 'Fog', icon: WiFog },
    '48': { score: 50, description: 'Depositing rime fog', icon: WiSnowflakeCold },
    '51': { score: 20, description: 'Light drizzle', icon: WiDayRain },
    '53': { score: 30, description: 'Moderate drizzle', icon: WiRain },
    '55': { score: 40, description: 'Dense drizzle', icon: WiRainWind },
    '56': { score: 30, description: 'Light freezing drizzle', icon: WiDayRain },
    '57': { score: 40, description: 'Dense freezing drizzle', icon: WiRain },
    '61': { score: 30, description: 'Slight rain', icon: WiDayRain },
    '63': { score: 40, description: 'Moderate rain', icon: WiRain },
    '65': { score: 50, description: 'Heavy rain', icon: WiRainWind },
    '66': { score: 40, description: 'Light freezing rain', icon: WiDayRain },
    '67': { score: 50, description: 'Heavy freezing rain', icon: WiRainWind },
    '71': { score: 40, description: 'Slight snow fall', icon: WiDaySnow },
    '73': { score: 50, description: 'Moderate snow fall', icon: WiSnow },
    '75': { score: 60, description: 'Heavy snow fall', icon: WiSnow },
    '77': { score: 50, description: 'Snow grains', icon: WiSnowflakeCold },
    '80': { score: 30, description: 'Slight rain showers', icon: WiDayShowers },
    '81': { score: 40, description: 'Moderate rain showers', icon: WiShowers },
    '82': { score: 50, description: 'Violent rain showers', icon: WiShowers },
    '85': { score: 40, description: 'Slight snow shower', icon: WiDaySnow },
    '86': { score: 50, description: 'Heavy snow shower', icon: WiSnow },
    '95': { score: 50, description: 'Slight or moderate thunderstorm', icon: WiDayThunderstorm },
    '96': { score: 60, description: 'Thunderstorm with slight hail', icon: WiDayHail },
    '99': { score: 70, description: 'Thunderstorm with heavy hail', icon: WiHail }
};

export const fetchWeatherData = async (
    location: LocationCoordinates
): Promise<LocationWeatherData> => {
    // TODO: make number of days configurable
    const baseUrl = 'https://api.open-meteo.com/v1/forecast';
    const url = `${baseUrl}?latitude=${location.latitude}&longitude=${location.longitude}&daily=weather_code,precipitation_sum,precipitation_probability_max`;
    const response = await fetch(url);
    if (!response.ok) {
        throw error(response.status, response.statusText);
    }

    const responseJson = await response.json();
    let weatherData: WeatherData[] = [];
    for (let index = 0; index < responseJson.daily.time.length; index++) {
        weatherData = [
            ...weatherData,
            {
                date: responseJson.daily.time[index],
                code: responseJson.daily.weather_code[index],
                codeDescription: WeatherCodes[+responseJson.daily.weather_code[index]],
                percipation: responseJson.daily.precipitation_sum[index],
                percipationProbablility: responseJson.daily.precipitation_probability_max[index]
            }
        ];
    }

    return {
        location: {
            name: location.name,
            latitude: responseJson.latitude as number,
            longitude: responseJson.longitude as number
        } as LocationCoordinates,
        weatherData: weatherData as WeatherData[]
    };
};

/**
 * Compare the weather of 2 locations and calculate the final score. Score is based on the total percipation,
 * day by percipation comparison and day by day weather code comparison.
 * @param data1 of the data to compare.
 * @param data2 of the data to compare.
 * @returns score of the two weather locations. Score value in the range of [0,1] where lower
 * number corresponds to data1 being better. A score of 0.5 means both locations are equal.
 */
export const calculateWeatherScore = (
    data1: LocationWeatherData,
    data2: LocationWeatherData
): number => {
    let totalPercipation1 = 0;
    let totalPercipation2 = 0;
    let dayPercipationComparison = 0; // Days better than target
    let dayCodeComparison = 0; // Days better than target
    const numberOfDays = Math.min(data1.weatherData.length, data2.weatherData.length);

    for (let index = 0; index < numberOfDays; index++) {
        const day1 = data1.weatherData[index];
        const day2 = data2.weatherData[index];

        // Total percipation
        totalPercipation1 += day1.percipation;
        totalPercipation2 += day2.percipation;

        // Daily percipation comparison
        // If percipation probability difference is less than 10% then assume the probability is the same.
        if (Math.abs(day1.percipationProbablility - day2.percipationProbablility) < 10) {
            dayPercipationComparison += 0.5;
        } else if (day1.percipationProbablility < day2.percipationProbablility) {
            dayPercipationComparison += 1;
        }

        // Daily weather code comparison
        if (day1.codeDescription.score == day2.codeDescription.score) {
            dayCodeComparison += 0.5;
        } else if (day1.percipationProbablility < day2.percipationProbablility) {
            dayCodeComparison += 1;
        }
    }

    // Score for total percipation - 1-x/x+y
    let finalPercipationScore: number;
    if (Math.abs(totalPercipation1 - totalPercipation2) < 0.1) {
        finalPercipationScore = 0.5;
    } else {
        finalPercipationScore = 1 - totalPercipation1 / (totalPercipation1 + totalPercipation2);
    }

    // Score for daily percipation comparison - score/#days
    const finalDayPercipationScore = dayPercipationComparison / numberOfDays;

    // Score for daily weather code comparison - score/#days
    const finalDayCodeScore = dayCodeComparison / numberOfDays;

    // Final score = total percipation (25%), daily percipation comparison (25%) and daily code comparison (50%)
    return finalPercipationScore * 0.25 + finalDayPercipationScore * 0.25 + finalDayCodeScore * 0.5;
};
