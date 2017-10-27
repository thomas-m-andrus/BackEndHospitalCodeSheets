var dose_drug = require("./dose_drug_transform.js");
var rate_drug = require("./rate_drug_transform.js");
var prot_drug = require("./protocol_dose_drug_transform.js");
var fluid_lim = require("./fluid_limit_transform.js");
var joule_drug = require("./joule_transform.js");
var diastat_drug = require("./dose_diastat_transform.js");

module.exports = {
    tableCreation: function( dbtable,weight,height,age){
        var conversion, drugs = [],convheight,convage,ret;
        switch(dbtable.IDTType){
            case 1:
                conversion = "dose_drug.ConvertDBtoWEB";
                convheight = "";
                convage = "";
                break;
            case 2:
                conversion = "rate_drug.ConvertDBtoWEB";
                convheight = "";
                convage = "";
                break;
            case 3:
                conversion = "prot_drug.ConvertDBtoWEB";
                convheight = "";
                convage = "";
                if (weight>29){
                    dbtable.IDTCol.push("Max dose = 12 mg");
                }
                break;
            case 4:
                conversion = "fluid_lim.ConvertDBtoWEB";
                convheight = ","+height;
                convage = "";
                break;
            case 5:
                conversion = "joule_drug.ConvertDBtoWEB";
                convheight = "";
                convage = "";
                break;
            case 6:
                conversion = "diastat_drug.ConvertDBtoWEB";
                convheight = "";
                convage = ","+age;
                break;

        }
        for(var i=0, len = dbtable.IDTRows.length; i<len; i++){
            drugs.push(eval(conversion + "(dbtable.IDTRows[i]," + weight+convheight+convage+")"));    
        }
        drugs.forEach(function(i) {
        }, this);
        ret = {
            "IDTType": 0,
            "IDTTitle": "",
            "IDTCol": [],
            "IDTRows":[]
        };
        for(var i=0, len = dbtable.IDTCol.length; i<len; i++){
            ret.IDTCol.push(dbtable.IDTCol[i])
        };
        ret.IDTType = dbtable.IDTType;
        ret.IDTTitle = dbtable.IDTTitle;
        ret.IDTRows = drugs;
        return ret;
    }
}