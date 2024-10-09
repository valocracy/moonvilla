import CryptoJS from "crypto-js";
import { Request } from "mssql";

const isTextJson = (text: string): Boolean => {
    try {
        JSON.parse(text);
        return true;
    } catch (error) {
        return false;
    }
};

const encryptAES = (data: any, env: any) => {
    const cfg: any = { iv: CryptoJS.enc.Base64.parse(env.SECRET_SALT) };
    const secret = CryptoJS.enc.Base64.parse(env.SECRET);

    return CryptoJS.AES.encrypt(data, secret, cfg).toString();
}

const decryptAES = (data: any, env: any) => {
    const cfg: any = { iv: CryptoJS.enc.Base64.parse(env.SECRET_SALT) };
    const secret = CryptoJS.enc.Base64.parse(env.SECRET);

    return CryptoJS.AES.decrypt(data, secret, cfg).toString(CryptoJS.enc.Utf8);
}

const getMysqlColumnsToIterpolate = (fields: Array<Object>): string => {
    const reuslt = fields.map((val): string => {
        return "?, ";
    }).join('');

    return reuslt.slice(0, -2);
};

const createBindParamsAND = (fields: Array<Object>, fieldsPrefix = '') => {
    var result = '';

    for (const key in fields) {
        const value = fields[key];

        result += `${fieldsPrefix}${key} ${value !== null ? '= ?' : ' IS NULL'} AND `;
    }
    return result.slice(0, -5);
};

const createBindParams = (fields: Array<Object>) => {
    var result = '';

    for (const key in fields) {
        const value = fields[key]

        result += `${key} ${value != null ? '= ?' : ' = NULL'}, `;
    }
    return result.slice(0, -2);
};

const createSqlServerBindParams = (request: Request, conditionalFields: Map<string, string> | null = null) => {
    if (conditionalFields) {
        conditionalFields.forEach((value, key) => {
            request.input(key, value);
        });
    }
}

const mountSqlServerWhere = (conditionalFields: Map<string, string> | null = null) => {
    if (conditionalFields) {
        return 'WHERE ' + Array.from(conditionalFields.keys()).reduce((acc: string, key: string): string => {
            // request.input(key, value);
            if(acc.length > 0) acc = `${acc} AND `;
            acc += `${key} = @${key}`;

            return acc;
        }, '');
    }else {
        return '';
    }
}

const generateMultiplesPromisses = (arr: Array<any>, callback: CallableFunction, specialCallbackParam: any = ''): Array<Promise<any>> => {
    return arr.map((content) => {
        if (specialCallbackParam) return callback(content);
        else return callback(content, content[specialCallbackParam || '']);
    });
};

const mountSuccessResponse = (content: any, extra: JSON = JSON.parse('{}')) => {
    const {
        status = -1,
        message = ''
    }: any = extra;

    const response: any = {
        content: content,
        message: message
    };

    if (status !== -1) response.status = status;

    return JSON.stringify(response);
}

const mountErrorResponse = (message: String, extra: JSON = JSON.parse('{}')) => {
    const {
        content = {},
        status = -1,
    }: any = extra;

    const response: any = {
        message: message,
    };

    if (status !== -1) response.status = status;
    if (Object.keys(content).length > 0) response.content = content;

    return JSON.stringify(response);
}

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function getBasicAuth(username: string, pwd: string) {
    const tokenToEncode = `${username}:${pwd}`;
    const tokenEncoded = Buffer.from(tokenToEncode).toString('base64');

    return `Basic ${tokenEncoded}`;
}

function getOtherPax(pax: any, otherPaxs: Array<any>) {
    return otherPaxs.find((otherPax: any) => otherPax.pax_doc === (pax.cpf || pax.pax_doc) || (otherPax.first_name === pax.first_name && otherPax.last_name === pax.last_name))
}

function getCiaNameByCode(name: string) {
    switch (name.toLocaleUpperCase()) {
        case 'AD':
            return 'azul';
        case 'LA':
        case 'JJ':
            return 'latam';
        case 'G3':
            return 'gol';
        case 'TP':
            return 'tap';
        default:
            return name;
    }
}

export {
    isTextJson,
    getMysqlColumnsToIterpolate,
    createBindParams,
    generateMultiplesPromisses,
    createBindParamsAND,
    createSqlServerBindParams,
    mountSqlServerWhere,
    mountErrorResponse,
    mountSuccessResponse,
    encryptAES,
    decryptAES,
    sleep,
    getBasicAuth,
    getOtherPax,
    getCiaNameByCode
}