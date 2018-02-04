import { Registration } from "../domain/registration";
import { HalResponseLinks } from "../hal/hal-response-links";
import { HalResponsePage } from "../hal/hal-response-page";

export class RegistrationResponse {
    _embedded: Embedded;
    _links: HalResponseLinks;
    page: HalResponsePage;
}

class Embedded {
    registrations: Array<Registration>;
}
