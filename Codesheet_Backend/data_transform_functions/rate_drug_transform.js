module.exports = {
    IfConcentration: function(weight, eq, compare, eqTrue, eqFalse){
        var ret = eval(weight+eq+compare) ? eqTrue : eqFalse;
        return ret;
    },
    ConstantConcentrationEval: function(weight, ConstConc){
        var len = ConstConc.length, answer = 0, i = 0;
        while ((i<len) && (answer == 0)){
            answer = this.IfConcentration(
                                                weight
                                                ,ConstConc[i].eval
                                                ,ConstConc[i].compare
                                                ,ConstConc[i].true
                                                ,ConstConc[i].false
                                            );
            i++;
        }
        return answer;
    },
    CalcFlowRate: function(flowType,weight,adminRate,dilutionVol,ConstantConc,weightcomp,weightequ){
        var FlowRate;
        switch(flowType){
            case 1:
                FlowRate=this.CalcFlowRate1(weight,adminRate,dilutionVol,ConstantConc);
                break;
            case 2:
                if(eval(weight+weightequ+weightcomp)){
                    FlowRate=this.CalcFlowRate2(weight,adminRate,dilutionVol,ConstantConc);
                }else{
                    FlowRate=this.CalcFlowRate1(weight,adminRate,dilutionVol,ConstantConc);
                }
                break;
        }
        return FlowRate;
    },
    CalcFlowRate1: function(weight, adminRate,dilutionVol,ConstantConc){
        var ret = (adminRate*weight*60)/(1000*(dilutionVol/dilutionVol*ConstantConc));
        return ret;
    },
    CalcFlowRate2: function(weight, adminRate, dilutionVol, ConstantConc){
        var ret = (adminRate*weight*60)/(dilutionVol*ConstantConc);
        return ret;
    },
    CalcDBtoWEB: function(drug,weight){
        var retOb,constantConc,flowRate;
        constantConc=this.ConstantConcentrationEval(
            weight,
            drug.drugConstantConcentration
        );
        flowRate=this.CalcFlowRate(
                                    drug.drugFlowRateType,
                                    weight,
                                    drug.drugAdministrationRate,
                                    drug.drugDilutionVolume,
                                    constantConc,
                                    drug.drugFlowRateCompWeight,
                                    drug.drugFlowRateWeightEq
                                    );
        retOb = {
            "drugConcentration":constantConc,
            "drugFlowRate":flowRate
        }
        return retOb;
    },
    ConvertDBtoWEB: function(drug,weight){
        var retOb = {};
        var calc;
        calc = this.CalcDBtoWEB(drug,weight);
        var UOM1,UOM2,UOM3;
        UOM1 = drug.drugConcentrationUOM != null ? drug.drugConcentrationUOM : 'mg/mL';
        switch(drug.drugFlowRateType){
            case 1:
                break;
            case 2:
                if(eval(weight+drug.drugFlowRateWeightEq+drug.drugFlowRateCompWeight)){
                    UOM1 = drug.drugFRTConcentrationUOM
                }
        }
        UOM2 = drug.drugAdministrationRateUOM != null ? drug.drugAdministrationRateUOM : 'mcg/kg/min';
        UOM3 = drug.drugFlowRateUOM != null ? drug.drugFlowRateUOM : 'mL/hr';
        retOb = {
            "drugName": drug.drugName,
            "drugSubScript": drug.drugSubScript,
            "drugConcentration": calc.drugConcentration,
            "drugConcentrationUOM": UOM1,
            //not needed for rate drugs
            "drugInitDose": null,
            "drugInitDoseUOM": null,
            "drugCalculatedDose": null,
            "drugCalculatedDoseUOM": null,
            "drugVolume":null,
            "drugVolumeUOM": null,
            //end not needed for rate drugs
            "drugAdminRate": drug.drugAdministrationRate,
            "drugAdminRateUOM": UOM2,
            "drugFlowRate": calc.drugFlowRate,
            "drugFlowRateUOM": UOM3,
            "drugSuggestion": drug.drugSuggestion,
            "drugInstruction": null
        };
        return retOb;
    }
}