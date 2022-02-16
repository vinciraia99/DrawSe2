function showSummaryTable(graph){
    if(graph.editorMode == "Shape Editor Mode") {
        tempGraph = graph;
        var alltable = loadAllTable(graph);
        if(alltable == null){
            mxUtils.alert("Unable to display the semantic table summary because no semantic table has been defined for any stencil and connector");
            return;
        }
        let div = document.getElementById("overlay1");
        if(document.getElementById("disablevisit").checked == false){
            div.appendChild(visitTable(alltable));
            div.innerHTML = div.innerHTML + "<br><br>";
        }
        for(let i=0;i<alltable.length;i++){
            div.appendChild(semantictable(alltable[i]["semantic"]));
            div.innerHTML = div.innerHTML + "<br><br>";
        }

        let close = document.createElement("p");
        close.setAttribute("class","buttonremove");
        close.setAttribute("id","buttonremove");
        close.setAttribute("onclick","closeSummaryTable()");
        close.innerHTML="Close"

        div.appendChild(close);

        document.getElementById("overlay").style.display = "flex";

    }else{
        mxUtils.alert("You can use this function only in Shape Mode");
    }
}

function closeSummaryTable(){
    var div = document.getElementById("overlay1");
    div.innerHTML ="";
    document.getElementById("overlay").style.display = "none";
}

function semantictable(semantic){
    var tbl = document.createElement("table");
    tbl.setAttribute("class", "tabella");
    tbl.setAttribute("id", "tabella");
    var tblHead = document.createElement("thead");
    var row = document.createElement("tr");
    var row1 = document.createElement("th");
    row1.setAttribute("class","tg-l93j");
    row1.innerHTML="UniqueName<br>"+semantic["name"];
    var row1w2 = document.createElement("th");
    row1w2.setAttribute("class","tg-l93j");
    row1w2.innerHTML="StencilName<br>"+semantic["figurename"];
    var row1w = document.createElement("th");
    row1w.setAttribute("class","tg-l93j");
    row1w.innerHTML="Rerefence<br>"+semantic["name"];

    var tblBody = document.createElement("tbody");
    tblBody.setAttribute("class", "bodytable");
    var row2 = document.createElement("tr");
    var row3 = document.createElement("td");
    row3.setAttribute("class","tg-0pky");
    row3.setAttribute("colspan","3");
    let textnode = document.createTextNode(semantic["print"]);
    row3.appendChild(textnode);
    row3.innerHTML= row3.innerHTML + "<br>";
    let textnode2 = document.createTextNode(semantic["printpath"]);
    row3.appendChild(textnode2);

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

    row2.appendChild(row3);
    row.appendChild(row1);
    row.appendChild(row1w2);
    row.appendChild(row1w);
    tblBody.appendChild(rowproperty);
    tblBody.appendChild(row2);
    tblHead.appendChild(row);

    for(let i=0;i<semantic["table"].length;i++){
        tblBody.appendChild(createRowSemanticProperty(semantic["table"][i]));
    }
    let row444 = document.createElement("tr");
    let row44 = document.createElement("td");
    row44.setAttribute("class","tg-0pky");
    row44.setAttribute("colspan","3");
    row44.innerHTML=semantic["print"] + "<br><br>" + semantic["printpath"];

    row444.appendChild(row44);
    tblBody.appendChild(row444);

    tbl.appendChild(tblHead);
    tbl.appendChild(tblBody);

    return tbl;

}

