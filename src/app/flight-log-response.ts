import { FlightLog } from "./flight-log";
import { HalResponseLinks } from "./hal-response-links";
import { HalResponsePage } from "./hal-response-page";
//import { FlightLogs } from "./flight-logs";

export class FlightLogResponse {
    //_embedded: FlightLogs;
    _embedded: Embedded;
    _links: HalResponseLinks;
    page: HalResponsePage;
}

// class FlightLogs {
//     flightLogArray: Array<FlightLog>;
// }
class Embedded {
    flightLogs: Array<FlightLog>;
}
