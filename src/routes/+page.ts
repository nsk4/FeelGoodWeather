import type LocationCoordinates from '$lib/utils/LocationCoordinates';
import type { PageLoad } from './$types';

export const prerender = true;
export const ssr = false;

export const load: PageLoad = async ({ fetch }) => {
    const response = await fetch('cityLocations.csv');
    const text = await response.text();
    const cities = text?.split(/\r?\n/g)?.flatMap((line) => {
        const splits = line.split('\t');
        if (splits.length >= 3) {
            return {
                name: splits[0],
                latitude: +splits[1],
                longitude: +splits[2]
            } as LocationCoordinates;
        } else {
            return [];
        }
    });

    return { cities };
};