function createRowSemanticProperty(table){
    var row4 = document.createElement("tr");
    var row5 = document.createElement("td");
    row5.innerHTML = table["property"] + " <b>:</b> " + table["type"];
    row4.appendChild(row5);
    let row6 = document.createElement("td");


    var tablee = document.createElement("table");
    tablee.setAttribute("class","tableparams");
    let tr  = document.createElement("tr");
    let td11 = document.createElement("td");
    td11.innerHTML = "Procedure";
    let td12 = document.createElement("td");
    td12.setAttribute("colspan","2");
    td12.innerHTML = "Params";
    tr.appendChild(td11);
    tr.appendChild(td12);
    tablee.appendChild(tr);

    for(let i=0;i<table["params"].length;i++){
        let trs  = document.createElement("tr");
        let tds = document.createElement("td");
        tds.setAttribute("style","border-color:transparent");
        let textnode = document.createTextNode(table["params"][i]["procedure"]);
        tds.appendChild(textnode);
        trs.appendChild(tds);

        let td2s = tds.cloneNode(true);
        let textnode2 = document.createTextNode(table["params"][i]["param"]);
        td2s.appendChild(textnode2);
        trs.appendChild(td2s);

        let td3s = tds.cloneNode(true);
        td3s.innerHTML = table["params"][i]["param2"];
        trs.appendChild(td3s);
        tablee.appendChild(trs);
    }
    row6.appendChild(tablee);
    row4.appendChild(row6);

    var row9 =document.createElement("td");
    row9.innerHTML = table["postcondition"];
    row4.appendChild(row9);

    return row4;
}

function visitTable(alltable){
    var tbl = document.createElement("table");
    tbl.setAttribute("class", "tabella");
    tbl.setAttribute("id", "tabella");
    //Creo riga titolo
    var tblHead = document.createElement("thead");
    var row = document.createElement("tr");
    var row1 = document.createElement("th");
    row1.setAttribute("colspan", "4");
    row1.setAttribute("class", "tg-l93j");
    row1.innerHTML = "Visit Table";


    let tblBody = document.createElement("tbody");
    tblBody.setAttribute("class", "bodytable");
    let row2 = document.createElement("tr");
    let row3 = document.createElement("td");
    row3.setAttribute("class", "tg-0pky");
    row3.innerHTML = "Order";
    let row4 = row3.cloneNode(true);
    row4.innerHTML = "Priority";
    let row6 = row3.cloneNode(true);
    row6.innerHTML = "Paths";
    let row31 = row3.cloneNode(true);
    row31.innerHTML = "Name";

    row2.appendChild(row31);
    row2.appendChild(row3);
    row2.appendChild(row4);
    row2.appendChild(row6);
    tblBody.appendChild(row2);
    row.appendChild(row1);
    tblHead.appendChild(row);

    for(let i=0;i<alltable.length;i++){
        tblBody.appendChild(createRowVisitTable(alltable[i]["semantic"]["reference"],alltable[i]["visit"]["order"],alltable[i]["visit"]["path"],alltable[i]["visit"]["priority"]));
    }

    tbl.appendChild(tblHead);
    tbl.appendChild(tblBody);



    return tbl;

}

function createRowVisitTable(reference,order,patharray,priority){
    let row2 = document.createElement("tr");
    let row3 = document.createElement("td");
    let t1 = document.createTextNode(reference);
    let t2 = document.createTextNode(order);
    let t4 = document.createTextNode(priority);
    row3.setAttribute("class", "tg-0pky");
    row3.appendChild(t2);
    let row4 = document.createElement("td");
    row4.setAttribute("class", "tg-0pky");
    row4.appendChild(t4);
    let row5 = document.createElement("td");
    row5.setAttribute("class", "tg-0pky");
    row5.innerHTML = "";
    let row6 = document.createElement("td");
    row6.setAttribute("class", "tg-0pky");
    row6.appendChild(t1);

    row5.appendChild(createRowPathVisitTable(patharray));

    row2.appendChild(row6);
    row2.appendChild(row3);
    row2.appendChild(row4);
    row2.appendChild(row5);

    return row2;


}

