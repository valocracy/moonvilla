import SqlsrvDatabase from "./sqlsrv.database";
import { createBindParams } from '@/helpers/util';
import { queryFilterBillingControl } from "@/interfaces/queryFilterBillingControl";
class billingControlDatabase extends SqlsrvDatabase {
    constructor() { super() };


    async fetchAll(query:queryFilterBillingControl): Promise<any> {
        const conditions: string[] = [];
        const values: any[] = [];
      
        if (query?.agency_id) {
          conditions.push('agency_id = ?');
          values.push(query.agency_id);
        }
      
        if (query?.status) {
          conditions.push('status = ?');
          values.push(query.status);
        }
      
        let filter = '';
        if (conditions.length > 0) {
          filter = 'WHERE ' + conditions.join(' AND ');
        }

        console.log({ filter });

        const sql = `SELECT * FROM billing_control ${filter}`;
        const [rows, fields] = await (await this.getConnection()).execute(sql, values);
      
        return rows;
    }

    async fetch(id: Number): Promise<any> {
        const [rows, fields] = await (await this.getConnection())
        .execute(
            `SELECT 
                *
            FROM billing_control
            WHERE id = ?;`,
            [id]
        );
        return rows;
    }

    async create(userData: any) {
        console.log({userData})
        return await (await this.getConnection()).query('INSERT INTO billing_control SET ?', userData);
    }

    async createArray(userData: any[]) {
        const connection = await this.getConnection();
    
     
        const query = 'INSERT INTO billing_control SET ?';

        // Usar Promise.all para inserir cada objeto do array individualmente
        const insertPromises = userData.map(async (data) => {
          await connection.query(query, data);
        });

        // Aguardar a conclusão de todas as inserções
        await Promise.all(insertPromises);

        console.log('Inserções concluídas com sucesso.');

      // ...
    }

    async update(data: any, id: number) {
        const mysqlBind = createBindParams(data);

        return await (await this.getConnection())
        .query(`UPDATE billing_control SET ${mysqlBind}, update_date = now() WHERE id = ?;`, [...Object.values(data), id]);
    }

    async delete(id: number) {
        return await (await this.getConnection()).query(`DELETE FROM billing_control WHERE id = ?;`, [id]);
    }

}

export default new billingControlDatabase();
