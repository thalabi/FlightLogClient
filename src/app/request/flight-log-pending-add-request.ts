import { FlightLog } from "../domain/flight-log";
import { FlightLogPending } from "../domain/FlightLogPending";

export interface FlightLogPendingAddRequest {
    flightLogPendingUri: URL
    flightLog: FlightLog
}