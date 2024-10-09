export interface VoucherRequestLegsInterface {
    iata: string,
    from: string,
    to: string,
    dep_date: string,
    dep_hour: string,
    arr_date: string,
    arr_hour: string,
    service_class: string,
    flight_number: string
}

export interface VoucherRequestPaxInterface {
    first_name: string,
    last_name: string,
    e_ticket: string,
    type: string,
    tariff: number,
    tax: number
}

export interface VoucherRequestInterface {
    locator: string,
    agency_name: string,
    client_name: string,
    issuer_name: string,
    email: string,
    phone: string,
    baggage_qtt: number,
    paxs: Array<VoucherRequestPaxInterface>,
    itinerary: {
        from: string,
        to: string,
        iata: string,
        legs: Array<VoucherRequestLegsInterface>
    }
}