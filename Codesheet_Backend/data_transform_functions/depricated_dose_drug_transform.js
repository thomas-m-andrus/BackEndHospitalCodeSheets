module.exports = {
    CalcDosingSuggestion: function(eq_op, weight, compare, t_statement, f_statement){
        if(eq_op.length == 0){
            return t_statement;
        }else{
            if (eval(weight+eq_op+compare)){
                return t_statement;
            } else {
                return f_statement;
            }
        }   
    },
    CalcDoseDrug: function(weight, dose_sugg, min, max){
        if((weight*dose_sugg)<min){
            return min;
        } else if ((max != 0) && ((weight*dose_sugg)>max)){
            return max;
        } else {
            return weight*dose_sugg;
        }
    },
    CalcVolume: function(calc_dose, concentration){
        return calc_dose/concentration;
    },
    NonConvention: function(drug){
        var retOb = {
            "drugSuggestionInit":drug.drugDosingSuggestion1,
            "drugCalculatedDose": drug.drugNonConventionCalculatedDose,
            "drugVolume": drug.drugNonConventionVolume,
        };
        return retOb;
    },
    CalcDBtoWEB: function(drug,weight){
        var retOb;
        if(drug.drugNonConvention == 1){
            retOb = this.NonConvention(drug);
        }else{
            var sug, calc, vol;
            sug = this.CalcDosingSuggestion(
                    drug.drugDosingSuggestionEquation,
                    weight,
                    drug.drugDosingSuggestionCompare,
                    drug.drugDosingSuggestion1,
                    drug.drugDosingSuggestion2  
                );
            if(drug.drugFlat == 1){
                calc = sug
            } else {
                calc = this.CalcDoseDrug(
                    weight,
                    sug,
                    drug.drugCalculatedDoseMin,
                    drug.drugCalculatedDoseMax
                );
            };
            vol = this.CalcVolume(calc,drug.drugConcentration);
            var retOb = {
                "drugSuggestionInit":sug,
                "drugCalculatedDose": calc,
                "drugVolume": vol
            };
        }
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
            "drugInitDose": calc.drugSuggestionInit,
            "drugInitDoseUOM": UOM2,
            "drugCalculatedDose": calc.drugCalculatedDose,
            "drugCalculatedDoseUOM": UOM3,
            "drugVolume":calc.drugVolume,
            "drugVolumeUOM": UOM4,
            "drugAdminRate": null,
            "drugAdminRateUOM": null,
            "drugFlowRate": null,
            "drugFlowRateUOM": null,
            "drugSuggestion": drug.drugSuggestion,
            "drugInstruction": drug.drugInstruction
        };
        return retOb;
    }
}