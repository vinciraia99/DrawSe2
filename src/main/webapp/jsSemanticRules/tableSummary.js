function showSummaryTable(graph){
    if(graph.editorMode == "Shape Editor Mode") {
        tempGraph = graph;
        var alltable = loadAllTable(graph);
        if(alltable == null){
            mxUtils.alert("Unable to display the semantic table summary because no semantic table has been defined for any stencil and connector");
            return;
        }

        debugger;
        //document.getElementById("overlay").style.display = "flex";

    }else{
        mxUtils.alert("You can use this function only in Shape Mode");
    }
}

function loadAllTable(graph){
    var array = new Array();
    var allShapes = graph.getModel().filterDescendants(function (cell) {
        if ((cell.vertex || cell.edge)) {
            if (cell.getStyle().includes('stencil')) {
                return true;
            }
        }
    });

    var allConns = graph.getModel().filterDescendants(function (cell) {
        if ((cell.vertex || cell.edge)) {
            if (cell.getStyle().includes('ap=')) {
                return true;
            }
        }
    });

    for(var k=0;k<2;k++){
        if(k==0){
            var element = allShapes;
        }else if(k==1){
            var element = allConns;
        }
        for(var i=0;i<element.length;i++){
            if(k==0){
                var name = getNameStencil(element[i],graph);
            }else if(k==1){
                var name = getNameConnector(element[i]);
            }
            var print = getGeneric(element[i],"print");
            var reference = getGeneric(element[i],"reference");
            var inputstring = getGeneric(element[i],"inputstring");
            var tableinfo = getSemanticTableXML(element[i],graph);
            if(document.getElementById("disablevisit").checked == false){
                var priority = getGeneric(element[i],"priority");
                var order = getGeneric(element[i],"order");
                var path = getPathForElementXML(getGeneric(element[i],"pathlist"));
            }
            if(name!=null && reference != null && print !=null && tableinfo != null){
                if(inputstring != null){
                    var data={
                        name: name,
                        print: print,
                        reference: reference,
                        inputstring: inputstring,
                        table: tableinfo,
                        inputstring : inputstring
                    }
                }else{
                    var data={
                        name: name,
                        print: print,
                        reference: reference,
                        inputstring: inputstring,
                        table: tableinfo
                    }
                }
            }
            if ((typeof priority != 'undefined' && priority != null) && (typeof order != 'undefined' && order != null) && (typeof path != 'undefined' && path != null)) {
                var data2={
                    priority : priority,
                    order :  order,
                    path : path
                }
            }

            if((typeof data != 'undefined' && data != null) && (typeof data2 != 'undefined' && data2 != null)){
                var all ={
                    semantic : data,
                    visit : data2
                }
            }else if(typeof data != 'undefined' && data != null){
                var all ={
                    semantic : data,
                    visit: null
                }
            }
            if(typeof all != 'undefined' && all != null){
                array.push(all);
            }

        }
    }
    if(array.length ==0){
        return null;
    }else{
        return array;
    }

}