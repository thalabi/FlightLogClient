import { HalHref } from "./hal-href";

export class HalResponseLinks {
    first: HalHref;
    prev: HalHref;
    self: HalHref;
    next: HalHref;
    last: HalHref;
    profile: HalHref;
    search: HalHref;
}
