import { error } from '@sveltejs/kit';
import type { LocationCoordinates } from './DataTypes';

export interface LocationWeatherData {
    location: LocationCoordinates;
    weatherData: WeatherData[];
}

export interface WeatherData {
    date: string;
    code: number;
    codeDescription: string;
    percipation: number;
    percipationProbablility: number;
}

export const WeatherCodes: Readonly<{ [key: string]: string }> = {
    '0': 'Clear sky',
    '1': 'Mainly clear',
    '2': 'Partly cloudy',
    '3': 'Overcast',
    '45': 'Fog',
    '48': 'Depositing rime fog',
    '51': 'Light drizzle',
    '53': 'Moderate drizzle',
    '55': 'Dense drizzle',
    '56': 'Light freezing drizzle',
    '57': 'Dense freezing drizzle',
    '61': 'Slight rain',
    '63': 'Moderate rain',
    '65': 'Heavy rain',
    '66': 'Light freezing rain',
    '67': 'Heavy freezing rain',
    '71': 'Slight snow fall',
    '73': 'Moderate snow fall',
    '75': 'Heavy snow fall',
    '77': 'Snow grains',
    '80': 'Slight rain showers',
    '81': 'Moderate rain showers',
    '82': 'Violent rain showers',
    '85': 'Slight snow shower',
    '86': 'Heavy snow shower',
    '95': 'Slight or moderate thunderstorm',
    '96': 'Thunderstorm with slight hail',
    '99': 'Thunderstorm with heavy hail'
};

export const fetchWeatherData = async (
    location: LocationCoordinates
): Promise<LocationWeatherData> => {
    // TODO: make number of days configurable
    const baseUrl = 'https://api.open-meteo.com/v1/forecast';
    const url = `${baseUrl}?latitude=${location.latitude}&longitude=${location.longitude}&daily=weather_code,precipitation_sum,precipitation_probability_max`;
    const response = await fetch(url);
    if (!response.ok) {
        console.log(response, response.status, response.statusText);
        throw error(response.status, response.statusText);
    }

    const responseJson = await response.json();
    console.log(responseJson);
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
            latitude: responseJson.latitude as number,
            longitude: responseJson.longitude as number
        } as LocationCoordinates,
        weatherData: weatherData as WeatherData[]
    };
};

/**
 * Compare the weather of 2 locations and calculate the final score. Score is based on the day by
 * day comparison of the weather and a total percipation. When calculating percipation, an
 * expected daily percipation is multiplied by the percipation probability.
 * @param data1 of the data to compare.
 * @param data2 of the data to compare.
 * @returns score of the two weather locations. Score value in the range of [0,1] where lower
 * number corresponds to data1 being better. A score of 0.5 means both locations are equal.
 */
export const calculateWeatherScore = (
    data1: LocationWeatherData,
    data2: LocationWeatherData
): number => {
    // TODO: check that the days and the amount of days is the same for both
    let totalPercipation1 = 0;
    let totalPercipation2 = 0;
    let dayComparison = 0; // Number of days better than target.

    for (let index = 0; index < data1.weatherData.length; index++) {
        const day1 = data1.weatherData[index];
        totalPercipation1 += day1.percipation;

        const day2 = data2.weatherData[index];
        totalPercipation2 += day2.percipation;

        // If percipation probability difference is less than 10% then assume the probability is the same.
        if (Math.abs(day1.percipationProbablility - day2.percipationProbablility) < 10) {
            dayComparison += 0.5;
        } else if (day1.percipationProbablility < day2.percipationProbablility) {
            dayComparison += 1;
        }
    }

    // Score for days - score/#days
    const finalDayScore = dayComparison / data1.weatherData.length;

    // Score for percipation - 1-x/x+y
    let finalPercipationScore: number;
    if (Math.abs(totalPercipation1 - totalPercipation2) < 0.1) {
        finalPercipationScore = 0.5;
    } else {
        finalPercipationScore = 1 - totalPercipation1 / (totalPercipation1 + totalPercipation2);
    }

    // Final score = day comparison (80%) and total percipation (20%)
    return finalDayScore * 0.8 + finalPercipationScore * 0.2;
};
