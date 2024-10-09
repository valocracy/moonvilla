import { sleep } from "@/helpers/util";
import MysqlService from "@/services/mysql.service";
import SqlServerService from "@/services/sqlserver.service";
import { ConnectionPool } from "mssql";

export default class Database {
    private static connection: any = MysqlService.getConnection();

    constructor() { }

    async getConnection() {
        if (!(await Database.connection) || (await Database.connection).pool._closed) {
            if (Database.connection) {
                (await Database.connection).end();
            }

            await sleep(2000);
            Database.connection = await MysqlService.getConnection(true);
        }

        return Database.connection;
    }
}