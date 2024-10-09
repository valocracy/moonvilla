export interface IssuePaxInterface {
  id?: number;
  first_name?: string,
  last_name?: string,
  pax_doc?: string;
  ticket?: string;
  voucher_id?: number;
  voucher_number?: string;
  issue_id?: number;
  voucher?: string | null,
  reg_date?: Date;
  update_date?: Date;
}
