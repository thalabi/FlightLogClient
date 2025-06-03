export interface FlightLogPending {
    id: number
    flightDate: Date
    routeFrom: string
    routeTo: string
    flightTime: number
    registration: string
    makeModel: string
    version: number // result returned by custom queries use this field
    rowVersion: number // result returned by JPA Data Rest uses this field
    _links: {
        self: {
            href: URL
        },
        fuelLog: {
            href: URL
        }
    }
}