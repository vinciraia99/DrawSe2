var elementFigureList;
var indexprioritytable =2;

function showPriorityTable(graph){
    tempGraph = graph;
    elementFigureList = new Array();

    var allShapes = graph.getModel().filterDescendants(function(cell) {
        if((cell.vertex || cell.edge)){
            if(cell.getStyle().includes('stencil')){
                return true;
            }
        }
    });

    //Ricavo tutti gli archi orientati per i quali è definito un attack type
    var allConns = graph.getModel().filterDescendants(function(cell) {
        if((cell.vertex || cell.edge)){
            if(cell.getStyle().includes('ap=')){
                return true;
            }
        }
    });

    if(allShapes.length >0 || allConns.length>0){
        for(var i=0;i<allShapes.length;i++){
            var reference = getGeneric(allShapes[i],"reference");
            var priority = getGeneric(allShapes[i],"priority");
            var order = getGeneric(allShapes[i],"order");
            var pathxml = getGeneric(allShapes[i],"path");
            if(priority != null){
                var data ={
                    reference: reference,
                    priority: priority,
                    order: order,
                    path: pathxml,
                    type: "Stencil"
                };
                elementFigureList.push(data);
            }
        }
        debugger;
        generateHTMLTablePiority();
        document.getElementById("overlay").style.display = "flex";
    }else{
        mxUtils.alert("Define at least one connector or stencil");
    }

}

function generateHTMLTablePiority(){
    var div = document.getElementById("overlay1");
    var tbl = document.createElement("table");
    tbl.setAttribute("class", "tabella");
    tbl.setAttribute("id", "tabella");
    //Creo riga titolo
    var tblHead = document.createElement("thead");
    var row = document.createElement("tr");
    var row1 = document.createElement("th");
    row1.setAttribute("colspan","4");
    row1.setAttribute("class","tg-l93j");
    row1.innerHTML="Visit Table";
    //Fine crea riga titolo
    var tblBody = document.createElement("tbody");
    tblBody.setAttribute("class", "bodytable");
    var row2 = document.createElement("tr");
    var row3 = document.createElement("td");
    row3.setAttribute("class","tg-0pky");
    row3.innerHTML = "Order"
    var row4 = row3.cloneNode(true);
    row4.innerHTML = "Priority"
    var row6 = row3.cloneNode(true);
    row6.innerHTML = "Paths"
    row6.setAttribute("colspan","2");


    row2.appendChild(row3);
    row2.appendChild(row4);
    row2.appendChild(row6);
    tblBody.appendChild(row2);
    row.appendChild(row1);
    tblHead.appendChild(row);

    if(elementFigureList.length >0){
        for(var i=0;i<elementFigureList.length;i++){
                var row2 = document.createElement("tr");
                var row3 = document.createElement("td");
                row3.setAttribute("class","tg-0pky");
                row3.innerHTML = elementFigureList[i]["reference"] + " (<b>" + lname+ "</b>)";
                var row4 = row3.cloneNode(true);
                row4.innerHTML = "<input type=\"number\" class=\"priority\" value='"+ elementFigureList[i]["priority"] +"'>"

                var row5 = row3.cloneNode(true);
                if(list[i]["patht"] == null){
                    row5.innerHTML = " <select name=\"patht\" id=\"patht\">\n" +
                        "    <option value=\"D\">D</option>\n" +
                        "    <option value=\"A\">A</option>\n" +
                        "  </select>";
                }else{
                    var formed= " <select name=\"patht\" id=\"patht\">\n";
                    if (list[i]["patht"] == "D"){
                        formed = formed + "<option value=\"D\" selected>D</option>\n" +
                            "    <option value=\"A\">A</option>\n" +
                            "  </select>";
                    }else if (list[i]["patht"] == "A"){
                        formed = formed + "<option value=\"D\" >D</option>\n" +
                            "    <option value=\"A\" selected>A</option>\n" +
                            "  </select>";
                    }
                    row5.innerHTML = formed;
                }

                var row6 = row3.cloneNode(true);
                if(list[i]["path"] != null){
                    row6.innerHTML = "<input type=\"text\" class=\"priority\" value='"+ list[i]["path"] +"'>"
                }else{
                    row6.innerHTML = "<input type=\"text\" class=\"priority\" >"
                }

                var row7 = document.createElement("td");
                row7.setAttribute("class","tg-0pky");
                var divv = document.createElement("div");
                divv.setAttribute("class", "rowinline");
                var buttonup =  document.createElement("button");
                buttonup.setAttribute("class","btnup");
                var ii  = document.createElement("i");
                ii.setAttribute("class", "arrow up");
                buttonup.appendChild(ii);
                buttonup.setAttribute("onclick", "setOrderUpBex("+ indexprioritytable+")");
                var buttondown =  document.createElement("button");
                buttondown.setAttribute("class","btndown");
                buttondown.setAttribute("onclick", "setOrderDownBex("+ indexprioritytable+")");
                var i2  = document.createElement("i");
                i2.setAttribute("class", "arrow down");
                buttondown.appendChild(i2);

                divv.appendChild(buttonup);
                divv.appendChild(buttondown);
                row7.appendChild(divv);
                row2.appendChild(row3);
                row2.appendChild(row4);
                row2.appendChild(row5);
                row2.appendChild(row6);
                row2.appendChild(row7);
                tblBody.appendChild(row2);
                indexprioritytable++;
            }
        }
    }

    tbl.appendChild(tblHead);
    tbl.appendChild(tblBody);
    div.appendChild(tbl);

    var confirmButton = document.createElement("p");
    confirmButton.setAttribute("class","pop-x");
    confirmButton.setAttribute("onclick","hideTablePriority()");
    confirmButton.innerHTML="Confirm"

    div.appendChild(confirmButton);

    var p = document.createElement("p");
    p.innerHTML = "<b>Hint:</b> Connectors appear in the priority table only if they have at least one attack point";
    div.appendChild(p);

}

