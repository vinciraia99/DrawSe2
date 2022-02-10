var elementOrderedFigureList;
var indexprioritytable = 0;

function showPriorityTable(graph) {
    tempGraph = graph;
    var elementFigureList = new Array();
    elementOrderedFigureList = new Array();

    var allShapes = graph.getModel().filterDescendants(function (cell) {
        if ((cell.vertex || cell.edge)) {
            if (cell.getStyle().includes('stencil')) {
                return true;
            }
        }
    });

    //Ricavo tutti gli archi orientati per i quali è definito un attack type
    var allConns = graph.getModel().filterDescendants(function (cell) {
        if ((cell.vertex || cell.edge)) {
            if (cell.getStyle().includes('ap=')) {
                return true;
            }
        }
    });

    if (allShapes.length > 0 || allConns.length > 0) {
        for (var i = 0; i < allShapes.length; i++) {
            var reference = getGeneric(allShapes[i], "reference");
            if (reference != null) {
                var priority = getGeneric(allShapes[i], "priority");
                var order = getGeneric(allShapes[i], "order");
                var pathxml = getGeneric(allShapes[i], "pathlist");
                if (priority != null) {
                    var data = {
                        element: allShapes[i],
                        reference: reference,
                        priority: priority,
                        order: order,
                        path: pathxml,
                        type: "Stencil"
                    };
                } else {
                    var data = {
                        element: allShapes[i],
                        reference: reference,
                        priority: 0,
                        type: "Stencil"
                    };
                }
                elementFigureList.push(data);
            }
        }
        for (var i = 0; i < allConns.length; i++) {
            var reference = getGeneric(allConns[i], "reference");
            if (reference != null) {
                var priority = getGeneric(allConns[i], "priority");
                var order = getGeneric(allConns[i], "order");
                var pathxml = getGeneric(allConns[i], "pathlist");
                if (priority != null) {
                    var data = {
                        element: allConns[i],
                        reference: reference,
                        priority: priority,
                        order: order,
                        path: pathxml,
                        type: "Connector"
                    };
                } else {
                    var data = {
                        element: allConns[i],
                        reference: reference,
                        priority: 0,
                        type: "Connector"
                    };
                }
                elementFigureList.push(data);
            }
        }
        var order = 0;
        for (var i = 0; i < elementFigureList.length; i++) {
            for (var k = 0; k < elementFigureList.length; k++) {
                if (elementFigureList[k].order != null && order == elementFigureList[k].order) {
                    order++;
                    elementOrderedFigureList.push(elementFigureList[k]);
                    break;
                }
            }
        }
        if (order != elementFigureList.length) {
            var l = elementFigureList.length;
            for (var i = 0; i < l; i++) {
                if (elementFigureList[i].order != null && order == elementFigureList[i].order) {
                    elementFigureList.splice(i, 1);
                    l--;
                    i = 0;
                }
            }
            for (var i = 0; i < elementFigureList.length; i++) {
                if (elementFigureList[i].order == null) {
                    order++;
                    elementOrderedFigureList.push(elementFigureList[i]);
                }
            }
        }
        generateHTMLTablePiority();
        document.getElementById("overlay").style.display = "flex";
    }else {
            mxUtils.alert("Define at least one connector or stencil");
    }


}


function generateHTMLTablePiority() {
        var div = document.getElementById("overlay1");
        var tbl = document.createElement("table");
        tbl.setAttribute("class", "tabella");
        tbl.setAttribute("id", "tabella");
        //Creo riga titolo
        var tblHead = document.createElement("thead");
        var row = document.createElement("tr");
        var row1 = document.createElement("th");
        row1.setAttribute("colspan", "3");
        row1.setAttribute("class", "tg-l93j");
        row1.innerHTML = "Visit Table";
        //Fine crea riga titolo
        var tblBody = document.createElement("tbody");
        tblBody.setAttribute("class", "bodytable");
        var row2 = document.createElement("tr");
        var row3 = document.createElement("td");
        row3.setAttribute("class", "tg-0pky");
        row3.innerHTML = "Order"
        var row4 = row3.cloneNode(true);
        row4.innerHTML = "Priority"
        var row6 = row3.cloneNode(true);
        row6.innerHTML = "Paths"


        row2.appendChild(row3);
        row2.appendChild(row4);
        row2.appendChild(row6);
        tblBody.appendChild(row2);
        row.appendChild(row1);
        tblHead.appendChild(row);

        if (elementOrderedFigureList.length > 0) {
            for (var i = 0; i < elementOrderedFigureList.length; i++) {
                var row2 = document.createElement("tr");
                row2.setAttribute("class","trmain");
                var row3 = document.createElement("td");
                row3.setAttribute("class", "tg-0pky");
                row3.innerHTML = elementOrderedFigureList[i]["reference"] + " (<b>" + elementOrderedFigureList[i]["type"] + "</b>)";
                var row4 = row3.cloneNode(true);
                row4.innerHTML = "<input type=\"number\" class=\"priority\" value='" + elementOrderedFigureList[i]["priority"] + "'>"

                var row5 = document.createElement("td");
                var list = getPathForElementXML(elementOrderedFigureList[i]["path"]);

                var confirmButton = document.createElement("p");
                confirmButton.setAttribute("class", "plusbutton");
                confirmButton.setAttribute("onclick", "createPathRow(this,"+ i +")");
                confirmButton.innerHTML = "+"
                row5.appendChild(confirmButton);

                var row7 = document.createElement("td");
                row7.setAttribute("class", "tg-0pky");
                var divv = document.createElement("div");
                divv.setAttribute("class", "rowinline");
                var buttonup = document.createElement("button");
                buttonup.setAttribute("class", "btnup");
                var ii = document.createElement("i");
                ii.setAttribute("class", "arrow up");
                buttonup.appendChild(ii);
                buttonup.setAttribute("onclick", "setOrderUpBex(" + indexprioritytable + ")");
                var buttondown = document.createElement("button");
                buttondown.setAttribute("class", "btndown");
                buttondown.setAttribute("onclick", "setOrderDownBex(" + indexprioritytable + ")");
                var i2 = document.createElement("i");
                i2.setAttribute("class", "arrow down");
                buttondown.appendChild(i2);

                divv.appendChild(buttonup);
                divv.appendChild(buttondown);
                row7.appendChild(divv);
                row2.appendChild(row3);
                row2.appendChild(row4);
                row2.appendChild(row5);
                row2.appendChild(row7);
                tblBody.appendChild(row2);
                if (list != null) {
                    for (var k = 0; k < list.length; k++) {
                        createPathRow2(list[k],row5,k);
                    }
                }
                indexprioritytable++;
            }
        }

    tbl.appendChild(tblHead);
    tbl.appendChild(tblBody);
    div.appendChild(tbl);

    let divd = document.createElement("div");
    divd.setAttribute("class","rowinline");

    let confirmButton2 = document.createElement("p");
    confirmButton2.setAttribute("class", "pop-x");
    confirmButton2.setAttribute("onclick", "hideTablePriority()");
    confirmButton2.innerHTML = "Save"

    let exitWithoutSaving = document.createElement("p");
    exitWithoutSaving.setAttribute("class","buttonnosave");
    exitWithoutSaving.setAttribute("id","buttonnosave");
    exitWithoutSaving.setAttribute("onclick","hideTablePriorityWithoutSaving()");
    exitWithoutSaving.innerHTML="Exit Without Saving"

    divd.appendChild(exitWithoutSaving);
    divd.innerHTML = divd.innerHTML + "&nbsp;";

    divd.appendChild(confirmButton2);


    div.appendChild(divd);

    var p = document.createElement("p");
    p.innerHTML = "<b>Hint:</b> Connectors appear in the priority table only if they have at least one attack point";
    div.appendChild(p);

}

