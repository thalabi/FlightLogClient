import { HalResponseLinks } from "../hal/hal-response-links";
import { HalResponsePage } from "../hal/hal-response-page";
import { IFlightLogTotalsV } from "./IFlightLogTotalsV";

export interface IFlightLogTotalsVResponse {
    _embedded: Embedded;
    _links: HalResponseLinks;
    page: HalResponsePage;

}

interface Embedded {
    simpleModels: Array<IFlightLogTotalsV>;
}
