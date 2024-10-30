import { FlightLog } from "../domain/flight-log";
import { HalResponseLinks } from "../hal/hal-response-links";
import { HalResponsePage } from "../hal/hal-response-page";
//import { FlightLogs } from "./flight-logs";

export interface FlightLogResponse {
    //_embedded: FlightLogs;
    _embedded: Embedded;
    _links: HalResponseLinks;
    page: HalResponsePage;
}

// class FlightLogs {
//     flightLogArray: Array<FlightLog>;
// }
interface Embedded {
    flightLogs: Array<FlightLog>;
}