function hideTablePriority() {
    for(var i=0;i<elementOrderedFigureList.length;i++){
        saveGenericValue(elementOrderedFigureList[i]["element"],document.getElementsByClassName("trmain")[i].getElementsByClassName("priority")[0].value,"priority");
        var array = createPathArray(i);
        if(array != null){
            saveGenericValue(elementOrderedFigureList[i]["element"],visitTableToXML(array),"pathlist");
        }else{
            removeTableInfo(elementOrderedFigureList[i]["element"],"pathlist=");
        }
        saveGenericValue(elementOrderedFigureList[i]["element"],(i+1)+"","order");
        elementOrderedFigureList[i]["element"].parent.backup =  elementOrderedFigureList[i]["element"].style;
    }

    let div = document.getElementById("overlay1");
    div.removeAttribute("style");
    div.innerHTML = "";
    document.getElementById("overlay").style.display = "none";
    indexprioritytable = 0;
    tempGraph = null;
    stencilList = null;
    connectorList = null;

}

function hideTablePriorityWithoutSaving(){
    let div = document.getElementById("overlay1");
    div.removeAttribute("style");
    div.innerHTML = "";
    document.getElementById("overlay").style.display = "none";
    indexprioritytable = 0;
    tempGraph = null;
    stencilList = null;
    connectorList = null;
}

function createPathArray(index){
    var ar = new Array();
    var tr = document.getElementsByClassName("trmain")[index];
    if(tr.getElementsByClassName("patht") != null){
        for(var k=0;k<tr.getElementsByClassName("patht").length;k++){
            var patht = tr.getElementsByClassName("patht")[k].value;
            var path = tr.getElementsByClassName("path")[k].value;
            var data = {
                path: path,
                patht: patht
            };
            ar.push(data);
        }
        return ar;
    }else{
        return null;
    }
}

function createPathRow2(list,t,index){
    var table = t.getElementsByClassName("tablepath")[0];
    if(table == null){
        var tablee = document.createElement("table");
        tablee.setAttribute("class","tablepath");
    }
    var tr  = document.createElement("tr");
    var td = document.createElement("td");
    td.setAttribute("style","border-color:transparent");
    var formed = " <select name=\"patht\" class=\"patht\">\n";
    if (list["patht"] == "D") {
            formed = formed + "<option value=\"D\" selected>D</option>\n" +
                "    <option value=\"A\">A</option>\n" +
                "  </select>";
    } else if (list["patht"] == "A") {
            formed = formed + "<option value=\"D\" >D</option>\n" +
                "    <option value=\"A\" selected>A</option>\n" +
                "  </select>";
    }
    td.innerHTML = formed;
    tr.appendChild(td);
    let td2 = document.createElement("td");
    td2.setAttribute("style","border-color:transparent");
    if(list["path"] != null) {
        let input = document.createElement("input");
        input.setAttribute("type","text");
        input.setAttribute("class","path");
        input.setAttribute("value",list["path"]);
        td2.appendChild(input);
    }
    tr.appendChild(td2);
    var row10 = td.cloneNode(true);
    tr.appendChild(row10);
    if(table != null){
        table.appendChild(tr);
    }else{
        tablee.appendChild(tr);
        t.insertBefore(tablee,t.getElementsByClassName("plusbutton")[0]);
    }
    row10.innerHTML = "<button class=\"btn\" onclick='removePath(this)'><i class=\"fa fa-trash\"></i></button>"
}

