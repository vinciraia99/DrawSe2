var tempGraph;
function showTable(graph) {
    tempGraph = graph;
        if(graph.editorMode == "Shape Editor Mode"){
            var stencil = graph.getSelectionCell().getStyle();
            var base64 = stencil.substring(14, stencil.length-2);
            if(tempGraph.getSelectionCell().style.search("stencil") > 0){
                var nomeOggetto = mxUtils.parseXml(graph.decompress(base64)).documentElement.getAttribute('name');
            }else {
                if(tempGraph.getSelectionCell().style.search("endArrow")!= -1){
                    nomeOggetto= getNameConnector();
                }
            }
            if(nomeOggetto==null){
                mxUtils.alert("First define the points of the object in Constraint Mode!");
            }else{
                console.log(nomeOggetto);
                createSingleTable(nomeOggetto);
                createConfirmButton();
                document.getElementById("overlay").style.display = "flex";
            }
        }else{
            mxUtils.alert("You can use this function only in Shape Mode");
        }
}

function getNameConnector(){
    if(!tempGraph.getSelectionCell().getStyle().includes("name=")){
        var id = tempGraph.getSelectionCell().id
        var name = "EDGE_" + id;
        var style = tempGraph.getSelectionCell().getStyle() +"name="+ name +";";
        tempGraph.getSelectionCell().setStyle(style);
    }
    else{
        var edge = tempGraph.getSelectionCell();
        var edgeStyle = edge.getStyle();
        var initCut = edgeStyle.indexOf("name=")
        edgeStyle = edgeStyle.substring(edgeStyle.indexOf("name="), edgeStyle.length);
        var toCut = edgeStyle.indexOf(";");
        edgeStyle = edgeStyle.substring(5,toCut);
        var name = edgeStyle;
    }
    return name;
}


function hideTable() {
    if(saveDataTable()){
        var name =  document.getElementById("nameshape").value;
        try{
            saveNameStencil(name);
        }catch (error){
            saveNameConnector(name);
        }
        var div = document.getElementById("overlay1");
        div.innerHTML ="";
        document.getElementById("overlay").style.display = "none";
        tempGraph=null;
    }
}

function savePrint(){
    var x =document.getElementsByClassName("print")[0].value;
    tempGraph.getSelectionCell().print = x;
}

function saveNameStencil(name){
    var cell = tempGraph.getSelectionCell();
    cell.setAttribute('name', name);
    var stencil = cell.getStyle();
    var base64 = stencil.substring(14, stencil.length-2);
    var desc = tempGraph.decompress(base64);
    var shapeXml = mxUtils.parseXml(desc).documentElement;
    shapeXml.setAttribute("name" ,name);
    var xmlBase64 = tempGraph.compress(mxUtils.getXml(shapeXml));
    console.log(xmlBase64)
    cell.setStyle('shape=stencil(' + xmlBase64 + ');')
    tempGraph.getSelectionModel().clear();
    tempGraph.refresh();
}

