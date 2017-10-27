module.exports={
    CalcJoules: function(weight,joulesperkg){
        var ret = weight*joulesperkg;
        return ret;
    },
    CalcDBtoWEB: function(drug,weight){
        var retOb,calc;
        calc = this.CalcJoules(weight,drug.drugConcentration);
        retOb={
            "drugCalculatedDose":calc
        }
        return retOb
    },
    ConvertDBtoWEB: function(drug,weight){
        var retOb = {};
        var calc;
        calc = this.CalcDBtoWEB(drug,weight);
        var UOM1,UOM2;
        UOM1 = drug.drugConcentrationUOM != null ? drug.drugConcentrationUOM : 'joules/kg';
        UOM2 = drug.drugCalculatedDoseUOM != null ? drug.drugCalculatedDoseUOM : 'joules';
        retOb = {
            "drugName": null,
            "drugSubScript": null,
            "drugConcentration": drug.drugConcentration,
            "drugConcentrationUOM": UOM1,
            "drugInitDose": null,
            "drugInitDoseUOM": null,
            "drugCalculatedDose": calc.drugCalculatedDose,
            "drugCalculatedDoseUOM": UOM2,
            "drugVolume":null,
            "drugVolumeUOM": null,
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