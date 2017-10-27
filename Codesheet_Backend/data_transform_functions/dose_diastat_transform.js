var dia_lookup = require("./../data/config_diastat_tables.json");
module.exports={
    LookUpTable: function(table,weight){
        return table[weight];
    },
    CalcDoseDrug: function(table,index,weight,age){
        var ret;
        if(age<0.99){
            ret=0
        }else if(age<6){
            ret=this.LookUpTable(table[index].yrs2to5,weight);
        }else if(age<12){
            ret=this.LookUpTable(table[index].yrs6to11,weight);
        }else{
            ret=this.LookUpTable(table[index].greaterandequalto12,weight);
        }
        return ret;
    },
    IfRange: function(age, eq, compare, eqTrue, eqFalse){
        var ret = eval(age+eq+compare) ? eqTrue : eqFalse;
        return ret;
    },
    IfWhile: function(checkagainst,ifarray){
        var len = ifarray.length, answer = 0, i = 0;
        while ((i<len) && (answer == 0)){
            answer = this.IfRange(
                                                checkagainst
                                                ,ifarray[i].eval
                                                ,ifarray[i].compare
                                                ,ifarray[i].true
                                                ,ifarray[i].false
                                            );
            i++;
        }
        return answer;
    },
    CalcDBtoWEB: function(drug,weight,age){
        var retOb,dose,doseSug,conc;
        dose = this.CalcDoseDrug(dia_lookup,0,weight,age);
        doseSug = this.IfWhile(age,drug.drugDosingSuggestion);
        conc = this.IfWhile(dose,drug.drugConcentration);
        retOb = {
            "drugConcentration":conc,
            "drugDosingSuggestion":doseSug,
            "drugCalculatedDose":dose
        };
        return retOb

    },
    ConvertDBtoWEB: function(drug,weight,age){
        var retOb = {};
        var calc;
        calc = this.CalcDBtoWEB(drug,weight,age);
        var UOM1,UOM2,UOM3;
        UOM1 = drug.drugConcentrationUOM != null ? drug.drugConcentrationUOM : 'mg Accudial';
        UOM2 = drug.drugDosingSuggestionUOM != null ? drug.drugDosingSuggestionUOM : 'mg/kg';
        UOM3 = drug.drugCalculatedDoseUOM != null ? drug.drugCalculatedDoseUOM : 'mg';
        retOb = {
            "drugName": drug.drugName,
            "drugSubScript": null,
            "drugConcentration": calc.drugConcentration,
            "drugConcentrationUOM": UOM1,
            "drugInitDose": calc.drugDosingSuggestion,
            "drugInitDoseUOM": UOM2,
            "drugCalculatedDose": calc.drugCalculatedDose,
            "drugCalculatedDoseUOM": UOM3,
            "drugVolume":null,
            "drugVolumeUOM": null,
            "drugAdminRate": null,
            "drugAdminRateUOM": null,
            "drugFlowRate": null,
            "drugFlowRateUOM": null,
            "drugSuggestion": null,
            "drugInstruction": drug.drugInstruction
        };
        return retOb;
    }
}