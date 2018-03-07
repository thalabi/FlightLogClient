import { ISingleColumnEntity } from "./i-single-column-entity";

export class Registration implements ISingleColumnEntity {
    id: number;

    registration: string;

    created: Date;
    modified: Date;
    
    _links: {self: {href: string}};
}
