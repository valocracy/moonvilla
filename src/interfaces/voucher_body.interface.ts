export interface PaxVoucherDataInterface {
    pax_doc?: string,
    ticket?: string    
}

export interface VoucherBodyInterface {
    wooba_id: number,
    paxs: Array<PaxVoucherDataInterface> 
}