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
        for(var k=0;k<2;k++){
            if(k==0){
                var sub = allShapes;
            }else if(k==1){
                var sub = allConns;
            }
            for(var i=0;i<sub.length;i++) {
                if(k==0){
                    var shape = sub[i];
                    var stencil = shape.getStyle();
                    var base64 = stencil.substring(14, stencil.length - 2);
                    var name = mxUtils.parseXml(graph.decompress(base64)).documentElement.getAttribute('name');
                }else if (k==1){
                    var edge = sub[i];
                    var stencil = edge.getStyle();
                    var edgeStyle = edge.getStyle();
                    var initCut = edgeStyle.indexOf("name=")
                    edgeStyle = edgeStyle.substring(edgeStyle.indexOf("name="), edgeStyle.length);
                    var toCut = edgeStyle.indexOf(";");
                    edgeStyle = edgeStyle.substring(5,toCut);
                    var name = edgeStyle;
                }
                var base64 = stencil.substring(14, stencil.length-2);
                var desc = tempGraph.decompress(base64);
                var shapeXml = mxUtils.parseXml(desc).documentElement;
                if(shapeXml.getElementsByTagName("prioritytable")[0] !=null){
                    var data ={
                        name: name,
                        priority: shape.priority
                    };
                    elementFigureList.unshift(data);
                }else{
                    if(k==0){
                        var data ={
                            name: name,
                            priority: 0,
                            oggetto: shape,
                            tipo: "Stencil"
                        };
                    }else if(k==1){
                        var data ={
                            name: name,
                            priority: 0,
                            oggetto: shape,
                            tipo: "Connector"
                        };
                    }
                    elementFigureList.unshift(data);
                }
            }
        }

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

    for (var k=0;k<2;k++){
        if(k==0){
            var list = stencilList;
            var lname = "Stencil";
        }else if (k==1){
            var list = connectorList;
            var lname = "Connector";
        }

        debugger;
        if(list.length >0){
            for(var i=0;i<list.length;i++){
                var row2 = document.createElement("tr");
                var row3 = document.createElement("td");
                row3.setAttribute("class","tg-0pky");
                row3.innerHTML = list[i]["name"] + " (<b>" + lname+ "</b>)";
                var row4 = row3.cloneNode(true);
                row4.innerHTML = "<input type=\"number\" class=\"priority\" value='"+ list[i]["priority"] +"'>"

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