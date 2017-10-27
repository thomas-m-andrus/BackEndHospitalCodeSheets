var table_comp = require("./table_compilation.js");

module.exports = {
    getTable: function(index){
        return tables[index];
    },
    convertSheetDBtoWeb: function( tables, index, weight, height,age){
        var json = []
        var sorting = [];
        for(var i=0,len=tables.length;i<len;i++){
            if(tables[i].CodesheetID == index){
                sorting.push(
                    {
                        "tableIndex":i,
                        "tableOrder":tables[i].CodesheetTbOrder
                    }
                )
            }
        }
        sorting.sort(function(a,b){
            return a.tableOrder - b.tableOrder;
        });
        for(var i=0,len=sorting.length;i<len;i++){
            json.push(
                table_comp.tableCreation(
                    JSON.parse(JSON.stringify(tables[sorting[i].tableIndex]))
                    ,weight
                    ,height
                    ,age
                )
            );
        }
        return json;
    }
}