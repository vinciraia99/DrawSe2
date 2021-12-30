var tempGraph;
var stencilList;
var connectorList;
let globalGraph;
//TODO Creare un tasto X per uscire senza salvare

function showTable(graph) {
    tempGraph = graph;
        if(graph.editorMode == "Shape Editor Mode"){
            if(graph.getSelectionCell().connectable != null){
                var fix = true;
                if(graph.getSelectionCell().children != null){
                    for(var i=0;i<tempGraph.getSelectionCell().children.length;i++){
                        if(tempGraph.getSelectionCell().children[0].style.includes("stencil(") || tempGraph.getSelectionCell().children[0].style.includes("ap=(")){
                            tempGraph.setSelectionCell(tempGraph.getSelectionCell().children[i]);
                            fix = false;
                            break;
                        }
                    }
                }
                if(fix && (tempGraph.getSelectionCell().connectable == false || tempGraph.getSelectionCell().connectable == "0")){
                    mxUtils.alert("You have selected an attach point and not the stencil / connector");
                    tempGraph = null;
                    return;
                }
            }
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
                var checkboxString = getInputString()
                var figurename = getGeneric(tempGraph.getSelectionCell(),"figurename");
                if(reference != null && checkboxString!= null){
                    if(figurename!= null){
                        createSingleTable(nomeOggetto,reference,checkboxString,figurename);
                    }else{
                        createSingleTable(nomeOggetto,reference,checkboxString);
                    }

                }else if(reference != null){
                    if(figurename!= null){
                        createSingleTable(nomeOggetto,reference,null,figurename);
                    }else{
                        createSingleTable(nomeOggetto,reference);
                    }

                }
                else{
                    createSingleTable(nomeOggetto);
                }
                createConfirmButton();
                document.getElementById("overlay").style.display = "flex";
            }
        }else{
            mxUtils.alert("You can use this function only in Shape Mode");
        }
}

