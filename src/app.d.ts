// See https://kit.svelte.dev/docs/types#app

import type LocationCoordinates from '$lib/utils/LocationCoordinates';

// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        interface PageData {
            cities: LocationCoordinates[];
        }
        // interface PageState {}
        // interface Platform {}
    }
}

export {};
