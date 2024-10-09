export interface billing_control {
  id?: number;
  client_stur_id?: string;
  client_name?: string;
  emissor_name?: string;
  emissor_stur_id?: number;
  billing_type?: string;
  doc?: string,
  comments?:string,
  status?:boolean,
  lei_kandir?: boolean;
  irrf?: boolean;
  due_date?: string;
  discount?: string;
  service_fee?: string;
  agency_id?: number;
}

