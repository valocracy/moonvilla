export default interface GetInconsistenciePayloadInterface {
    agency: string,
    client_id?: number
    start_date?: string,
    end_date?: string
    bill_num?: string
}