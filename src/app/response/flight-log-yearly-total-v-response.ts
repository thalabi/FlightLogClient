import { FlightLog } from "../domain/flight-log";
import { HalResponseLinks } from "../hal/hal-response-links";
import { HalResponsePage } from "../hal/hal-response-page";
import { FlightLogYearlyTotalV } from "../domain/flight-log-yearly-total-v";

export class FlightLogYearlyTotalVResponse {
    _embedded: {flightLogYearlyTotalVs: Array<FlightLogYearlyTotalV>}
    _links: HalResponseLinks;
    page: HalResponsePage;
}
