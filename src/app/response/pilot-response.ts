import { Pilot } from "../domain/pilot";
import { HalResponseLinks } from "../hal/hal-response-links";
import { HalResponsePage } from "../hal/hal-response-page";

export class PilotResponse {
    _embedded: Embedded;
    _links: HalResponseLinks;
    page: HalResponsePage;
}

class Embedded {
    pilots: Array<Pilot>;
}
