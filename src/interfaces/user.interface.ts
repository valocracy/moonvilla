export interface UserInterface {
  id?: number;
  profile_name?: string;
  username: string;
  full_name?:string,
  email?:string,
  password: string;
  profile_pricture?: string;
  account_lvl?:number;
  phone: string;
  wooba_issuer_id?: number;
  permission_category_id?:number;
  reg_date?: Date;
  update_date?: Date;
}

export interface UserSturInterface {
  id?: number;
  user_id: string;
  user_stur_id: string;
  stur_agency_id: string;
}
