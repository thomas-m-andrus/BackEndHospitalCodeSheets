var gen = require("./common_formula.js");
module.exports = {
    CalcAdminPer24HR: function(admin,W_BSA){
        var ret=admin*W_BSA;
        return ret;
    },
    CalcAdminPerHR: function(admin){
        var ret=(admin/24);
        return ret;
    },
    CalcDBtoWEB:function(drug,weight,height){
        var ret,lim24,limhr;
        switch(drug.drugNonConvention){
            case 1:
                lim24 = this.CalcAdminPer24HR(drug.drugAdministrationRate,weight);
                limhr = this.CalcAdminPerHR(lim24);
                break;
            case 2:
                var BSA = gen.CalcBSA(weight,height);
                lim24 = this.CalcAdminPer24HR(drug.drugAdministrationRate,BSA);
                limhr = this.CalcAdminPerHR(lim24);
                lim24=null;
                break;
        }
        ret = {
            "drugFlowRate":limhr,
            "drugCalculatedDose":lim24
        }
        return ret;
    },
    ConvertDBtoWEB: function(drug,weight,height){
        var retOb = {};
        var calc;
        calc = this.CalcDBtoWEB(drug,weight,height);
        var UOM1,UOM2,UOM3;
        UOM1 = drug.drugAdminRateUOM != null ? drug.drugAdminRateUOM : 'ml/m^2/day';
        UOM2 = drug.drugFlowRateUOM != null ? drug.drugFlowRateUOM : 'ml/hr';
        UOM3 = drug.drugCalculatedDoseUOM != null ? drug.drugCalculatedDoseUOM : 'ml/24hr';
        retOb = {
            "drugName": null,
            "drugSubScript": null,
            "drugConcentration": null,
            "drugConcentrationUOM": null,
            "drugInitDose": null,
            "drugInitDoseUOM": null,
            "drugCalculatedDose": calc.drugCalculatedDose,
            "drugCalculatedDoseUOM": UOM3,
            "drugVolume":null,
            "drugVolumeUOM": null,
            "drugAdminRate": drug.drugAdministrationRate,
            "drugAdminRateUOM": UOM1,
            "drugFlowRate": calc.drugFlowRate,
            "drugFlowRateUOM": UOM2,
            "drugSuggestion": null,
            "drugInstruction": null
        };
        return retOb;
    }
}