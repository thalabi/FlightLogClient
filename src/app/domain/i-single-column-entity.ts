export interface ISingleColumnEntity{
    id: number;

    [colum1: string]: any;

    created: Date;
    modified: Date;
    
    _links: {self: {href: string}};
}