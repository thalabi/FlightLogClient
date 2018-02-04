import { Airport } from "../domain/airport";
import { HalResponseLinks } from "../hal/hal-response-links";
import { HalResponsePage } from "../hal/hal-response-page";

export class AirportResponse {
    _embedded: Embedded;
    _links: HalResponseLinks;
    page: HalResponsePage;
}

class Embedded {
    airports: Array<Airport>;
}
