export interface LocationCoordinates {
    latitude: number;
    longitude: number;
}

export interface CityLocation extends LocationCoordinates {
    name: string;
}