function saveNameConnector(name){
    var edge = tempGraph.getSelectionCell();
    var edgeStyle = edge.getStyle();
    var initCut = edgeStyle.indexOf("name=")
    edge.setAttribute("name", name);


    if(initCut == -1) {
        var style = edge.getStyle() +"name="+ name +";";
        edge.setStyle(style);
    }
    else{
        edgeStyle = edgeStyle.substring(edgeStyle.indexOf("name="), edgeStyle.length);
        var toCut = edgeStyle.indexOf(";");
        edgeStyle = edgeStyle.substring(0,toCut);
        edge.setStyle(edge.getStyle().replace(edgeStyle,"name="+ name))
    }

    tempGraph.getSelectionModel().clear();
    tempGraph.refresh();
}
var rowcount =2;
function createSingleTable(nome){
    var div = document.getElementById("overlay1");
    var tbl = document.createElement("table");
    tbl.setAttribute("class", "tabella");
    tbl.setAttribute("id", "tabella");
    //Creo riga titolo
    var tblHead = document.createElement("thead");
    var row = document.createElement("tr");
    var row1 = document.createElement("th");
    row1.setAttribute("colspan","3");
    row1.setAttribute("class","tg-l93j");
    row1.innerHTML="Nome stencil<br><input id=\"nameshape\" type=\"text\" value=\"" + nome + "\">";
    //Fine crea riga titolo
    var tblBody = document.createElement("tbody");
    tblBody.setAttribute("class", "bodytable");
    var row2 = document.createElement("tr");
    var row3 = document.createElement("td");
    row3.setAttribute("class","tg-0pky");
    row3.setAttribute("colspan","3");
    if(tempGraph.getSelectionCell().print != null){
        row3.innerHTML="<input type=\"text\" placeholder=\"print\" class='print' value='"+ tempGraph.getSelectionCell().print +"'>";
    }else{
        row3.innerHTML="<input type=\"text\" placeholder=\"print\" class='print' value='print();'>";
    }


    var rowproperty =document.createElement("tr");
    var rowproperty1 =document.createElement("td");
    rowproperty1.setAttribute("class","tg-0pky");
    rowproperty1.innerHTML="<b>Property</b>";
    var rowproperty2 =rowproperty1.cloneNode(true);
    rowproperty2.innerHTML="<b>Procedure</b>";
    var rowproperty3 =rowproperty1.cloneNode(true);
    rowproperty3.innerHTML="<b>Params</b>";
    rowproperty.appendChild(rowproperty1);
    rowproperty.appendChild(rowproperty2);
    rowproperty.appendChild(rowproperty3);

    var row4 = document.createElement("tr");
    var row5 = document.createElement("td");
    row5.setAttribute("colspan",3);
    var confirmButton = document.createElement("p");
    confirmButton.setAttribute("class","plusbutton");
    confirmButton.setAttribute("onclick","createRow()");
    confirmButton.innerHTML="+"

    row5.appendChild(confirmButton);
    row4.appendChild(row5);

    row2.appendChild(row3);
    row.appendChild(row1);
    tblBody.appendChild(rowproperty);
    tblBody.appendChild(row4);
    tblBody.appendChild(row2);
    tblHead.appendChild(row);
    tbl.appendChild(tblHead);
    tbl.appendChild(tblBody);
    div.appendChild(tbl);
    rowcount =2;
    if(tempGraph.getSelectionCell().datiTabella != null){
        for(var i=0;i<tempGraph.getSelectionCell().datiTabella.length;i++){
            createRow(tempGraph.getSelectionCell().datiTabella[i]["property"],tempGraph.getSelectionCell().datiTabella[i]["type"],tempGraph.getSelectionCell().datiTabella[i]["procedure"],tempGraph.getSelectionCell().datiTabella[i]["params"]);
        }
    }
}

function createRow(property,propertyType,procudure,params){
    var a = document.getElementsByClassName("bodytable")[0];
    var row4 = document.createElement("tr");
    var row5 = document.createElement("td");
    if(property!=null && propertyType!=null){
        row5.innerHTML="<input type=\"text\" class=\"property\" value='"+ property +"'>" + " <b>:</b> " +"<input list=\"typelist\" type=\"text\" class=\"type\" value='"+ propertyType +"'>";
    }else if(property!=null){
        row5.innerHTML="<input type=\"text\" class=\"property\" value='"+ property +"'>" + " <b>:</b> " +"<input type=\"text\" class=\"type\" placeholder='value type' list=\"typelist\">";
    }else{
        row5.innerHTML="<input type=\"text\" placeholder='$value' class=\"property\">"+ " <b>:</b> " +"<input type=\"text\" class=\"type\" placeholder='value type' list=\"typelist\">";
    }
    var datalistrow5 =
        "    <datalist id=\"typelist\">\n" +
        "        <option value=\"string\">string</option>\n" +
        "        <option value=\"int\">int</option>\n" +
        "        <option value=\"boolean\">boolean</option>\n" +
        "        <option value=\"list<string>\">list\&lt;string&gt;</option>\n" +
        "        <option value=\"list<int>\">list&lt;int&gt;</option>\n" +
        "    </datalist>";
    row5.innerHTML = "<div class=\"rowinline\">" +row5.innerHTML + datalistrow5 + "</div>";

    row4.appendChild(row5);
    var row6 = row5.cloneNode(true);
    var s =
        "    <datalist id=\"listObj\">\n" +
        "        <option value=\"assign\">assign</option>\n" +
        "        <option value=\"add\">add</option>\n" +
        "        <option value=\"addAll\">addAll</option>\n" +
        "        <option value=\"size\">size</option>\n" +
        "        <option value=\"exist\">exist</option>\n" +
        "    </datalist>"
    if(procudure!=null) {
        row6.innerHTML = "<input type=\"text\" class=\"procedure\"  list=\"listObj\" value='"+ procudure +"'>" + s;
    }else{
        row6.innerHTML = "<input type=\"text\" class=\"procedure\" list=\"listObj\">" + s;
    }
    row4.appendChild(row6);
    var row7 = row5.cloneNode(true);
    if(params!=null) {
        row7.innerHTML="<input type=\"text\" class=\"params\" value='"+ params +"'>";
    }else{
        row7.innerHTML="<input type=\"text\" class=\"params\">";
    }
    row4.appendChild(row7);
    var row9 = document.createElement("td");
    row9.innerHTML = "<button class=\"btn\" onclick='removeRow(" + rowcount++ +")'><i class=\"fa fa-trash\"></i></button>"
    row4.appendChild(row9);
    a.insertBefore(row4.cloneNode(true), a.children[a.children.length-2]);
}

