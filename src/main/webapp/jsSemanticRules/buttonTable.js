function setOrderUpBex(i){
    if(i!=0){
        var j=i-1;
        var tableold =  document.getElementsByTagName("tbody")[0].getElementsByClassName("trmain")[i];
        var tablenew = document.getElementsByTagName("tbody")[0].getElementsByClassName("trmain")[j];
        tableold.getElementsByClassName("btnup")[0].setAttribute("onclick","setOrderUpBex("+ j +")");
        tableold.getElementsByClassName("btndown")[0].setAttribute("onclick","setOrderDownBex("+ j +")");
        tablenew.getElementsByClassName("btnup")[0].setAttribute("onclick","setOrderUpBex("+ i +")");
        tablenew.getElementsByClassName("btndown")[0].setAttribute("onclick","setOrderDownBex("+ i +")");

        tablenew.getElementsByClassName("plusbutton")[0].setAttribute("onclick","createPathRow(this,"+ i +")");
        tableold.getElementsByClassName("plusbutton")[0].setAttribute("onclick","createPathRow(this,"+ j +")");

        var deleteButton = tableold.getElementsByClassName("btn");
        if(deleteButton.length>0) {
            for(var k=0;k<deleteButton.length;k++){
                deleteButton[k].setAttribute("onclick","removePath("+ j +",this)");
            }
        }
        var deleteButton = tablenew.getElementsByClassName("btn");
        if(deleteButton.length>0) {
            for(var k=0;k<deleteButton.length;k++){
                deleteButton[k].setAttribute("onclick","removePath("+ i +",this)");
            }
        }

        document.getElementsByTagName("tbody")[0].insertBefore(tableold,tablenew);
        arraymove(elementOrderedFigureList,i,j);

    }

}

function setOrderDownBex(i){
    if((indexprioritytable-1) !=i){
        var j=i+1;
        var tableold =  document.getElementsByTagName("tbody")[0].getElementsByClassName("trmain")[i];
        var tablenew = document.getElementsByTagName("tbody")[0].getElementsByClassName("trmain")[j];

        tableold.getElementsByClassName("btnup")[0].setAttribute("onclick","setOrderUpBex("+ j +")");
        tableold.getElementsByClassName("btndown")[0].setAttribute("onclick","setOrderDownBex("+ j +")");
        tablenew.getElementsByClassName("btnup")[0].setAttribute("onclick","setOrderUpBex("+ i +")");
        tablenew.getElementsByClassName("btndown")[0].setAttribute("onclick","setOrderDownBex("+ i +")");

        tablenew.getElementsByClassName("plusbutton")[0].setAttribute("onclick","createPathRow(this,"+ i +")");
        tableold.getElementsByClassName("plusbutton")[0].setAttribute("onclick","createPathRow(this,"+ j +")");

        var deleteButton = tableold.getElementsByClassName("btn");
        if(deleteButton.length>0) {
            for (var k = 0; k < deleteButton.length; k++) {
                deleteButton[k].setAttribute("onclick", "removePath(" + j + ",this)");
            }
        }
        var deleteButton = tablenew.getElementsByClassName("btn");
        if(deleteButton.length>0) {
            for(var k=0;k<deleteButton.length;k++){
                deleteButton[k].setAttribute("onclick","removePath("+ i +",this)");
            }
        }

        document.getElementsByTagName("tbody")[0].insertBefore(tablenew,tableold);
        arraymove(elementOrderedFigureList,i,j);
    }

}

function removeRow(i){
    document.getElementsByTagName('tr')[i].remove();
    rowcount--;
    for(var y=i-2;y<rowcount-2;y++){
        var sum = parseInt(y)+2;
        document.getElementsByClassName("btn")[y].setAttribute("onclick", 'removeRow(' + sum +')');
    }
}

function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

