import { FlightLogPending } from "../domain/FlightLogPending";
import { HalResponseLinks } from "./hal/hal-response-links";
import { HalResponsePage } from "./hal/hal-response-page";

export interface FlightLogPendingResponse {
    _embedded:
    | { flightLogPendings: Array<FlightLogPending>; simpleModels?: never } // produced by HATEOS
    | { simpleModels: Array<FlightLogPending>; flightLogPendings?: never }; // produced by GenericEntityController

    _links: HalResponseLinks;
    page: HalResponsePage;
}