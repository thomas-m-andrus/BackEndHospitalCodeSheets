var _ = require('lodash');
var tables = require("./data/config_table.json");
var cod_comp = require('./data_transform_functions/codesheet_compilation.js');
//testing
var rate_drug = require('./data_transform_functions/rate_drug_transform.js');
var test_tables = require("./data/depricated_config.json");


module.exports = function(app){
    app.get('/codesheetapi/:index/:weight/:height/:age', (req,res) => {
        var ret,index,weight;
        index = req.params.index;
        weight = req.params.weight;
        height = req.params.height;
        age = req.params.age;
        ret = cod_comp.convertSheetDBtoWeb(tables,index,weight,height,age);
        res.send(ret);
        console.log("Sent");
    })

    app.get('/test/:index/:weight/:height/:age',(req,res)=>{
        console.log("Test Initiated");
        var ret,index,weight;
        index = req.params.index;
        weight = req.params.weight;
        height =req.params.height;
        age =req.params.age;
        ret = cod_comp.convertSheetDBtoWeb(test_tables,index,weight,height,age);
        res.send(ret);
    })
}
