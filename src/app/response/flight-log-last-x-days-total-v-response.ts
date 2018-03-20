import { FlightLog } from "../domain/flight-log";
import { HalResponseLinks } from "../hal/hal-response-links";
import { HalResponsePage } from "../hal/hal-response-page";
import { FlightLogLastXDaysTotalV } from "../domain/flight-log-last-x-days-total-v";

export class FlightLogLastXDaysTotalVResponse {
    _embedded: {flightLogLastXDaysTotalVs: Array<FlightLogLastXDaysTotalV>}
    _links: HalResponseLinks;
    page: HalResponsePage;
}
