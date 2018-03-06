import { ISingleColumnEntity } from "./i-single-column-entity";

export class Registration implements ISingleColumnEntity {
    id: number;

    name: string;

    created: Date;
    modified: Date;
    
    _links: {self: {href: string}};
}
