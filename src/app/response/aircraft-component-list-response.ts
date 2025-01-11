import { Registration } from "../domain/registration";
import { HalResponseLinks } from "../hal/hal-response-links";
import { HalResponsePage } from "../hal/hal-response-page";
import { IGenericEntity } from "../domain/i-gerneric-entity";
import { AircraftComponent } from "../domain/aircraft-component";

export interface AircraftComponentListResponse {
    _embedded: { componentModels: Array<AircraftComponent> }
    _links: HalResponseLinks;
    page: HalResponsePage;
}
