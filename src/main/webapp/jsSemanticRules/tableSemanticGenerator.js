var tempGraph;
var stencilList;
var connectorList;
function showTable(graph) {
    tempGraph = graph;
        if(graph.editorMode == "Shape Editor Mode"){
            var stencil = graph.getSelectionCell().getStyle();
            var base64 = stencil.substring(14, stencil.length-2);
            if(tempGraph.getSelectionCell().style.search("stencil") > 0){
                var nomeOggetto = mxUtils.parseXml(graph.decompress(base64)).documentElement.getAttribute('name');
            }else {
                if(tempGraph.getSelectionCell().style.search("endArrow")!= -1){
                    nomeOggetto= getNameConnector(tempGraph.getSelectionCell());
                }
            }
            if(nomeOggetto==null){
                mxUtils.alert("First define the points of the object in Constraint Mode!");
            }else{
                var reference = getReference();
                var checkboxString = getInputString();
                if(reference != null && checkboxString!= null){
                    createSingleTable(nomeOggetto,reference,checkboxString);
                }else if(reference != null){
                    createSingleTable(nomeOggetto,reference);
                }
                else{
                    createSingleTable(nomeOggetto);
                }
                console.log(nomeOggetto);
                createConfirmButton();
                document.getElementById("overlay").style.display = "flex";
            }
        }else{
            mxUtils.alert("You can use this function only in Shape Mode");
        }
}

function getNameConnector(graph){
    if(!graph.getStyle().includes("name=")){
        var id = graph.id
        var name = "EDGE_" + id;
        var style = tgraph.getStyle() +"name="+ name +";";
        graph.setStyle(style);
    }
    else{
        var edge = graph;
        var edgeStyle = edge.getStyle();
        var initCut = edgeStyle.indexOf("name=")
        edgeStyle = edgeStyle.substring(edgeStyle.indexOf("name="), edgeStyle.length);
        var toCut = edgeStyle.indexOf(";");
        edgeStyle = edgeStyle.substring(5,toCut);
        var name = edgeStyle;
    }
    return name;
}

function getNameStencil(element,graph){
    var stencil = element.getStyle();
    var base64 = stencil.substring(14, stencil.length-2);
    var nomeOggetto = mxUtils.parseXml(graph.decompress(base64)).documentElement.getAttribute('name');
    return nomeOggetto;
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
    savePrintXML(x);
}

function saveReference(){
    var x =document.getElementById("reference").value
    saveReferenceXML(x);
}

