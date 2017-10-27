module.exports = {
    IfEval: function(Challenge,Operator,Compare,OpTrue,OpFalse){
        var ret = eval(Challenge+Operator+Compare) ? OpTrue : OpFalse;
        return ret;
    },
    IfEvalGroup: function(Challenge, Group){
        var len = Group.length, answer = 0, i = 0;
        while ((i<len) && (answer == 0)){
            answer = this.IfEval(
                                    Challenge,
                                    Group[i].eval,
                                    Group[i].compare,
                                    Group[i].true,
                                    Group[i].false
            )
            i++;
        }
        if (answer == 0){
            answer = Challenge;
        }
        return answer;
    },
    PullProperty: function(PropName, PropList){
        var ret = [];
        for(var i=0,len=PropList.length; i<len;i++){
            if(PropList[i].property==PropName){
                ret.push(PropList[i]);
            }
        }
        return ret;
    },
    GetProperty: function(prop,challenge,drug){
        var ret;
        if(drug.drugConstants.hasOwnProperty(prop)){
            ret = drug.drugConstants[prop];
        } else {
            var iflist;
            iflist = this.PullProperty(prop,drug.drugIfProperties);
            ret = this.IfEvalGroup(challenge,iflist);
        }
        return ret;
    },
    CalcVolume: function(calc_dose, concentration){
        return calc_dose/concentration;
    },
    CompileDrugInstruction: function(instruction,rtxt){
        var ret = instruction;
        for(var i=0,len=rtxt.length;i<len;i++){
            ret = ret.replace("|REPLACE|",rtxt[i]);
        }
        return ret;
    },
    CalcDBtoWEB: function(drug,weight){
        var retOb,concentration,dosingSuggestion,calcDose,volume,instruction;
        concentration=this.GetProperty("drugConcentration",weight,drug);
        dosingSuggestion=this.GetProperty("drugInitDose",weight,drug);
        if(drug.drugFlat == 1){
            calcDose = dosingSuggestion
        } else {
            calcDose=drug.drugConstants.hasOwnProperty("drugCalculatedDose") ? drug.drugConstants.drugCalculatedDose : this.GetProperty("drugCalculatedDose",(weight*dosingSuggestion),drug);
        }
        console.log(drug.drugName + dosingSuggestion + "*" + weight+"=    "+calcDose);
        volume=drug.drugConstants.hasOwnProperty("drugVolume") ? drug.drugConstants.drugVolume : this.CalcVolume(calcDose,concentration);
        if(drug.drugInstruction!=null && (drug.drugInstruction.indexOf("|REPLACE|")>=0)){
            switch(drug.drugInstruction){
                case "Dilute |REPLACE| mLs of |REPLACE| in |REPLACE| mLs of NS.  Administer |REPLACE| mLs.":
                    var rplace = [];
                    var flTotxt = volume.toFixed(2);
                    if (flTotxt.endsWith("0")){
                        flTotxt = flTotxt.substring(0,(flTotxt.length-1));
                        if (flTotxt.endsWith(".0")){
                            flTotxt = flTotxt.substring(0,(flTotxt.length-2)); 
                        }
                    }
                    flTotxt = parseFloat(flTotxt)
                    rplace.push(flTotxt);
                    rplace.push(drug.drugName);
                    rplace.push(flTotxt);
                    rplace.push(flTotxt*2);
                    instruction = this.CompileDrugInstruction(drug.drugInstruction,rplace);
                    break;
            }
        } else {
            instruction = drug.drugInstruction
        }
        retOb = {
            "drugConcentration": concentration,
            "drugInitDose":dosingSuggestion,
            "drugCalculatedDose":calcDose,
            "drugVolume":volume,
            "drugInstruction":instruction
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
            "drugConcentration": calc.drugConcentration,
            "drugConcentrationUOM": UOM1,
            "drugInitDose": calc.drugInitDose,
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
            "drugInstruction": calc.drugInstruction
        };
        return retOb;
    }
}