import { AirportFeeInterface } from "./airport_fee.interface";

export default interface AirportInterface extends AirportFeeInterface {
    code: string,
    name: string,
    country: string,
    is_private: boolean,
    reg_date?: string,
    update_date?: string,
    location_id?: number,
}