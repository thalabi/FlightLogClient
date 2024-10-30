import { FlightLog } from "../domain/flight-log";
import { HalResponseLinks } from "../hal/hal-response-links";
import { HalResponsePage } from "../hal/hal-response-page";
import { FlightLogMonthlyTotalV } from "../domain/flight-log-monthly-total-v";

export interface FlightLogMonthlyTotalVResponse {
    _embedded: { flightLogMonthlyTotalVs: Array<FlightLogMonthlyTotalV> }
    _links: HalResponseLinks;
    page: HalResponsePage;
}
