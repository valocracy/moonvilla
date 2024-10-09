export interface bills {
  id?: number;
  codclifor?: number;
  nomclifor: string;
  fatura: string;
  centrodecusto: string;
  dataemissao?: Date;
  datavencimento?: Date;
  daysDue?: number;
  valorbruto: any;
  desconto: any;
  valor: any;
}

