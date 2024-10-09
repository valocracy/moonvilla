import env from "@/config";
import SturDatabaseFactoryInterface from "@/interfaces/SturDatabaseFactory.interface";
import { getErrorMessage } from "./response.collection";

const {
    STUR_DBS_TO_CONNECT,
    SQLSVR_WTL_HOSTNAME,
    SQLSVR_WTL_PORT,
    SQLSVR_WTL_USERNAME,
    SQLSVR_WTL_PASSWORD,
    SQLSVR_WTL_NAME,
    SQLSVR_FACTO_PORT,
    SQLSVR_FACTO_HOSTNAME,
    SQLSVR_FACTO_USERNAME,
    SQLSVR_FACTO_PASSWORD,
    SQLSVR_FACTO_NAME,
    SQLSVR_TESTE_HOSTNAME,
    SQLSVR_TESTE_PORT,
    SQLSVR_TESTE_USERNAME,
    SQLSVR_TESTE_PASSWORD,
    SQLSVR_TESTE_NAME,
    SQLSVR_SCHMIDT_HOSTNAME,
    SQLSVR_SCHMIDT_PORT,
    SQLSVR_SCHMIDT_USERNAME,
    SQLSVR_SCHMIDT_PASSWORD,
    SQLSVR_SCHMIDT_NAME,
    SQLSVR_RRF_HOSTNAME,
    SQLSVR_RRF_PORT,
    SQLSVR_RRF_USERNAME,
    SQLSVR_RRF_PASSWORD,
    SQLSVR_RRF_NAME,
    SQLSVR_MERU_HOSTNAME,
    SQLSVR_MERU_PORT,
    SQLSVR_MERU_USERNAME,
    SQLSVR_MERU_PASSWORD,
    SQLSVR_MERU_NAME,
    SQLSVR_AR_HOSTNAME,
    SQLSVR_AR_PORT,
    SQLSVR_AR_USERNAME,
    SQLSVR_AR_PASSWORD,
    SQLSVR_AR_NAME,
    SQLSVR_VOARE_HOSTNAME,
    SQLSVR_VOARE_PORT,
    SQLSVR_VOARE_USERNAME,
    SQLSVR_VOARE_NAME,
    SQLSVR_VOARE_PASSWORD,
    SQLSVR_PP_HOSTNAME,
    SQLSVR_VOAR_HOSTNAME,
    SQLSVR_VOAR_PORT,
    SQLSVR_VOAR_USERNAME,
    SQLSVR_VOAR_NAME,
    SQLSVR_VOAR_PASSWORD,
    SQLSVR_PP_PORT,
    SQLSVR_PP_USERNAME,
    SQLSVR_PP_NAME,
    SQLSVR_PP_PASSWORD,
    SQLSVR_PORTAL_HOSTNAME,
    SQLSVR_PORTAL_PORT,
    SQLSVR_PORTAL_USERNAME,
    SQLSVR_PORTAL_NAME,
    SQLSVR_PORTAL_PASSWORD,
    SQLSVR_ESTAU_NAME,
    SQLSVR_ESTAU_HOSTNAME,
    SQLSVR_ESTAU_PORT,
    SQLSVR_ESTAU_USERNAME,
    SQLSVR_ESTAU_PASSWORD,
    SQLSVR_WOOBA_HOSTNAME,
    SQLSVR_WOOBA_PORT,
    SQLSVR_WOOBA_USERNAME,
    SQLSVR_WOOBA_PASSWORD,
    SQLSVR_WOOBA_NAME
} = env;

export default class SturDatabaseFactory {
    private static stursName: Array<string> = STUR_DBS_TO_CONNECT.split(',');

    public static getStursName = (): Array<string> => {
        return this.stursName;
    }

    getAllSturs(): Array<SturDatabaseFactoryInterface> {
        return SturDatabaseFactory.stursName.map((sturAgency) => this.getStur(sturAgency));
    }

