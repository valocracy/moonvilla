export interface whitelist {
    whitelist: number,
    address: string[]
}

export interface mintStatus {
    whitelist: number,
    status: boolean
}

export interface configMintAlien {
    alien_address: string,
    passport_address: string,
    catalog_address: string,
    mint_alien_address?: string
}

export interface startMintAlien {
    contracts:configMintAlien,
    config_whitelist: whitelist,
    tokens_uri: string[],
    status_mint: mintStatus
}

export interface CsvRow {
	timestamp: string;
	email: string;
	username: string;
	wallet: string;
	community: string;
}

export interface readCsvFile {
	fileName:string;
	csvRow:CsvRow[]
}