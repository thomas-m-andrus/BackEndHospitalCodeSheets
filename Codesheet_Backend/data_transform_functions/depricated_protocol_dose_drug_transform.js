var dose_drug = require("./dose_drug_transform.js");
module.exports = {
    CalcDBtoWEB: function(drug,weight){
        var retOb, calc, vol, inst;
        calc = dose_drug.CalcDoseDrug(
                                        weight,
                                        drug.drugDosingSuggestion1,
                                        0,
                                        drug.drugCalculatedDoseMax
                                    );
        vol = dose_drug.CalcVolume(calc,drug.drugConcentration);
        if(drug.drugDosingSuggestionCompare==null){
            inst=null;
        }else{
            inst = weight > drug.drugDosingSuggestionCompare ? drug.drugSuggestion : null;            
        }
        retOb = {
            "drugCalculatedDose": calc,
            "drugVolume": vol,
            "drugSuggestion": inst
        };
        return retOb;
    },
    ConvertDBtoWEB: function(drug,weight){
        var retOb = {};
        var calc;
        calc = this.CalcDBtoWEB(drug,weight);
        var UOM1,UOM2,UOM3,UOM4;
        UOM1 = drug.drugConcentrationUOM != null ? drug.drugConcentrationUOM : 'mg/mL';
        UOM2 = drug.drugDosingSuggestionUOM != null ? drug.drugDosingSuggestionUOM : 'mg/kg';
        UOM3 = drug.drugCalculatedDoseUOM != null ? drug.drugCalculatedDoseUOM : 'mg';
        UOM4 = drug.drugVolumeUOM != null ? drug.drugVolumeUOM : 'mL';
        retOb = {
            "drugName": drug.drugName,
            "drugSubScript": drug.drugSubScript,
            "drugConcentration": drug.drugConcentration,
            "drugConcentrationUOM": UOM1,
            "drugInitDose": calc.drugSuggestion,
            "drugInitDoseUOM": UOM2,
            "drugCalculatedDose": calc.drugCalculatedDose,
            "drugCalculatedDoseUOM": UOM3,
            "drugVolume":calc.drugVolume,
            "drugVolumeUOM": UOM4,
            "drugAdminRate": null,
            "drugAdminRateUOM": null,
            "drugFlowRate": null,
            "drugFlowRateUOM": null,
            "drugSuggestion": calc.drugSuggestion,
            "drugInstruction": null
        };
        return retOb;
    }
}