function getNameConnector(element){
    if(!element.getStyle().includes("name=")){
        var id = element.id
        var name = "EDGE_" + id;
        var style = element.getStyle() +"name="+ name +";";
        element.setStyle(style);
    }
    else{
        var edge = element;
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
    var name =  document.getElementById("nameshape").value;
    if(checkNameIsNotUsed(name)){
        if(saveDataTable()){
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
    }else{
        mxUtils.alert("The name you used has already been used for another stencil or connector");
        return;
    }

}

function hideTableWithoutSaving(){
    var div = document.getElementById("overlay1");
    div.innerHTML ="";
    document.getElementById("overlay").style.display = "none";
    tempGraph=null;
}

function savePrint(){
    var x =document.getElementsByClassName("print")[0].value;
    savePrintXML(x);
}

function saveReference(){
    var x =document.getElementById("nameshape").value
    saveReferenceXML(x);
}

function saveInputString(){
    var x =document.getElementById("inputstring");
    var x2 =document.getElementById("inputstringtype")
    if(x != null && x.value != "" && x2 != null && x2.value != ""){
        saveInputStringXML(x.value,x2.value);
    }else{
        saveInputStringXML(null);
    }
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
    cell.setStyle('shape=stencil(' + xmlBase64 + ');');
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
        if(allConns.length>0){
            for(var i=0;i<allConns.length;i++) {
                connectorList.push(allConns[i]);
                var namea = getNameConnector(allConns[i]);
                output = output + " <option value=\"" + namea + "\">" + namea + "</option>";
            }
        }
        if(allShapes.length>0){
            for(var i=0;i<allShapes.length;i++) {
                stencilList.push(allShapes[i]);
                if(allShapes[i].style.search("stencil") > 0){
                    var nomeOggetto = getNameStencil(allShapes[i],tempGraph);
                }
                output = output + " <option value=\""+ nomeOggetto + "\">" + nomeOggetto + "</option>";
            }
        }
    }
    output = output + "</datalist>";
    return output;
}

function createSingleTable(nome,reference,inputstring,figurename){
    var checkedbool = false;
    var div = document.getElementById("overlay1");

    var divbox = document.createElement("div");
    divbox.setAttribute("class","rowinline");
    var checkbox = document.createElement("input");
    checkbox.setAttribute("type","checkbox");
    checkbox.setAttribute("id","checkbox");
    if(inputstring!=null){
        checkbox.setAttribute("onchange","showTableString()");
        checkbox.setAttribute("checked","");
        checkedbool = true;
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
    row1.setAttribute("class","tg-l93j");
    row1.innerHTML="UniqueName<br><input onchange='changeReferenceValue(this)' id=\"nameshape\" type=\"text\" value=\"" + nome + "\">" ;
    var row1w2 = document.createElement("th");
    row1w2.setAttribute("class","tg-l93j");
    if(figurename != null){
        row1w2.innerHTML="StencilName<br><input id=\"figurename\" list=\"figurenamelist\" type=\"text\" value=\"" + figurename + "\">" + getListOfFigureName();
    }else{
        row1w2.innerHTML="StencilName<br><input id=\"figurename\" list=\"figurenamelist\" type=\"text\" value=\"" + nome + "\">" + getListOfFigureName();
    }
    var row1w = document.createElement("th");
    row1w.setAttribute("class","tg-l93j");
    row1w.innerHTML="Rerefence<br><input disabled id=\"reference\" type=\"text\" value=\"" + nome + "\">";
    //Fine crea riga titolo
    var tblBody = document.createElement("tbody");
    tblBody.setAttribute("class", "bodytable");
    var row2 = document.createElement("tr");
    var row3 = document.createElement("td");
    row3.setAttribute("class","tg-0pky");
    row3.setAttribute("colspan","3");
    var print = getPrintXML();
    if(print != null){
        row3.innerHTML="<textarea  type=\"text\" placeholder=\"print param (optional)\" class=\"print\">" + print + "</textarea>";
    }else{
        row3.innerHTML="<textarea placeholder=\"print param(optional)\"  class='print'></textarea>";
    }
    var printpath = getGeneric(tempGraph.getSelectionCell(),"printpath");
    if(printpath != null){
        row3.innerHTML=row3.innerHTML + "<br>";/*"<input placeholder='print path(optional)' type=\"text\" class=\"printpath\" value='"+ printpath +"'>"*/
        let input = document.createElement("input");
        input.setAttribute("type","text");
        input.setAttribute("placeholder","print path(optional)");
        input.setAttribute("class","printpath");
        input.setAttribute("value",printpath);
        row3.appendChild(input);
    }else{
        row3.innerHTML=row3.innerHTML + "<br>" + "<input placeholder='print path(optional)' type=\"text\" class=\"printpath\">";
    }


    var rowproperty =document.createElement("tr");
    var rowproperty1 =document.createElement("td");
    rowproperty1.setAttribute("class","tg-0pky");
    rowproperty1.innerHTML="<b>Property</b>";
    var rowproperty3 =rowproperty1.cloneNode(true);
    rowproperty3.innerHTML="<b>Params</b>";
    var rowproperty4 =rowproperty1.cloneNode(true);
    rowproperty4.innerHTML="<b>Post-condition</b>";
    rowproperty.appendChild(rowproperty1);
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
    row.appendChild(row1w2);
    row.appendChild(row1w);
    tblBody.appendChild(rowproperty);
    tblBody.appendChild(row4);
    tblBody.appendChild(row2);
    tblHead.appendChild(row);
    tbl.appendChild(tblHead);
    tbl.appendChild(tblBody);
    div.appendChild(tbl);
    if(checkedbool){
        showTableString(inputstring);
    }

    var tabelladati = getSemanticTableXML();
    if(tabelladati != null){
        for(let i=0;i<tabelladati.length;i++){
            createRow(tabelladati[i]["property"],tabelladati[i]["type"],tabelladati[i]["params"],tabelladati[i]["postcondition"]);
        }
    }
}

function createRow(property,propertyType,params,postcondition){
    var a = document.getElementsByClassName("bodytable")[0];
    var row4 = document.createElement("tr");
    var row5 = document.createElement("td");
    if(property!=null && propertyType!=null){
        let input = document.createElement("input");
        input.setAttribute("type","text");
        input.setAttribute("placeholder","optional");
        input.setAttribute("class","property");
        input.setAttribute("value",property);
        row5.appendChild(input);
        row5.innerHTML = row5.innerHTML + " <b>:</b> ";
        let input2 = document.createElement("input");
        input2.setAttribute("type","text");
        input2.setAttribute("placeholder","type (optional)");
        input2.setAttribute("class","type");
        input2.setAttribute("value",propertyType);
        input2.setAttribute("list","typelist");
        row5.appendChild(input2);
    }else if(property!=null){
        let input = document.createElement("input");
        input.setAttribute("type","text");
        input.setAttribute("placeholder","optional");
        input.setAttribute("class","property");
        input.setAttribute("value",property);
        row5.appendChild(input);
        row5.innerHTML = row5.innerHTML + " <b>:</b> " +"<input placeholder='type (optional)' type=\"text\" class=\"type\" placeholder='value type' list=\"typelist\">";
    }else{
        row5.innerHTML="<input type=\"text\" placeholder='optional'  placeholder='$value' class=\"property\">"+ " <b>:</b> " +"<input placeholder='type (optional)' type=\"text\" class=\"type\" placeholder='value type' list=\"typelist\">";
    }
    row4.appendChild(row5);
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


    let row6 = document.createElement("td");
    if(params!=null){
        for(let i=0;i<params.length;i++){
            createProcedureRow(row6,params[i],i);
        }
    }
    let confirmButton = document.createElement("p");
    confirmButton.setAttribute("class", "plusbutton");
    confirmButton.setAttribute("onclick", "createProcedureRow(null,null,this)");
    confirmButton.innerHTML = "+"
    row6.appendChild(confirmButton);
    row4.appendChild(row6);


    var row9 = row5.cloneNode(true);
    if(postcondition != null){
        row9.innerHTML = "";
        let input2 = document.createElement("input");
        input2.setAttribute("type","text");
        input2.setAttribute("placeholder","optional");
        input2.setAttribute("class","postcondition");
        input2.setAttribute("value",postcondition);
        row9.appendChild(input2);
    }else{
        row9.innerHTML="<input placeholder='optional' type=\"text\" class=\"postcondition\">";
    }
    row4.appendChild(row9);


    var row10 = document.createElement("td");
    row10.innerHTML = "<button class=\"btn\" onclick='removeRow(this)'><i class=\"fa fa-trash\"></i></button>"
    row4.appendChild(row10);
    a.insertBefore(row4.cloneNode(true), a.children[a.children.length-2]);
}

function createProcedureRow(t,paramselement,element){
    if (element!=null){
        for(let k=0;k<document.getElementsByTagName("td").length;k++){
            if(document.getElementsByTagName("td")[k].getElementsByClassName("plusbutton")[0] != null && document.getElementsByTagName("td")[k].getElementsByClassName("plusbutton")[0] == element){
                t = document.getElementsByTagName("td")[k];
                break;
            }
        }
    }

    var tablee = t.getElementsByClassName("tableparams")[0];
    if(tablee == null){
        var tablee = document.createElement("table");
        tablee.setAttribute("class","tableparams");
        var s =
            "    <datalist id=\"listObj\">\n" +
            "        <option value=\"assign\">assign</option>\n" +
            "        <option value=\"add\">add</option>\n" +
            "        <option value=\"addAll\">addAll</option>\n" +
            "        <option value=\"size\">size</option>\n" +
            "        <option value=\"exist\">exist</option>\n" +
            "    </datalist>"
        tablee.innerHTML = s;
        let tr  = document.createElement("tr");
        let td11 = document.createElement("td");
        td11.innerHTML = "Procedure";
        let td12 = document.createElement("td");
        td12.setAttribute("colspan","2");
        td12.innerHTML = "Params";
        tr.appendChild(td11);
        tr.appendChild(td12);
        tablee.appendChild(tr);
    }

    let tr  = document.createElement("tr");
    let td = document.createElement("td");
    td.setAttribute("style","border-color:transparent");
    if(paramselement!=null) {
        let input2 = document.createElement("input");
        input2.setAttribute("type","text");
        input2.setAttribute("placeholder","name");
        input2.setAttribute("class","procedure");
        input2.setAttribute("value",paramselement["procedure"]);
        input2.setAttribute("list","listObj");
        td.appendChild(input2);
    }else{
        td.innerHTML = "<input placeholder='name' type=\"text\" class=\"procedure\" list=\"listObj\">";
    }
    tr.appendChild(td);

    let td2 = td.cloneNode(true);
    if(paramselement!=null) {
        td2.innerHTML = "";
        let input2 = document.createElement("input");
        input2.setAttribute("type","text");
        input2.setAttribute("placeholder","path");
        input2.setAttribute("class","params");
        input2.setAttribute("value",paramselement["param"]);
        td2.appendChild(input2);
    }else{
        td2.innerHTML="<input placeholder='path' type=\"text\" class=\"params\">";
    }
    tr.appendChild(td2);

    let td3 = td.cloneNode(true);
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
    if(paramselement != null){
        td3.innerHTML = "";
        let input2 = document.createElement("input");
        input2.setAttribute("type","text");
        input2.setAttribute("placeholder","param(optional)");
        input2.setAttribute("class","params2");
        input2.setAttribute("value",paramselement["param2"]);
        input2.setAttribute("list","paramlist");
        td3.appendChild(input2);
    }else{
        td3.innerHTML="<input placeholder='param(optional)' type=\"text\" class=\"params2\" list=\"paramlist\">"+ datalistrow5;
    }
    tr.appendChild(td3);

    let td4 = td.cloneNode(true);
    td4.innerHTML = "<button class=\"btn\" onclick='removeParamsRow(this)'><i class=\"fa fa-trash\"></i></button>"
    tr.appendChild(td4);

    if(t.getElementsByClassName("tableparams")[0] != null){
        tablee.appendChild(tr);
    }else{
        tablee.appendChild(tr);
        t.insertBefore(tablee,t.getElementsByClassName("plusbutton")[0]);
    }
}

function createConfirmButton(){
    let div = document.getElementById("overlay1");

    let divd = document.createElement("div");
    divd.setAttribute("class","rowinline");
    //WIP - Da finre
    let confirmButton = document.createElement("p");
    confirmButton.setAttribute("class","pop-x");
    confirmButton.setAttribute("id","confirmbutton");
    confirmButton.setAttribute("onclick","hideTable()");
    confirmButton.innerHTML="Save"

    let exitWithoutSaving = document.createElement("p");
    exitWithoutSaving.setAttribute("class","buttonnosave");
    exitWithoutSaving.setAttribute("id","buttonnosave");
    exitWithoutSaving.setAttribute("onclick","hideTableWithoutSaving()");
    exitWithoutSaving.innerHTML="Exit Without Saving"

    let removeSemanticRules = document.createElement("p");
    removeSemanticRules.setAttribute("class","buttonremove");
    removeSemanticRules.setAttribute("id","buttonremove");
    removeSemanticRules.setAttribute("onclick","hideTableRemoveReference()");
    removeSemanticRules.innerHTML="Remove reference from this object"

    divd.appendChild(removeSemanticRules);
    divd.innerHTML = divd.innerHTML + "&nbsp;";

    divd.appendChild(exitWithoutSaving);
    divd.innerHTML = divd.innerHTML + "&nbsp;";

    divd.appendChild(confirmButton);
    div.appendChild(divd);
    //div.appendChild(confirmButton);
}

function hideTableRemoveReference(){
    alert("wip");
    var div = document.getElementById("overlay1");
    div.innerHTML ="";
    document.getElementById("overlay").style.display = "none";
    tempGraph=null;
}



function saveDataTable(){
    let array = new Array();
    for(let i=0;i<document.getElementsByClassName("property").length;i++){
        let property = document.getElementsByClassName("property")[i].value;
        let type = document.getElementsByClassName("type")[i].value;
        let postcondition = document.getElementsByClassName("postcondition")[i].value;
        let params = getPropertyData(document.getElementsByClassName("property")[i].parentNode.parentNode.parentNode);
        if((params!= null && params == false) || params== null){
            if(params!= null && params == false){
                    mxUtils.alert("A field of a row is empty if you do not want to load a row leave all fields empty");
            }else if(params== null){
                    mxUtils.alert("Define at least one params for each property");
            }
            return false;
        }
        let data ={
            property: property,
            type: type,
            postcondition: postcondition,
            params: params
        };
        array.push(data);
    }
    if(checkInput(document.getElementsByClassName("print")[0].value,array)){
        if(document.getElementsByClassName("print")[0].value == "" && array.length ==0 && getPrintXML() == null){
            if(saveFigureName(document.getElementById("figurename").value) == false){
                return false;
            }
            saveReference();
            return true;
        }
        if(saveFigureName(document.getElementById("figurename").value) == false){
            return false;
        }
        saveSemanticTableXML(array);
        savePrint();
        saveReference();
        saveInputString();
        saveGenericValue(tempGraph.getSelectionCell(),document.getElementsByClassName("printpath")[0].value,"printpath");
        return true;
    }else{
        mxUtils.alert("The properties you invoked have not been defined. I have created the field for you to fill in to be able to continue");
        removeWhiteLine();
        return false;
    }

}

function getListOfFigureName() {
    let ar = new Array();
    var foreground = getGeneric(tempGraph.getSelectionCell(), "foreground");
    let allShapes = tempGraph.getModel().filterDescendants(function (cell) {
        if ((cell.vertex || cell.edge)) {
            if (cell.getStyle().includes('stencil')) {
                return true;
            }
        }
    });

    //Ricavo tutti gli archi orientati per i quali è definito un attack type
    let allConns = tempGraph.getModel().filterDescendants(function (cell) {
        if ((cell.vertex || cell.edge)) {
            if (cell.getStyle().includes('ap=')) {
                return true;
            }
        }
    });

    if (allShapes.length > 0 || allConns.length > 0) {
        if(foreground != null){
            for (let i = 0; i < allShapes.length; i++) {
                let figurename = getGeneric(allShapes[i], "figurename");
                if(foreground == getGeneric(allShapes[i], "foreground") && figurename != null){
                    ar.push(figurename);
                }

            }
        }else{
            for (var i = 0; i < allConns.length; i++) {
                let figurename = getGeneric(allConns[i], "figurename");
                if(getGeneric(tempGraph.getSelectionCell(), "endArrow") == getGeneric(allConns[i], "endArrow") && figurename != null){
                    ar.push(figurename);
                }
            }
        }
    }

    var datalist = " <datalist id=\"figurenamelist\">"
    for(let i=0;i<ar.length;i++){
        datalist = datalist + "<option value=\"" + ar[i] + "\">" + ar[i] + "</option>";

    }
    datalist = datalist + "</datalist>";
    return datalist;

}

function getPropertyData(element){
    let array = new Array();
    if(element.getElementsByClassName("procedure").length>0){
        for(let i=0;i<element.getElementsByClassName("procedure").length;i++){
            element.getElementsByClassName("procedure")[i].style.background  ="white"
            element.getElementsByClassName("procedure")[i].style.color = "black"
            element.getElementsByClassName("params")[i].style.background  ="white"
            element.getElementsByClassName("params")[i].style.color = "black"
            let procedure = element.getElementsByClassName("procedure")[i].value;
            let params = element.getElementsByClassName("params")[i].value;
            let params2 = element.getElementsByClassName("params2")[i].value;
            if(procedure != ""/*&& params != ""*/){
                let data ={
                    procedure: procedure,
                    param: params,
                    param2: params2
                };
                array.push(data);
            }else /*if(procedure != "" || params != "")*/{
                element.getElementsByClassName("procedure")[i].style.background  ="red"
                element.getElementsByClassName("procedure")[i].style.color = "white"
                element.getElementsByClassName("params")[i].style.background  ="red"
                element.getElementsByClassName("params")[i].style.color = "white"
                return false;
            }/*else{
                return null;
            }*/
        }
        return array;
    }else{
        return null;
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
        var property = document.getElementsByClassName("property")[i].value;
        var type = document.getElementsByClassName("type")[i].value;
        document.getElementsByClassName("type")[i].style.background  ="white"
        document.getElementsByClassName("type")[i].style.color = "black"
        document.getElementsByClassName("property")[i].style.background  ="white"
        document.getElementsByClassName("property")[i].style.color = "black"
        if(property == "" && type == "" && getPropertyData(document.getElementsByClassName("property")[i].parentNode.parentNode.parentNode) == null){
            removeRow(document.getElementsByClassName("property")[i].parentNode.parentNode.parentNode);
            i--;
        }
    }

}

function checkNameIsNotUsed(name){
    let allShapes = tempGraph.getModel().filterDescendants(function (cell) {
        if ((cell.vertex || cell.edge)) {
            if (cell.getStyle().includes('stencil')) {
                return true;
            }
        }
    });

    //Ricavo tutti gli archi orientati per i quali è definito un attack type
    let allConns = tempGraph.getModel().filterDescendants(function (cell) {
        if ((cell.vertex || cell.edge)) {
            if (cell.getStyle().includes('ap=')) {
                return true;
            }
        }
    });

    let elements = allShapes.concat(allConns);
    let nomeOggetto;
    for(let i=0;i<elements.length;i++){
        if(elements[i] != tempGraph.getSelectionCell()){
            let stencil = elements[i].getStyle();
            let base64 = stencil.substring(14, stencil.length-2);
            if(elements[i].style.search("stencil") > 0){
                nomeOggetto = mxUtils.parseXml(tempGraph.decompress(base64)).documentElement.getAttribute('name');
            }else if(elements[i].style.search("endArrow")!= -1){
                nomeOggetto= getNameConnector(elements[i]);
            }
            if(nomeOggetto == name){
                return false;
            }
        }
    }
    return true;

}



