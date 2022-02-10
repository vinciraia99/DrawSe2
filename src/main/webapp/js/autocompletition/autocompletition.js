function autocompletitiontrigger(){
    let tokenname = getAllNameStencilConnector();
    let abstractsentence =["name","isSymbol","attType","attConName","visited", "status"];
    let abstractsentence2 =["KeyName","Cardin","EntName","AttrName", "RelName","Rel","Cond","Desc","Code"];
    let foll = ["follAttName=","follAttType="]
    $('#tabella .print, .params, .path').atwho({
        at: "[",
        data: foll,
        limit: foll.length
    })
    $('#tabella .print, .params, .path').atwho({
        at: "/",
        data: tokenname,
        limit: tokenname.length
    })
    $('#tabella .print, .params').atwho({
        at: "#",
        data: abstractsentence,
        limit: abstractsentence.length
    })
    $('#tabella .print, .params, .params2').atwho({
        at: "@",
        data: abstractsentence2,
        limit: abstractsentence2.length
    })
    $(".print").click(function () {
        var list = new Array();
        list.push("Id");
        for (let i = 0; i < document.getElementsByClassName("property").length; i++) {
            if(document.getElementsByClassName("property")[i].value.replaceAll('$', '') != ""){
                list.push(document.getElementsByClassName("property")[i].value.replaceAll('$', ''));
            }
        }
        $('.print').atwho({
            at: "$",
            data: list,
            limit: list.length
        })
    });
}

function getAllNameStencilConnector(){
    try{
        let graph = tempGraph;
        let allShapes = graph.getModel().filterDescendants(function (cell) {
            if ((cell.vertex || cell.edge)) {
                if (cell.getStyle().includes('stencil')) {
                    return true;
                }
            }
        });

        let allConns = graph.getModel().filterDescendants(function (cell) {
            if ((cell.vertex || cell.edge)) {
                if (cell.getStyle().includes('ap=')) {
                    return true;
                }
            }
        });

        let array = new Array();
        for(let i=0;i<allShapes.length;i++){
            array.push(getNameStencil(allShapes[i],graph));
        }

        for(let i=0;i<allConns.length;i++){
            array.push(getNameConnector(allConns[i],graph));
        }

        return array;
    }catch (e){
        return new Array();
    }


}