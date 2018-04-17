export interface ITwoColumnEntity{
    id: number;

    [colums: string]: any;

    created: Date;
    modified: Date;
    
    _links: {self: {href: string}};
}