function createRowPathVisitTable(patharray){
    var tablee = document.createElement("table");
    tablee.setAttribute("class","tablepath");
    for(let i=0;i<patharray.length;i++){
        let tr  = document.createElement("tr");
        let td = document.createElement("td");
        td.setAttribute("style","border-color:transparent");
        let formed = " <select name=\"patht\" class=\"patht\">\n";
        if (patharray[i]["patht"] == "D") {
            formed = formed + "<option disabled value=\"D\" selected>D</option>\n" +
                "    <option disabled value=\"A\">A</option>\n" +
                "  </select>";
        } else if (patharray[i]["patht"] == "A") {
            formed = formed + "<option  disabled value=\"D\" >D</option>\n" +
                "    <option disabled value=\"A\" selected>A</option>\n" +
                "  </select>";
        }
        td.innerHTML = formed;
        tr.appendChild(td);
        let td2 = document.createElement("td");
        td2.setAttribute("style","border-color:transparent");
        let textnode4 = document.createTextNode(patharray[i]["path"]);
        td2.appendChild(textnode4);
        tr.appendChild(td2);
        tablee.appendChild(tr);
    }

    return tablee;
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
            var print = null;
            var printpath = null;
            var reference = null;
            var inputstring = null;
            var name = null;
            var tableinfo = null;
            var localcontext = null;
            var priority = null;
            var order = null;
            var path = null;
            var data = null;
            var data2 = null;
            var all = null;
            var figurename = null;
            if(k==0){
                name = getNameStencil(element[i],graph);
            }else if(k==1){
                name = getNameConnector(element[i]);
            }
            print = getGeneric(element[i],"print");
            printpath = getGeneric(element[i],"printpath");
            reference = getGeneric(element[i],"reference");
            inputstring = getGeneric(element[i],"inputstring");
            figurename = getGeneric(element[i],"figurename");
            tableinfo = getSemanticTableXML(element[i],graph);
            localcontext = getGeneric(element[i],"localcontext");
            if(checkIsSelected() == false){
                priority = getGeneric(element[i],"priority");
                order = getGeneric(element[i],"order");
                path = getPathForElementXML(getGeneric(element[i],"pathlist"));
            }
            if(name!=null && reference != null && print !=null && tableinfo != null){
                if(inputstring != null){
                    if(localcontext != null && localcontext != ""){
                        data={
                            name: name,
                            print: print,
                            printpath: printpath,
                            reference: reference,
                            inputstring: inputstring,
                            figurename:figurename,
                            table: tableinfo,
                            localcontext : localcontext
                        }
                    }else{
                        data={
                            name: name,
                            print: print,
                            printpath: printpath,
                            reference: reference,
                            figurename:figurename,
                            inputstring: inputstring,
                            table: tableinfo
                        }
                    }
                }else{
                    if(localcontext != null && localcontext != ""){
                        data={
                            name: name,
                            print: print,
                            printpath: printpath,
                            reference: reference,
                            figurename:figurename,
                            table: tableinfo,
                            localcontext : localcontext
                        }
                    }else {
                        data = {
                            name: name,
                            print: print,
                            printpath: printpath,
                            reference: reference,
                            table: tableinfo
                        }
                    }
                }

                if ((typeof priority != 'undefined' && priority != null) && (typeof order != 'undefined' && order != null) && (typeof path != 'undefined' && path != null)) {
                    data2={
                        priority : priority,
                        order :  order,
                        path : path
                    }
                }else if((typeof priority == 'undefined' || priority == null) || (typeof order == 'undefined' || order == null) || (typeof path == 'undefined' || path == null)){
                    mxUtils.alert("Define the visit table for the object " + name);
                    return null;
                }

            if((typeof data != 'undefined' && data != null) && (typeof data2 != 'undefined' && data2 != null)){
                all ={
                    semantic : data,
                    visit : data2
                }
            }else if(typeof data != 'undefined' && data != null){
                all ={
                    semantic : data,
                    visit: null
                }
            }
            if(typeof all != 'undefined' && all != null){
                array.push(all);
            }
            }
        }
    }
    if(array.length ==0){
        return null;
    }else{
        return array;
    }

}