function showTableString(name){
    if(document.getElementById("checkbox").checked){
        var tbl = document.createElement("table");
        tbl.setAttribute("class", "tabella");
        tbl.setAttribute("id", "stringtable");
        //Creo riga titolo
        var tblHead = document.createElement("thead");
        var row = document.createElement("tr");
        var row1 = document.createElement("th");
        row1.setAttribute("colspan","3");
        row1.setAttribute("class","tg-l93j");
        row1.innerHTML="Define input string";
        row.appendChild(row1);
        tblHead.appendChild(row);

        var tblBody = document.createElement("tbody");
        var row2 = document.createElement("tr");
        var row3 = document.createElement("td");
        row3.setAttribute("class","tg-0pky");
        row3.innerHTML= "graphicRef"
        var row4 = row3.cloneNode(true);
        row4.innerHTML= "name";
        var row5 = row3.cloneNode(true);
        row5.innerHTML= "type";
        row2.appendChild(row3);
        row2.appendChild(row4);
        row2.appendChild(row5);
        tblBody.appendChild(row2);

        var row2 = document.createElement("tr");
        var row3 = document.createElement("td");
        row3.setAttribute("class","tg-0pky");
        row3.innerHTML= "<input type=\"text\" class=\"graphicRef\" value=\"Center\" disabled>"
        var row4 = row3.cloneNode(true);
        if(name != null){
            row4.innerHTML="<input id='inputstring' type=\"text\" class=\"name\" value='"+ name +"'>"
        }else{
            row4.innerHTML= "<input id='inputstring' type=\"text\" class=\"name\">"
        }

        var row5 = row3.cloneNode(true);
        row5.innerHTML= "<input type=\"text\" class=\"type\" value=\"string\" disabled>"
        row2.appendChild(row3);
        row2.appendChild(row4);
        row2.appendChild(row5);
        tblBody.appendChild(row2);

        tbl.appendChild(tblHead);
        tbl.appendChild(tblBody);

        var br = document.createElement("br");
        br.setAttribute("id","blankspace");

        var br2 = document.createElement("br");
        br2.setAttribute("id","blankspace2");


        var div = document.getElementById("overlay1");


        div.insertBefore(br,document.getElementById("confirmbutton"));
        div.insertBefore(tbl,document.getElementById("blankspace"));
        div.insertBefore(br2,document.getElementById("stringtable"));

    }else{
        document.getElementById("stringtable").remove();
        document.getElementById("blankspace").remove();
        document.getElementById("blankspace2").remove();
    }

}

function createPathRow(th,index){
    for(var k=0;k<document.getElementsByTagName("td").length;k++){
        if(document.getElementsByTagName("td")[k].getElementsByClassName("plusbutton")[0] != null && document.getElementsByTagName("td")[k].getElementsByClassName("plusbutton")[0] == th){
            var t = document.getElementsByTagName("td")[k];
            break;
        }
    }
    var table = document.getElementsByClassName("tablepath")[index];
    if(table == null){
        var tablee = document.createElement("table");
        tablee.setAttribute("class","tablepath");
    }
    var tr  = document.createElement("tr");
    var td = document.createElement("td");
    td.setAttribute("style","border-color:transparent");
    td.innerHTML = "<select name=\"patht\" class=\"patht\"><option value=\"D\" >D</option><option value=\"A\">A</option> </select>";
    var td2 = td.cloneNode(true);
    td2.innerHTML = "<input type=\"text\" class=\"path\">" + "<br>";
    tr.appendChild(td);
    var row10 = td.cloneNode(true);
    tr.appendChild(td2);
    tr.appendChild(row10);
    if(table != null){
        table.appendChild(tr);
    }else{
        tablee.appendChild(tr);
        t.insertBefore(tablee,t.getElementsByClassName("plusbutton")[0]);
    }
    row10.innerHTML = "<button class=\"btn\" onclick='removePath(" + index.toString() + ", this)'><i class=\"fa fa-trash\"></i></button>"
}

function removePath(index,obj){
    for(var i=0;i<document.getElementsByClassName("tablepath")[index].getElementsByTagName("tr").length;i++){
        var t = document.getElementsByClassName("tablepath")[index].getElementsByTagName("tr")[i]
        if(t.getElementsByClassName("btn")[0] == obj){
           t.remove();
           break;
        }
    }

}