function removeRow(i){
    document.getElementsByTagName('tr')[i].remove();
    rowcount--;
    for(var y=i-2;y<rowcount-2;y++){
        var sum = parseInt(y)+2;
        document.getElementsByClassName("btn")[y].setAttribute("onclick", 'removeRow(' + sum +')');
    }
}

function createConfirmButton(){
    var div = document.getElementById("overlay1");
    var confirmButton = document.createElement("p");
    confirmButton.setAttribute("class","pop-x");
    confirmButton.setAttribute("onclick","hideTable()");
    confirmButton.innerHTML="Confirm"

    div.appendChild(confirmButton);
}

function saveDataTable(){
    let array = new Array();
    for(var i=0;i<document.getElementsByClassName("property").length;i++){
        document.getElementsByClassName("params")[i].style.background  ="white"
        document.getElementsByClassName("params")[i].style.color = "black"
        document.getElementsByClassName("procedure")[i].style.background  ="white"
        document.getElementsByClassName("procedure")[i].style.color = "black"
        document.getElementsByClassName("type")[i].style.background  ="white"
        document.getElementsByClassName("type")[i].style.color = "black"
        document.getElementsByClassName("property")[i].style.background  ="white"
        document.getElementsByClassName("property")[i].style.color = "black"
    }
    for(var i=0;i<document.getElementsByClassName("property").length;i++){
        var params = document.getElementsByClassName("params")[i].value;
        var procedure = document.getElementsByClassName("procedure")[i].value;
        var property = document.getElementsByClassName("property")[i].value;
        var type = document.getElementsByClassName("type")[i].value;
        if(params == "" && procedure == "" && property == "" && type == ""){

        } else{
            if(params == "" || procedure == "" || property == "" || type == ""){
                document.getElementsByClassName("params")[i].style.background  ="red"
                document.getElementsByClassName("params")[i].style.color = "white"
                document.getElementsByClassName("procedure")[i].style.background  ="red"
                document.getElementsByClassName("procedure")[i].style.color = "white"
                document.getElementsByClassName("type")[i].style.background  ="red"
                document.getElementsByClassName("type")[i].style.color = "white"
                document.getElementsByClassName("property")[i].style.background  ="red"
                document.getElementsByClassName("property")[i].style.color = "white"
                mxUtils.alert("A field of a row is empty if you do not want to load a row leave all fields empty");
                return false;
            }
            var data ={
                property: property,
                type: type,
                procedure: procedure,
                params: params
            };
            array.push(data);
        }
    }
    if(checkInput(document.getElementsByClassName("print")[0].value,array)){
        tempGraph.getSelectionCell().datiTabella = array;
        savePrint();
        return true;
    }else{
        mxUtils.alert("The properties you invoked have not been defined. I have created the field for you to fill in to be able to continue");
        removeWhiteLine();
        return false;
    }

}

function checkInput(input,array){
    var find = 0;
    var tot = 0;
    var splitting = input.split(/\s+|\(|\)|;/gm);
    for(var i=0;i<splitting.length;i++){
        if(splitting[i].includes("$")){tot++;}
        for (var j=0;j<array.length;j++){
            if(splitting[i].includes("$")){
                if(array[j]["property"] == splitting[i]){
                    splitting.splice(i, 1);
                    if(i>0){i=i-1;}
                    find++;
                }
            }

        }
    }
    for(var i=0;i<splitting.length;i++){
        if(splitting[i].includes("$")){
            createRow(splitting[i]);
        }
    }
    if(find == tot){
        return true;
    }else{
        return false;
    }
    //savePrint();


}

