import { ISingleColumnEntity } from "./i-single-column-entity";

export class Pilot implements ISingleColumnEntity {
    id: number;

    pilot: string;

    created: Date;
    modified: Date;
    
    _links: {self: {href: string}};
}
