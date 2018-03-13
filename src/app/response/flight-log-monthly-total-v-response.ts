import { FlightLog } from "../domain/flight-log";
import { HalResponseLinks } from "../hal/hal-response-links";
import { HalResponsePage } from "../hal/hal-response-page";
import { FlightLogMonthlyTotalV } from "../domain/flight-log-monthly-total-v";
//import { FlightLogs } from "./flight-logs";

export class FlightLogMonthlyTotalVResponse {
    _embedded: {flightLogMonthlyTotalVs: Array<FlightLogMonthlyTotalV>}
    _links: HalResponseLinks;
    page: HalResponsePage;
}
