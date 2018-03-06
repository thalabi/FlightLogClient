import { ISingleColumnEntity } from "./i-single-column-entity";

export class MakeModel implements ISingleColumnEntity {
    id: number;
    
    name: string;

    created: Date;
    modified: Date;
    
    _links: {self: {href: string}};
}
