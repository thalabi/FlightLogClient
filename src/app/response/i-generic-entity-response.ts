import { Registration } from "../domain/registration";
import { HalResponseLinks } from "../hal/hal-response-links";
import { HalResponsePage } from "../hal/hal-response-page";
import { IGenericEntity } from "../domain/i-gerneric-entity";

export interface IGenericEntityResponse {
    _embedded: {[rows: string]: Array<IGenericEntity>}
    _links: HalResponseLinks;
    page: HalResponsePage;
}
