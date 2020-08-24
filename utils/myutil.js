module.exports={
    //return index of max value if array have one max value
    oneMaxValueOfArray: (array)=>{
        var indexOfOneMax = 0;
        var max = array[0];
        var count = 1;
        for(var i = 1 ;i<array.length;i++){
            if(array[i] == max)
                count++;
            if(array[i] > max){
                indexOfOneMax = i;
                max = array[i];
                count = 1;
            }
        }

        if(count > 1)
            return -1;
        return indexOfOneMax;
    },
    findWinMember: (array,actors)=>{
        var result = array;
        var code = 0;
        if(array.indexOf("1") == -1){
            //sói thua
            console.log("sói thua");
            code = 2;
            var indexOfWolf = actors.indexOf(1);
            for(var i=0;i<result.length;i++){
                if(indexOfWolf == i){
                    result[i] = -1;
                }else
                    result[i] = 1;
            }
            console.log(result);
        }else if(array.indexOf("2") == -1 && array.indexOf("3") == -1){
            //phe dân thua
            console.log("phe dân thua");
            console.log(actors);
            code = 1;
            var indexOfWolf = actors.indexOf(1);
            console.log(indexOfWolf);
            for(var i=0;i<result.length;i++){
                if(indexOfWolf != i){
                    result[i] = -1;
                }else 
                    result[i] = 1;
            }
        }
        return [code,result];
    }
}