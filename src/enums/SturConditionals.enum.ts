export enum  SturConditionalsReservaEnum {
    DTEMISSAO_BETWHENN = "DTEMISSAO BETWEEN @start_date AND @end_date",
    STATUS_OPEN = "(STATUS != 'RESERVADA' AND STATUS != 'CONFIRMADA')",
    AERIAL_ONLY = "(CODPROD = 100 OR CODPROD = 110)",
    FT_NUM = "(NUMFAT = @ft_num)"
}