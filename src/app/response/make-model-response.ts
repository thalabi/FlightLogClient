import { MakeModel } from "../domain/make-model";
import { HalResponseLinks } from "../hal/hal-response-links";
import { HalResponsePage } from "../hal/hal-response-page";

export class MakeModelResponse {
    _embedded: Embedded;
    _links: HalResponseLinks;
    page: HalResponsePage;
}

class Embedded {
    makeModels: Array<MakeModel>;
}
