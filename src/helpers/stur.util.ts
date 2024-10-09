import AirportInterface from "@/interfaces/airport.interface";
import moment from "moment-timezone";

const getOtherDepartures = (from: string, legs: Array<any>, uniqueTrechos: any): Array<string> => {
    const isJustGoing = legs.filter((leg: string) => leg === from).length === 1;
    const departureTrecho = uniqueTrechos[0];
    const departureDepDate = moment(departureTrecho.dep_date, 'YYYY-MM-DD')
    const legsRemovedLastLag = legs.slice(0, legs.length - 1);
    // console.log(legs)
    const departureDatesAlreadyGetted: Array<string> = [];

    // First of array "will" be backing route.
    return !isJustGoing ? legsRemovedLastLag.filter((leg: string, index: number) => {
        const legQtd = legs.filter((_leg: string) => _leg === leg);
        const trechoReference = uniqueTrechos[index];
        const trechoDepDate = moment(trechoReference.dep_date, 'YYYY-MM-DD')

        // Return leg to emit error 
        if(trechoReference.from != leg) return leg;
        const isNewDeparture = legQtd.length === 1 && legQtd[0] !== legs[legs.length - 1] && trechoDepDate > departureDepDate && !departureDatesAlreadyGetted.includes(trechoDepDate.toString());

        if(isNewDeparture) {
            departureDatesAlreadyGetted.push(trechoDepDate.toString());
        }
        return isNewDeparture;
    }) : [];
};

// Get departures from going or backing that has dep_date diff from the origin.
const getGoingJourneys = (arrivalAirport: string, trechos: any): Array<any> => {
    return trechos.reduce((acc: Array<any>, trecho: any): Array<any> => {
        if (acc.length === 0 || acc[acc.length - 1].to !== arrivalAirport) {
            acc.push(trecho);
        }

        return acc;
    }, []);
};

const getBackingJourneys = (otherDeparture: string, trechos: Array<any>) => {
    return trechos.reduce((acc: Array<any>, trecho: any): Array<any> => {
        if (acc.length > 0 || trecho.from === otherDeparture) {
            acc.push(trecho);
        }

        return acc;
    }, []);
};

const _getTaxedLegs = (from: string, journeys: Array<any>, airportsFeeByAiport: any): Array<string> => {
    let lastGoingFromIsInter = false;

    return journeys.reduce((acc: Array<string>, trecho: any) => {
        const isDepartureBrazilian = airportsFeeByAiport[trecho.from].country === 'Brazil';
        const isGoingInter = airportsFeeByAiport[trecho.to].country !== 'Brazil';

        // When changing gate national to inter, there is two cases.
        // If has next leg and is inter, then tax will be puted there:
        // GRU -> KIX
        // KIX -> NRT that will be taxed.
        //
        // If not has next leg, then tax will be puted togheter with natinal:
        // GRU -> KIX that will be taxed as inter and national (TODO)
        if (isDepartureBrazilian && isGoingInter) acc.push(`${trecho.from}-${trecho.to}`);
        // When changeing gate inter to national, next national departure will be taxed.
        else if(isDepartureBrazilian && lastGoingFromIsInter) acc.push(`${trecho.from}-${trecho.to}`);
        else if (trecho.from === from) acc.push(trecho.from);
        else if (String(trecho.dep_date) !== String(journeys[0].dep_date) && isDepartureBrazilian) acc.push(`${trecho.from}-${trecho.to}`);

        lastGoingFromIsInter = !isDepartureBrazilian;
        return acc;
    }, []);
};


const getBoardingFeeLegsTaxed = (legs: Array<string>, trechos: Array<any>, airportsFeeByAiport: any) => {
    const from = legs[0];
    const otherDepartures: Array<string> = getOtherDepartures(from, legs, trechos);    

    // Nao e possivel identificar perna de volta
    if(otherDepartures.length > 1) {
        return []
    }
    // if(otherDepartures.length > 1) {
    //     const trechoFrom = trechos.find((trecho) => {
    //         return trecho.from === from;
    //     });
    //     const backingFrom = trechos.find((trecho) => {
    //         return trecho.dep_date !== trechoFrom.dep_date
    //     })
    // }
    // From more other
    const origins = [from].concat(otherDepartures);

    //console.log("origins", origins);
    const goingJourney: Array<any> = getGoingJourneys(origins[1], trechos);
    //console.log("goingJourney", goingJourney);
    const backingJourney: Array<any> = getBackingJourneys(origins[1], trechos);
    //console.log("backingJourney", backingJourney);

    const goingTaxedLegs = _getTaxedLegs(from, goingJourney, airportsFeeByAiport);
    const backingTaxedLegs = _getTaxedLegs(origins[1], backingJourney, airportsFeeByAiport);
    //console.log("extraGoingTaxedLegs", extraGoingTaxedLegs);
    //console.log("extraBackingTaxedLegs", extraBackingTaxedLegs);
    return goingTaxedLegs.concat(backingTaxedLegs);
};