function hideTablePriority(){
    var tot =0;
    if(stencilList.length >0){
        var allShapes = tempGraph.getModel().filterDescendants(function(cell) {
            if((cell.vertex || cell.edge)){
                if(cell.getStyle().includes('stencil')){
                    return true;
                }
            }
        });

        for(var i=0;i<allShapes.length;i++) {
            var edge = allShapes[i];
            edge.priority = document.getElementsByClassName("priority")[tot].value;
            tot++;
        }
    }

    if(connectorList.length >0){
        //Ricavo tutti gli archi orientati per i quali è definito un attack type
        var allConns = tempGraph.getModel().filterDescendants(function(cell) {
            if((cell.vertex || cell.edge)){
                if(cell.getStyle().includes('ap=')){
                    return true;
                }
            }
        });
        for(var i=0;i<allConns.length;i++) {
            var edge = allConns[i];
            edge.priority = document.getElementsByClassName("priority")[tot].value;
            tot++;
        }
    }

    var div = document.getElementById("overlay1");
    div.removeAttribute("style");
    div.innerHTML ="";
    document.getElementById("overlay").style.display = "none";
    tempGraph=null;
    stencilList = null;
    connectorList = null;

}

function getVisitTableData(name){
    try{
        let array = new Array();
        try{
            var cell = tempGraph.getSelectionCell();
            var stencil = cell.getStyle();
            var base64 = stencil.substring(14, stencil.length-2);
            var desc = tempGraph.decompress(base64);
            var shapeXml = mxUtils.parseXml(desc).documentElement;
            var table =  shapeXml.getElementsByTagName("visittable")[0];
        }catch (e){
            var edge = tempGraph.getSelectionCell();
            var edgeStyle = edge.getStyle();
            var initCut = edgeStyle.indexOf("visittable=");
            if(initCut != -1){
                edgeStyle = getTableInfoFromConnector(edgeStyle,"visittable=");
                const parser = new DOMParser();
                const doc = parser.parseFromString(edgeStyle, "application/xml");
                const errorNode = doc.querySelector("parsererror");
                if (errorNode) {
                    console.log("error while parsing");
                    return null;
                }else{
                    var table = doc.getElementsByTagName("visittable")[0];;
                }
            }else{
                return null;
            }
        }

        for(var i=0;i<table.childElementCount;i++){
            var id = table.getElementsByTagName("id" + i)[0];
            var order = id.getElementsByTagName("order")[0].innerHTML;
            var priority = id.getElementsByTagName("priority")[0].innerHTML;
            var path1 = id.getElementsByTagName("path1")[0].innerHTML;
            var path2 = id.getElementsByTagName("path2")[0].innerHTML;
            var reference = id.getElementsByTagName("reference")[0].innerHTML;
            var postcondition = id.getElementsByTagName("postcondition")[0].innerHTML;
            var data ={
                property: property,
                type: type,
                procedure: procedure,
                params: params,
                params2: params2,
                postcondition : postcondition
            };
            array.push(data);
        }
        return array;
    }catch (e){
        console.error(e);
        return null;
    }
}