function removeWhiteLine(){
    for(var i=0;i<document.getElementsByClassName("property").length;i++){
        var params = document.getElementsByClassName("params")[i].value;
        var procedure = document.getElementsByClassName("procedure")[i].value;
        var property = document.getElementsByClassName("property")[i].value;
        var type = document.getElementsByClassName("type")[i].value;
        document.getElementsByClassName("params")[i].style.background  ="white"
        document.getElementsByClassName("params")[i].style.color = "black"
        document.getElementsByClassName("procedure")[i].style.background  ="white"
        document.getElementsByClassName("procedure")[i].style.color = "black"
        document.getElementsByClassName("type")[i].style.background  ="white"
        document.getElementsByClassName("type")[i].style.color = "black"
        document.getElementsByClassName("property")[i].style.background  ="white"
        document.getElementsByClassName("property")[i].style.color = "black"
        if(params == "" && procedure == "" && property == "" && type == ""){
            removeRow(i+2);
            i--;
        }
    }

}

var stencilList;
var connectorList;

function showPriorityTable(graph){
    tempGraph = graph;
    stencilList = new Array();
    connectorList = new Array();

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
        for(var i=0;i<allShapes.length;i++) {
            var shape = allShapes[i];
            var stencil = shape.getStyle();
            var base64 = stencil.substring(14, stencil.length - 2);
            var name = mxUtils.parseXml(graph.decompress(base64)).documentElement.getAttribute('name');
            if(shape.priority !=null){
                var data ={
                    name: name,
                    priority: shape.priority
                };
                stencilList.push(data);
            }else{
                var data ={
                    name: name,
                    priority: 0
                };
                stencilList.push(data);
            }
        }

        for(var i=0;i<allConns.length;i++) {
            var edge = allConns[i];
            var edgeStyle = edge.getStyle();
            var initCut = edgeStyle.indexOf("name=")
            edgeStyle = edgeStyle.substring(edgeStyle.indexOf("name="), edgeStyle.length);
            var toCut = edgeStyle.indexOf(";");
            edgeStyle = edgeStyle.substring(5,toCut);
            var name = edgeStyle;
            if(edge.priority !=null){
                var data ={
                    name: name,
                    priority: edge.priority
                };
                connectorList.push(data);
            }else{
                var data ={
                    name: name,
                    priority: 0
                };
                connectorList.push(data);
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
    div.setAttribute("style","width: 50%;");
    var tbl = document.createElement("table");
    tbl.setAttribute("class", "tabella");
    tbl.setAttribute("id", "tabella");
    //Creo riga titolo
    var tblHead = document.createElement("thead");
    var row = document.createElement("tr");
    var row1 = document.createElement("th");
    row1.setAttribute("colspan","3");
    row1.setAttribute("class","tg-l93j");
    row1.innerHTML="Priority Table";
    //Fine crea riga titolo
    var tblBody = document.createElement("tbody");
    tblBody.setAttribute("class", "bodytable");
    var row2 = document.createElement("tr");
    var row3 = document.createElement("td");
    row3.setAttribute("class","tg-0pky");
    row3.innerHTML = "Name"
    var row4 = row3.cloneNode(true);
    row4.innerHTML = "Priority"


    row2.appendChild(row3);
    row2.appendChild(row4);
    tblBody.appendChild(row2);
    row.appendChild(row1);
    tblHead.appendChild(row);

    if(stencilList.length >0){
        var row5 = document.createElement("tr");
        var row6 = document.createElement("td");
        row6.innerHTML = "Stencil"
        row6.setAttribute("class","tg-l93j");
        row6.setAttribute("colspan","2");
        row5.appendChild(row6);

        tblBody.appendChild(row5);


        for(var i=0;i<stencilList.length;i++){
            var row2 = document.createElement("tr");
            var row3 = document.createElement("td");
            row3.setAttribute("class","tg-0pky");
            row3.innerHTML = stencilList[i]["name"];
            var row4 = row3.cloneNode(true);
            row4.innerHTML = "<input type=\"number\" class=\"priority\" value='"+ stencilList[i]["priority"] +"'>"
            row2.appendChild(row3);
            row2.appendChild(row4);
            tblBody.appendChild(row2);
        }
    }

    if(connectorList.length >0){
        var row5 = document.createElement("tr");
        var row6 = document.createElement("td");
        row6.innerHTML = "Connector"
        row6.setAttribute("class","tg-l93j");
        row6.setAttribute("colspan","2");
        row5.appendChild(row6);
        tblBody.appendChild(row5);

        for(var i=0;i<connectorList.length;i++){
            var row2 = document.createElement("tr");
            var row3 = document.createElement("td");
            row3.setAttribute("class","tg-0pky");
            row3.innerHTML = connectorList[i]["name"];
            var row4 = row3.cloneNode(true);
            row4.innerHTML = "<input type=\"number\" class=\"priority\" value='"+ connectorList[i]["priority"] +"'>"
            row2.appendChild(row3);
            row2.appendChild(row4);
            tblBody.appendChild(row2);
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