function saveInputString(){
    var x =document.getElementById("inputstring").value
    saveInputStringXML(x);
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

function getAllShapeConnectorName(){
    graph = tempGraph;
    stencilList = new Array();
    connectorList = new Array();
    var output =
        "    <datalist id=\"listname\">";
    var allShapes = graph.getModel().filterDescendants(function(cell) {
        if((cell.vertex || cell.edge)){
            if(cell.getStyle().includes('stencil')){
                return true;
            }
        }
    });

    var allConns = graph.getModel().filterDescendants(function(cell) {
        if((cell.vertex || cell.edge)){
            if(cell.getStyle().includes('ap=')){
                return true;
            }
        }
    });

    if(allShapes.length >0 || allConns.length>0){
        for(var i=0;i<allConns.length;i++) {
            connectorList = connectorList.push(allConns[i]);
            var namea = getNameConnector(allConns[i]);
            output = output + " <option value=\"" + namea + "\">" + namea + "</option>";
        }
        for(var i=0;i<allShapes.length;i++) {
            stencilList = stencilList.push(allShapes[i]);
            if(allShapes[i].style.search("stencil") > 0){
                var nomeOggetto = getNameStencil(allShapes[i],tempGraph);
            }
            output = output + " <option value=\""+ nomeOggetto + "\">" + nomeOggetto + "</option>";
        }
    }
    output = output + "</datalist>";
    return output;
}

function createSingleTable(nome,reference,inputstring){

    var div = document.getElementById("overlay1");

    var divbox = document.createElement("div");
    divbox.setAttribute("class","rowinline");
    var checkbox = document.createElement("input");
    checkbox.setAttribute("type","checkbox");
    checkbox.setAttribute("id","checkbox");
    if(inputstring!=null){
        checkbox.setAttribute("onchange","showTableString()");
        checkbox.setAttribute("checked","");
        showTableString(inputstring);
    }else{
        checkbox.setAttribute("onchange","showTableString()");
    }
    divbox.appendChild(checkbox);
    divbox.innerHTML= divbox.innerHTML+ "Add input string";
    divbox.setAttribute("style", "height: 30px;")
    div.appendChild(divbox);





    var tbl = document.createElement("table");
    tbl.setAttribute("class", "tabella");
    tbl.setAttribute("id", "tabella");
    //Creo riga titolo
    var tblHead = document.createElement("thead");
    var row = document.createElement("tr");
    var row1 = document.createElement("th");
    row1.setAttribute("colspan","2");
    row1.setAttribute("class","tg-l93j");
    var liststencil = getAllShapeConnectorName();
    row1.innerHTML="Name<br><input list=\"listname\" id=\"nameshape\" type=\"text\" value=\"" + nome + "\">" + liststencil;
    var row1w = document.createElement("th");
    row1w.setAttribute("colspan","3");
    row1w.setAttribute("class","tg-l93j");
    if(reference != null){
        row1w.innerHTML="Rerefence<br><input id=\"reference\" type=\"text\" value=\"" + reference + "\">";
    }else{
        row1w.innerHTML="Rerefence<br><input id=\"reference\" type=\"text\" value=\"" + nome + "\">";
    }
    //Fine crea riga titolo
    var tblBody = document.createElement("tbody");
    tblBody.setAttribute("class", "bodytable");
    var row2 = document.createElement("tr");
    var row3 = document.createElement("td");
    row3.setAttribute("class","tg-0pky");
    row3.setAttribute("colspan","5");
    var print = getPrintXML();
    if(print != null){
        row3.innerHTML="<textarea  type=\"text\" placeholder=\"print\" class=\"print\">" + print + "</textarea>";
    }else{
        row3.innerHTML="<textarea   class='print'>print();</textarea>";
    }


    var rowproperty =document.createElement("tr");
    var rowproperty1 =document.createElement("td");
    rowproperty1.setAttribute("class","tg-0pky");
    rowproperty1.innerHTML="<b>Property</b>";
    var rowproperty2 =rowproperty1.cloneNode(true);
    rowproperty2.innerHTML="<b>Procedure</b>";
    var rowproperty3 =rowproperty1.cloneNode(true);
    rowproperty3.innerHTML="<b>Params</b>";
    rowproperty3.setAttribute("colspan",2);
    var rowproperty4 =rowproperty1.cloneNode(true);
    rowproperty4.innerHTML="<b>Post-condition</b>";
    rowproperty.appendChild(rowproperty1);
    rowproperty.appendChild(rowproperty2);
    rowproperty.appendChild(rowproperty3);
    rowproperty.appendChild(rowproperty4);

    var row4 = document.createElement("tr");
    var row5 = document.createElement("td");
    row5.setAttribute("colspan","5");
    var confirmButton = document.createElement("p");
    confirmButton.setAttribute("class","plusbutton");
    confirmButton.setAttribute("onclick","createRow()");
    confirmButton.innerHTML="+"

    row5.appendChild(confirmButton);
    row4.appendChild(row5);

    row2.appendChild(row3);
    row.appendChild(row1);
    row.appendChild(row1w);
    tblBody.appendChild(rowproperty);
    tblBody.appendChild(row4);
    tblBody.appendChild(row2);
    tblHead.appendChild(row);
    tbl.appendChild(tblHead);
    tbl.appendChild(tblBody);
    div.appendChild(tbl);
    rowcount =2;
    var tabelladati = getSemanticTableXML();
    if(tabelladati != null){
        for(var i=0;i<tabelladati.length;i++){
            createRow(tabelladati[i]["property"],tabelladati[i]["type"],tabelladati[i]["procedure"],tabelladati[i]["params"],tabelladati[i]["params2"],tabelladati[i]["postcondition"]);
        }
    }
}

function createRow(property,propertyType,procedure,params,params2,postcondition){
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
    if(procedure!=null) {
        row6.innerHTML = "<input type=\"text\" class=\"procedure\"  list=\"listObj\" value='"+ procedure +"'>" + s;
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

    var row8 = row5.cloneNode(true);
    var datalistrow5 =
        "    <datalist id=\"paramlist\">\n" +
        "        <option value=\"#id\">#id</option>\n" +
        "        <option value=\"#name\">#name</option>\n" +
        "        <option value=\"#isSymbol\">#isSymbol</option>\n" +
        "        <option value=\"#attType\">#attType</option>\n" +
        "        <option value=\"#attConName\">#attConName</option>\n" +
        "        <option value=\"#visited\">#visited</option>\n" +
        "        <option value=\"#status\">#status</option>\n" +
        "    </datalist>";
    if(params2 != null){
        row8.innerHTML="<input placeholder='optional' type=\"text\" class=\"params2\" list=\"paramlist\" value='"+ params2 +"'>" + datalistrow5;
    }else{
        row8.innerHTML="<input placeholder='optional' type=\"text\" class=\"params2\" list=\"paramlist\">"+ datalistrow5;
    }
    row4.appendChild(row8);

    var row9 = row5.cloneNode(true);
    if(postcondition != null){
        row9.innerHTML="<input placeholder='optional' type=\"text\" class=\"postcondition\" value='"+ postcondition +"'>";
    }else{
        row9.innerHTML="<input placeholder='optional' type=\"text\" class=\"postcondition\">";
    }
    row4.appendChild(row9);



    var row10 = document.createElement("td");
    row10.innerHTML = "<button class=\"btn\" onclick='removeRow(" + rowcount++ +")'><i class=\"fa fa-trash\"></i></button>"
    row4.appendChild(row10);
    a.insertBefore(row4.cloneNode(true), a.children[a.children.length-2]);
}

function createConfirmButton(){
    var div = document.getElementById("overlay1");
    var confirmButton = document.createElement("p");
    confirmButton.setAttribute("class","pop-x");
    confirmButton.setAttribute("id","confirmbutton");
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
        var params2 = document.getElementsByClassName("params2")[i].value;
        var postcondition = document.getElementsByClassName("postcondition")[i].value;
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
                params: params,
                params2: params2,
                postcondition: postcondition
            };
            array.push(data);
        }
    }
    if(checkInput(document.getElementsByClassName("print")[0].value,array)){
        saveSemanticTableXML(array);
        savePrint();
        saveReference();
        saveInputString();
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
    /*
    if(stencilList != null || connectorList != null){
        for(var i=0;i<stencilList.length;i++){
            for(var k=0;k<array.length;k++){
                if(array[k]["reference"] == getNameStencil(stencilList[i],tempGraph)){
                    mxUtils.alert("The reference value entered is already present in another stencil or connector")
                    return false;
                }
            }
        }
        for(var i=0;i<connectorList.length;i++){
            for(var k=0;k<array.length;k++){
                if(array[k]["reference"] == getNameConnector(connectorList[i],tempGraph)){
                    mxUtils.alert("The reference value entered is already present in another stencil or connector")
                    return false;
                }
            }
        }

    }*/


    if(find == tot){
        return true;
    }else{
        return false;
    }

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



