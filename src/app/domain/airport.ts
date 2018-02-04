export class Airport {
    id: number;
    identifier: string;
    name: string;
    province: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    upperWindsStationId: string;

    created: Date;
    modified: Date;
    
    _links: {airport: {href: string}};
}
