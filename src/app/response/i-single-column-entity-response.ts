import { Registration } from "../domain/registration";
import { HalResponseLinks } from "../hal/hal-response-links";
import { HalResponsePage } from "../hal/hal-response-page";
import { ISingleColumnEntity } from "../domain/i-single-column-entity";

export interface ISingleColumnEntityResponse {
    _embedded: {[rows: string]: Array<ISingleColumnEntity>}
    _links: HalResponseLinks;
    page: HalResponsePage;
}
