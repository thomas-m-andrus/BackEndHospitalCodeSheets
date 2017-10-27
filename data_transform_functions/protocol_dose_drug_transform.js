var dose_drug = require("./dose_drug_transform.js");
module.exports = {
    CalcDBtoWEB: function(drug,weight){
        var retOb,conc, calc, vol;
        conc =drug.drugConstants.drugInitDose;
        calc = dose_drug.GetProperty("drugCalculatedDose",(weight*conc),drug);
        vol = dose_drug.CalcVolume(calc,3);
        retOb = {
            "drugInitDose": conc,
            "drugCalculatedDose": calc,
            "drugVolume": vol,
        };
        return retOb;
    },
    ConvertDBtoWEB: function(drug,weight){
        var retOb = {};
        var calc;
        calc = this.CalcDBtoWEB(drug,weight);
        var UOM1,UOM2,UOM3;
        UOM1 = drug.drugInitDoseUOM != null ? drug.drugInitDoseUOM : 'mg/mL';
        UOM2 = drug.drugCalculatedDoseUOM != null ? drug.drugCalculatedDoseUOM : 'mg';
        UOM3 = drug.drugVolumeUOM != null ? drug.drugVolumeUOM : 'mL';
        retOb = {
            "drugName": drug.drugName,
            "drugSubScript": drug.drugSubScript,
            "drugConcentration": null,
            "drugConcentrationUOM": null,
            "drugInitDose": calc.drugInitDose,
            "drugInitDoseUOM": UOM1,
            "drugCalculatedDose": calc.drugCalculatedDose,
            "drugCalculatedDoseUOM": UOM2,
            "drugVolume":calc.drugVolume,
            "drugVolumeUOM": UOM3,
            "drugAdminRate": null,
            "drugAdminRateUOM": null,
            "drugFlowRate": null,
            "drugFlowRateUOM": null,
            "drugSuggestion": null,
            "drugInstruction": null
        };
        return retOb;
    }
}