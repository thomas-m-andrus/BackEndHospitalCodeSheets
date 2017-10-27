module.exports={
    CalcBSA: function(weight,height){
        var ret=Math.sqrt((weight*height)/3600);
        return ret;
    }
}