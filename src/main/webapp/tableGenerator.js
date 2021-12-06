var tempGraph;
function showTable(graph) {
    tempGraph = graph;
    debugger
    //try{
        if(graph.editorMode == "Shape Editor Mode"){
            var stencil = graph.getSelectionCell().getStyle();
            var base64 = stencil.substring(14, stencil.length-2);
            try{
                var nomeOggetto = mxUtils.parseXml(graph.decompress(base64)).documentElement.getAttribute('name');
            }catch (error){
                if(!graph.getSelectionCell().getStyle().includes("name=")){
                    var id = graph.getSelectionCell().id
                    var name = "EDGE_" + id;
                    var style = graph.getSelectionCell().getStyle() +"name="+ name +";";
                    graph.getSelectionCell().setStyle(style);
                }
                else{
                    var edge = graph.getSelectionCell();
                    var edgeStyle = edge.getStyle();
                    var initCut = edgeStyle.indexOf("name=")
                    edgeStyle = edgeStyle.substring(edgeStyle.indexOf("name="), edgeStyle.length);
                    var toCut = edgeStyle.indexOf(";");
                    edgeStyle = edgeStyle.substring(5,toCut);
                    var name = edgeStyle;
                }
                nomeOggetto= name;
            }
            console.log(nomeOggetto);
        }else{
            mxUtils.alert("Puoi usare questa funzione solo in Shape Mode");
        }
        createSingleTable(nomeOggetto);
        createConfirmButton();
        document.getElementById("overlay").style.display = "flex";
    /*}catch (error){
        console.error(error);
        mxUtils.alert("Definire prima i punti dell'oggetto in Constraint Mode!");
    }*/

}

function hideTable() {
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
    var row2 = document.createElement("tr");
    var row3 = document.createElement("td");
    row3.setAttribute("class","tg-0pky");
    row3.setAttribute("colspan","3");
    row3.innerHTML="<input type=\"text\" placeholder=\"print\">";

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
    row5.setAttribute("class","tg-0pky");
    row5.innerHTML="<input type=\"text\">";
    row4.appendChild(row5);
    row4.appendChild(row5.cloneNode(true));
    row4.appendChild(row5.cloneNode(true));

    row2.appendChild(row3);
    row.appendChild(row1);
    tblBody.appendChild(rowproperty);
    tblBody.appendChild(row4);
    tblBody.appendChild(row2);
    tblHead.appendChild(row);
    tbl.appendChild(tblHead);
    tbl.appendChild(tblBody);
    div.appendChild(tbl);
}

function createConfirmButton(){
    var div = document.getElementById("overlay1");
    var confirmButton = document.createElement("p");
    confirmButton.setAttribute("class","pop-x");
    confirmButton.setAttribute("onclick","hideTable()");
    confirmButton.innerHTML="Conferma"

    div.appendChild(confirmButton);
}