const getIntoTrechosJourneySeq = (trechos: Array<string>): any => {
    const result = trechos.reduce((acc: any, trecho: any) => {
        if (!acc.past_seqs.includes(trecho.seq_leg)) {
            acc.past_seqs.push(trecho.seq_leg);
            acc.journey.push(trecho);
        }

        return acc;
    }, { past_seqs: [], journey: [] });

    return result.journey;
};

const getLegsFromMovim = (movim: any): Array<string> => {
    const journeyLegsString: string = movim.journey_legs;
    const journeyLegs = journeyLegsString.split('/');

    return journeyLegs;
};

const journeyHasInterAirport = (legs: Array<string>, airportsFeeByAiport: any) => {
    return legs.filter((leg: any) => airportsFeeByAiport[leg.from].country !== 'Brazil' || airportsFeeByAiport[leg.to].country !== 'Brazil').length > 0
};

const journeyHasBRNonPrivateAirport = (legs: Array<string>, airportsFeeByAiport: any) => {
    return legs.filter((leg: any) => airportsFeeByAiport[leg.from].country === 'Brazil' && !airportsFeeByAiport[leg.from].is_private).length > 0
};

const isTrechoTaxed = (trecho: any, boardingFeeTaxedFromLegs: Array<string>) => {
    return boardingFeeTaxedFromLegs.some((taxedLeg: string) => {
        const route = taxedLeg.includes('-') ? taxedLeg.split('-') : [taxedLeg];

        if (route.length === 1) return trecho.from === route[0];
        else return trecho.from === route[0] && trecho.to === route[1];
    });
};

const isTrechoNatTaxedAsInter = (trecho: any, boardingFeeTaxedFromLegs: Array<string>, airportsFeeByAiport: any) => {
    const includedAsTaxed = boardingFeeTaxedFromLegs.includes(`${trecho.from}-${trecho.to}`);
    const isGoingLegInter = airportsFeeByAiport[trecho.to].country !== 'Brazil';

    return includedAsTaxed && isGoingLegInter;
};

const getNotCadastredAiports = (legs: Array<string>, airportsFeeByAiport: any) => {
    return legs.filter((leg) => {
        return !airportsFeeByAiport[leg]
    })
};

const getTaxedAiportsWithoutTaxCadastred = (legs: Array<string>, airportsFeeByAiport: any) => {
    return legs.filter((leg) => {
        const taxedLeg = leg.includes('-') ? leg.split('-')[0] : leg;
        const isLegBrazilian = airportsFeeByAiport[taxedLeg].country === 'Brazil';
        const legHasBoardingFeeCadastred = typeof airportsFeeByAiport[taxedLeg]?.boarding_fee === 'number' && airportsFeeByAiport[taxedLeg].boarding_fee > 0;
        const legHasBoardingFeeIntCadastred = typeof airportsFeeByAiport[taxedLeg]?.boarding_fee_int === 'number' && airportsFeeByAiport[taxedLeg].boarding_fee_int > 0;
        const isPrivate = airportsFeeByAiport[taxedLeg].is_private;

        //console.log("taxedLeg", taxedLeg);
        //console.log("isLegBrazilian", isLegBrazilian);
        //console.log("legHasBoardingFeeCadastred", legHasBoardingFeeCadastred);
        //console.log("legHasBoardingFeeIntCadastred", legHasBoardingFeeIntCadastred);
        //console.log("isPrivate", isPrivate);
        return isLegBrazilian && isPrivate && (!legHasBoardingFeeCadastred || !legHasBoardingFeeIntCadastred);
    })
};

const arrangeAirportByCode = (airports: Array<AirportInterface>) => {
    return airports.reduce((acc: any, airport: AirportInterface) => {
        acc[airport.code] = { code: airport.code, boarding_fee: Number(airport.boarding_fee), boarding_fee_int: Number(airport.boarding_fee_int), country: airport.country, is_private: airport.is_private };

        return acc;
    }, {})
};

const arrangeSturRowsDataByReserva = (rows: Array<any>) => {
    return rows.reduce((acc, row) => {
        if(!acc[row.reserva]) acc[row.reserva] = {};

        acc[row.reserva][row.ticket] = row;
        return acc;
    }, {})
}

export {
    getIntoTrechosJourneySeq,
    journeyHasInterAirport,
    journeyHasBRNonPrivateAirport,
    isTrechoTaxed,
    isTrechoNatTaxedAsInter,
    getNotCadastredAiports,
    getTaxedAiportsWithoutTaxCadastred,
    arrangeAirportByCode,
    getLegsFromMovim,
    getOtherDepartures,
    getGoingJourneys,
    getBackingJourneys,
    getBoardingFeeLegsTaxed,
    _getTaxedLegs,
    arrangeSturRowsDataByReserva
}