    getStur(database: string): SturDatabaseFactoryInterface {
        switch (database) {
            case 'WTL':
                return {
                    config: {
                        name: SQLSVR_WTL_NAME,
                        ip: SQLSVR_WTL_HOSTNAME,
                        port: SQLSVR_WTL_PORT,
                        username: SQLSVR_WTL_USERNAME,
                        password: SQLSVR_WTL_PASSWORD,
                    }
                };
            case 'FACTO':
                return {
                    config: {
                        name: SQLSVR_FACTO_NAME,
                        ip: SQLSVR_FACTO_HOSTNAME,
                        port: SQLSVR_FACTO_PORT,
                        username: SQLSVR_FACTO_USERNAME,
                        password: SQLSVR_FACTO_PASSWORD,
                    }
                };
            case 'STURRRF':
                return {
                    config: {
                        name: SQLSVR_RRF_NAME,
                        ip: SQLSVR_RRF_HOSTNAME,
                        port: SQLSVR_RRF_PORT,
                        username: SQLSVR_RRF_USERNAME,
                        password: SQLSVR_RRF_PASSWORD,
                    }
                };

            case 'MERU':
                return {
                    config: {
                        name: SQLSVR_MERU_NAME,
                        ip: SQLSVR_MERU_HOSTNAME,
                        port: SQLSVR_MERU_PORT,
                        username: SQLSVR_MERU_USERNAME,
                        password: SQLSVR_MERU_PASSWORD,
                    }
                };
            case 'VOARE':
                return {
                    config: {
                        name: SQLSVR_VOARE_NAME,
                        ip: SQLSVR_VOARE_HOSTNAME,
                        port: SQLSVR_VOARE_PORT,
                        username: SQLSVR_VOARE_USERNAME,
                        password: SQLSVR_VOARE_PASSWORD,
                    }
                }
            case 'PP':
                return {
                    config: {
                        name: SQLSVR_PP_NAME,
                        ip: SQLSVR_PP_HOSTNAME,
                        port: SQLSVR_PP_PORT,
                        username: SQLSVR_PP_USERNAME,
                        password: SQLSVR_PP_PASSWORD,
                    }
                }
            case 'STURPORTAL':
                return {
                    config: {
                        name: SQLSVR_PORTAL_NAME,
                        ip: SQLSVR_PORTAL_HOSTNAME,
                        port: SQLSVR_PORTAL_PORT,
                        username: SQLSVR_PORTAL_USERNAME,
                        password: SQLSVR_PORTAL_PASSWORD,
                    }
                }
            case 'STURWIN_AR':
                return {
                    config: {
                        name: SQLSVR_AR_NAME,
                        ip: SQLSVR_AR_HOSTNAME,
                        port: SQLSVR_AR_PORT,
                        username: SQLSVR_AR_USERNAME,
                        password: SQLSVR_AR_PASSWORD,
                    }
                }
            case 'VOAR':
                return {
                    config: {
                        name: SQLSVR_VOAR_NAME,
                        ip: SQLSVR_VOAR_HOSTNAME,
                        port: SQLSVR_VOAR_PORT,
                        username: SQLSVR_VOAR_USERNAME,
                        password: SQLSVR_VOAR_PASSWORD,
                    }
                }
            case 'STURBD_ESTAU':
                return {
                    config: {
                        name: SQLSVR_ESTAU_NAME,
                        ip: SQLSVR_ESTAU_HOSTNAME,
                        port: SQLSVR_ESTAU_PORT,
                        username: SQLSVR_ESTAU_USERNAME,
                        password: SQLSVR_ESTAU_PASSWORD,
                    }
                }
            case 'LUCAO':
                return {
                    config: {
                        name: SQLSVR_TESTE_NAME,
                        ip: SQLSVR_TESTE_HOSTNAME,
                        port: SQLSVR_TESTE_PORT,
                        username: SQLSVR_TESTE_USERNAME,
                        password: SQLSVR_TESTE_PASSWORD,
                    }
                };
            case 'SCHMIDT':
                return {
                    config: {
                        name: SQLSVR_SCHMIDT_NAME,
                        ip: SQLSVR_SCHMIDT_HOSTNAME,
                        port: SQLSVR_SCHMIDT_PORT,
                        username: SQLSVR_SCHMIDT_USERNAME,
                        password: SQLSVR_SCHMIDT_PASSWORD,
                    }
                };
            case 'WOOBA':
                return {
                    config: {
                        name: SQLSVR_WOOBA_NAME,
                        ip: SQLSVR_WOOBA_HOSTNAME,
                        port: SQLSVR_WOOBA_PORT,
                        username: SQLSVR_WOOBA_USERNAME,
                        password: SQLSVR_WOOBA_PASSWORD,
                    }
                };
            default:
                throw Error(getErrorMessage('noDatabaseNameFound'));
        }
    }
}