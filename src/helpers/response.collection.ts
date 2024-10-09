import Controller from "@/controllers/controller";

const getErrorMessage = (label: any, info: String = '') => {
    const errorMessages: any = {
        featureNotImplemented: 'Funcionalidade não implementada ainda.',
        missingField: `O campo ${info} não foi informado!.`,
        unrecognizedErrorFrom: `Erro desconhecido de ${label}!.`,
        missingData: `O dado ${info} não foi informado!.`,
        base64ImageMissingData: `A imagem parece estar faltando dados.`,
        base64ImgMissingExtension: 'Imagem não contem extensao',
        dataSizeIsIncorrect: `${info} esta incorreto, motivo: Tamanho!.`,
        userAlreadyExist: `Nome suario e/ou numero de telefone ja em uso.`,
        projectUserAlreadyExist: `Nome suario ja em uso.`,
        dataAlreadyCadastred: `${info} ja cadastrado.`,
        registryNotFound: `Registro de ${info} não encontrado.`,
        noValidDataFound: 'Nenhum dado valido encontrado para a operacao.',
        noAlertMessageConfigured: `Mensagem de alerta não configurada.`,
        solicitedRegistryIsNotYours: `Registro solicitado para operacao não pertence ao mesmo.`,
        specificSolicitedRegistryIsNotYours: `${info} solicitado para operacao não pertence ao mesmo.`,
        noDatabaseConnection: `Nenhuma conexao com banco encontrada.`,    
        phoneConnectionFailed: `Conexao com ${info} falhou.`,
        isNotAJSON: `Resposta retornada não condiz com um json`,
        notValidReservations: `Não ha reservas validas para a operação.`,
        wrongCredential: `Nome de usuario e/ou senha incorreto.`,
        usernameDoestExist: `Nome de usuario não existe.`,
        userActionNotPermitted: `Acao não condiz com nivel de permicao do usuario.`,
        validoCheckCode: `Erro ao validar codigo: ${info}`,
        invalidLoginCredentials: "Invalid email and/or password",
        updatePwdOldPwdRequired: "Senha atual necessaria para alterar senha.",
        pwdOldIsIncorret: "Senha atual esta incorreta.",
        emailNoCadastred: "Email não foi cadastrado.",
        incorretResetPwdToken: "Token de recuperacao de senha é invalido.",
        expiredResetPwdToken: "Token de recuperacao de senha expirado.",
        reservaStatusNotOperate: `Operacao não pode ser efetuado na reserva com status ${info}.`,
        notReservaOnThat: `Operacao não pode ser efetuado pois não há vendas reservadas ou confirmadas nesse periodo.`,
        selectingDatabaseError: `Erro ao selecionar banco de dados.`,
        missconfiguredService: `Servico ${info} não esta em pleno funcionamento por falta de configuracao.`,
        noDatabaseNameFound: "Banco de informacoes solicitado não existe.",
        identityPaxIdNotFound: "Identity id do passageiro não encontrado",
        negativeValueResulted: "Operacao ocasionou em valor negativo",
        departureInterTaxNotCadastred: `Taxa internacional do aeroporto ${info} não cadastrado.`,
        _departureInterTaxNotCadastred: `Taxa internacional do aeroporto não cadastrado.`,
        cantNowBackingLeg: "Não e possivel identificar perna de volta",
        paxNotFoundOnReq: `Passageiro ${info} não foi informadado na requisição.`,
        missingBuscaFacilData: `${info} do buscador de milhas não foi informado`,
        reservationAlreadyIssuedOnWooba: "Não é possivel emitir uma reserva ja emitida no wooba.",
        clientCantBeIssued: `Não é possivel fazer emissoes com o cliente ${info}.`,
        baggageRouteNotFound: `Rota para a bagagem (${info}) não encontrada no trecho.`,
        baggageDataNotFound: `Não foi encontrado informacoes sobre bagagem no trecho (${info}) .`
    };

    Controller.errorStatusCode = getErrorStatusCode(label);

    return errorMessages[label] || '';
};

const getErrorStatusCode = (label: any) => {

    switch (label) {
        case 'userAlertStateUniqueRaltion':
        case 'invalidLoginCredentials':
        case 'wrongCredential':
        case 'missingField':
        case 'dataAlreadyCadastred':
        case 'contactToAlertIsNotInYourContactList':
        case 'updateUserContactNotPermitted':
        case 'solicitedRegistryIsNotYours':
        case 'validoCheckCode':
        case 'groupNameAlreadyExist':
        case 'alertTypeCantHasGroup':
        case 'groupsCantBeAddToGroups':
        case 'base64ImageMissingData':
        case 'base64ImgMissingExtension':
        case 'updatePwdOldPwdRequired':
        case 'pwdOldIsIncorret':
            return 400;
        case 'userActionNotPermitted':
            return 403;
        case 'missingData':
        case 'userConnectionNotFound':
        case 'userAlreadyExist':
        case 'registryNotFound':
        case 'wppAlreadyConnect':
        case 'wppQRCodeGenLongTime':
        case 'wppDisconcted':
        case 'noValidDataFound':
        case 'noAlertMessageConfigured':
        case 'noDatabaseConnection':
        case 'phoneConnectionFailed':
        case 'isNotAJSON':
        case 'unrecognizedErrorFrom':
        case 'wppUnknownStatusResponse':
            return 500;
        default:
            return 500;
    }
}

const getSuccessMessage = (label: any, info: String = '') => {
    // interface ErrorMessages {
    //     missingField: any; // 👈️ use string lowercase s
    // }
    const successMessages: any = {
        update: `${info} atualizado com sucesso!.`,
        insert: `${info} inserido com sucesso!.`,
        delete: `${info} removido com sucesso!.`,
        adjusted: `${info} ajustadas com sucesso!.`,
        create: `${info} criado com sucesso!.`,
        ordered: `Pedido de ${info} efetuado com sucesso!.`
    };

    return successMessages[label] || '';
};

export {
    getErrorMessage,
    getSuccessMessage,
    getErrorStatusCode
}