export class Registration {
    id: number;
    name: string;

    created: Date;
    modified: Date;
    
    _links: {registration: {href: string}};
}
