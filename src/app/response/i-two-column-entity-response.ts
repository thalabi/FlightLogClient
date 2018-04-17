import { Registration } from "../domain/registration";
import { HalResponseLinks } from "../hal/hal-response-links";
import { HalResponsePage } from "../hal/hal-response-page";
import { ITwoColumnEntity } from "../domain/i-two-column-entity";

export interface ITwoColumnEntityResponse {
    _embedded: {[rows: string]: Array<ITwoColumnEntity>}
    _links: HalResponseLinks;
    page: HalResponsePage;
}
