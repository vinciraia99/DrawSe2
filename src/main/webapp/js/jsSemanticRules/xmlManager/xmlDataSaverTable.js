function semanticTableToXml(object) {
    var xml = document.createElement("tableinfo");
    for(var i=0;i<object.length;i++){
        let id = document.createElement("id" + i);
        let property = document.createElement("property");
        property.innerHTML = object[i]["property"];
        let type = document.createElement("type");
        type.innerHTML = object[i]["type"];
        if(object[i]["params"] != null){
            let params = document.createElement("params");
            for(let k=0;k<object[i]["params"].length;k++){
                let id2 = document.createElement("id" + k);
                let param = document.createElement("param");
                param.innerHTML = encodeURI(object[i]["params"][k]["param"]);
                let procedure = document.createElement("procedure");
                procedure.innerHTML =  encodeURI(object[i]["params"][k]["procedure"]);
                let param2 = document.createElement("param2");
                param2.innerHTML = encodeURI(object[i]["params"][k]["param2"]);
                id2.appendChild(param);
                id2.appendChild(procedure);
                id2.appendChild(param2);
                params.appendChild(id2);
            }
            id.appendChild(params);
        }
        var postcondition = document.createElement("postcondition");
        postcondition.innerHTML = object[i]["postcondition"];
        id.appendChild(property);
        id.appendChild(type);
        id.appendChild(postcondition);
        xml.appendChild(id);
    }
    return xml;
}

function savePrintXML(text){
    try {
        var cell = tempGraph.getSelectionCell();
        var stencil = cell.getStyle();
        var base64 = stencil.substring(14, stencil.length-2);
        var desc = tempGraph.decompress(base64);
        var shapeXml = mxUtils.parseXml(desc).documentElement;
        var print = shapeXml.getElementsByTagName("print")[0];
        if(print == null){
            var xml = document.createElement("print");
            text = text.replace("<","frecciasinistra");
            text = text.replace("<","frecciadestra");
            xml.innerHTML = text;
            shapeXml.appendChild(xml);
        }else{
            print.innerHTML = text;
        }
        var xmlBase64 = tempGraph.compress(mxUtils.getXml(shapeXml));
        cell.setStyle('shape=stencil(' + xmlBase64 + ');')
    }catch (e){
        text = text.replaceAll(";", '[puntovirgola]');
        var edge = tempGraph.getSelectionCell();
        var edgeStyle = edge.getStyle();
        var initCut = edgeStyle.indexOf("print=");
        if(initCut != -1){
            edgeStyle = removeTableInfo(edge,"print=");
        }
        edgeStyle = edgeStyle +"print="+ text + ";";
        edge.setStyle(edgeStyle);
    }

}

function getPrintXML(){
    try{
        var cell = tempGraph.getSelectionCell();
        var stencil = cell.getStyle();
        var base64 = stencil.substring(14, stencil.length-2);
        var desc = tempGraph.decompress(base64);
        var shapeXml = mxUtils.parseXml(desc).documentElement;
        var print =  shapeXml.getElementsByTagName("print")[0];
        if(print != null){
            let output = print.innerHTML;
            output = output.replace("frecciasinistra","<");
            output = output.replace("frecciadestra","<");
            return output;
        }else{
            return null;
        }
    }catch (e) {
        var edge = tempGraph.getSelectionCell();
        var edgeStyle = edge.getStyle();
        var initCut = edgeStyle.indexOf("print=");
        if(initCut != -1){
            edgeStyle = getTableInfoFromConnector(edgeStyle,"print=");
            return  edgeStyle;
        }else{
            return null;
        }
    }
}

function saveSemanticTableXML(array){
    var xml =semanticTableToXml(array);
    var xmlstring = getXmlString(xml)
    try{
        var cell = tempGraph.getSelectionCell();
        var stencil = cell.getStyle();
        var base64 = stencil.substring(14, stencil.length-2);
        var desc = tempGraph.decompress(base64);
        var shapeXml = mxUtils.parseXml(desc).documentElement;
        var tableinfo = shapeXml.getElementsByTagName("tableinfo")[0];
        if(tableinfo == null){
            shapeXml.appendChild(xml);
        }else{
            shapeXml.getElementsByTagName("tableinfo")[0].remove();
            shapeXml.appendChild(xml);
        }
        var xmlBase64 = tempGraph.compress(mxUtils.getXml(shapeXml));
        cell.setStyle('shape=stencil(' + xmlBase64 + ');')
    }catch (e){
        var edge = tempGraph.getSelectionCell();
        var edgeStyle = edge.getStyle();
        var initCut = edgeStyle.indexOf("tableinfo=");
        if(initCut != -1){
            edgeStyle = removeTableInfo(edge,"tableinfo=");
        }
        xmlstring = xmlstring.replaceAll(";", '[puntovirgola]');
        edgeStyle = edgeStyle +"tableinfo="+ xmlstring + ";";
        edge.setStyle(edgeStyle);

    }

}

function getTableInfoFromConnector(edgeStyle,keyword){
    var split = edgeStyle.split(';');
    var str = "";
    for(var i=0;i<split.length;i++){
        if(split[i].indexOf(keyword)!=-1){
            var getter =  split[i].substring(split[i].indexOf(keyword)+keyword.length, split[i].length).replaceAll("[puntovirgola]", ';');
            return  getter;
        }
    }
    return str;
}

function removeTableInfo(edge,keyword){
    var edgeStyle = edge.getStyle();
    var split = edgeStyle.split(';');
    var str = "";
    for(var i=0;i<split.length;i++){
        if(split[i].indexOf(keyword)==-1){
            str = str + split[i] + ";";
        }
    }
    return str;
}

function getSemanticTableXML(element,graph){
    if(element!= null && graph!= null){
        tempGraph = graph;
    }else {
        element = tempGraph.getSelectionCell();
    }
    try{
        let array = new Array();
        try{
            var cell = element
            var stencil = cell.getStyle();
            var base64 = stencil.substring(14, stencil.length-2);
            var desc = tempGraph.decompress(base64);
            var shapeXml = mxUtils.parseXml(desc).documentElement;
            var table =  shapeXml.getElementsByTagName("tableinfo")[0];
        }catch (e){
            var edge = element
            var edgeStyle = edge.getStyle();
            var initCut = edgeStyle.indexOf("tableinfo=");
            if(initCut != -1){
                edgeStyle = getTableInfoFromConnector(edgeStyle,"tableinfo=");
                const parser = new DOMParser();
                const doc = parser.parseFromString(edgeStyle, "application/xml");
                const errorNode = doc.querySelector("parsererror");
                if (errorNode) {
                    console.log("error while parsing tableinfo");
                    return null;
                }else{
                    var table = doc.getElementsByTagName("tableinfo")[0];;
                }
            }else{
                return null;
            }
        }

        for(let i=0;i<table.childElementCount;i++){
            let id = table.getElementsByTagName("id" + i)[0];
            let property = id.getElementsByTagName("property")[0].innerHTML;
            let type = id.getElementsByTagName("type")[0].innerHTML;
            let params = getFunctionXML(id);
            //var procedure = id.getElementsByTagName("procedure")[0].innerHTML;
            //var params = id.getElementsByTagName("params")[0].innerHTML;
            //var params2 = id.getElementsByTagName("params2")[0].innerHTML;
            let postcondition = id.getElementsByTagName("postcondition")[0].innerHTML;
            let data ={
                property: property,
                type: type,
                params : params,
                postcondition : postcondition
            };
            array.push(data);
        }
        return array;
    }catch (e){
        return null;
    }

}

function getFunctionXML(id){
    let array = new Array();
    let params = id.getElementsByTagName("params")[0];
    if(params!=null){
        for(let i=0;i<params.childElementCount;i++){
            let ids = params.getElementsByTagName("id" + i)[0];
            //TODO - Da finire
            let procedure = decodeURI(ids.getElementsByTagName("procedure")[0].innerHTML);
            let param = decodeURI(ids.getElementsByTagName("param")[0].innerHTML);
            let param2 = decodeURI(ids.getElementsByTagName("param2")[0].innerHTML);
            var data ={
                procedure: procedure,
                param: param,
                param2 : param2
            };
            array.push(data);
        }
        return array;
    }else{
        return null;
    }
}


function getXmlString(xml) {
    if (window.ActiveXObject) { return xml.xml; }
    return new XMLSerializer().serializeToString(xml);
}


function saveFigureName(text){
    let foreground = getGeneric(tempGraph.getSelectionCell(), "foreground");
    let allShapes = tempGraph.getModel().filterDescendants(function (cell) {
        if ((cell.vertex || cell.edge)) {
            if (cell.getStyle().includes('stencil')) {
                return true;
            }
        }
    });

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
                    if(compareForeground(foreground,getGeneric(allShapes[i], "foreground")) && figurename != null && figurename == text){
                        mxUtils.alert("The name of the stencil you have chosen is associated with the object called " + getNameStencil(allShapes[i],tempGraph) +  " which is an object with a different shape than the one you have chosen");
                        return false;
                    }
                }
            }else{
                for (let i = 0; i < allConns.length; i++) {
                    let figurename = getGeneric(allConns[i], "figurename");
                    if(getGeneric(tempGraph.getSelectionCell(), "endArrow") != getGeneric(allConns[i], "endArrow") && figurename != null && figurename == text){
                        mxUtils.alert("The name of the stencil you have chosen is associated with the object called " + getNameConnector(allConns[i]) +  " which is an object with a different shape than the one you have chosen");
                        return false;
                    }
                }
            }
        }

    saveGenericValue(tempGraph.getSelectionCell(),text,"figurename");
    return true;

}

function compareForeground(t1,t2){
    let t3 = t1.split(/(<| |\>)/gm);
    let t4 = t2.split(/(<| |\>)/gm);
    let max;
    if(t3.length >= t4.length){
        max = t3.length;
    }else{
        max = t4.length;
    }

    for(let i=0;i<max;i++){
        if(t3[i] != t4[i]){
            if(t3[i].indexOf("x") != -1 || t3[i].indexOf("y") != -1 || t3[i].indexOf("color") != -1){

            }else{
                return true;
            }
        }
    }

    return false;
}

function saveReferenceXML(text){
    try {
        var cell = tempGraph.getSelectionCell();
        var stencil = cell.getStyle();
        var base64 = stencil.substring(14, stencil.length-2);
        var desc = tempGraph.decompress(base64);
        var shapeXml = mxUtils.parseXml(desc).documentElement;
        var print = shapeXml.getElementsByTagName("reference")[0];
        if(print == null){
            var xml = document.createElement("reference");
            xml.innerHTML = text;
            shapeXml.appendChild(xml);
        }else{
            print.innerHTML = text;
        }
        var xmlBase64 = tempGraph.compress(mxUtils.getXml(shapeXml));
        cell.setStyle('shape=stencil(' + xmlBase64 + ');')
    }catch (e){
        text = text.replaceAll(";", '[puntovirgola]');
        var edge = tempGraph.getSelectionCell();
        var edgeStyle = edge.getStyle();
        var initCut = edgeStyle.indexOf("reference=");
        if(initCut != -1){
            edgeStyle = removeTableInfo(edge,"reference=");
        }
        edgeStyle = edgeStyle +"reference="+ text + ";";
        edge.setStyle(edgeStyle);
    }

}

function getReference(){
    try{
        var cell = tempGraph.getSelectionCell();
        var stencil = cell.getStyle();
        var base64 = stencil.substring(14, stencil.length-2);
        var desc = tempGraph.decompress(base64);
        var shapeXml = mxUtils.parseXml(desc).documentElement;
        var print =  shapeXml.getElementsByTagName("reference")[0];
        if(print != null){
            return print.innerHTML;
        }else{
            return null;
        }
    }catch (e) {
        var edge = tempGraph.getSelectionCell();
        var edgeStyle = edge.getStyle();
        var initCut = edgeStyle.indexOf("reference=");
        if(initCut != -1){
            edgeStyle = getTableInfoFromConnector(edgeStyle,"reference=");
            return  edgeStyle;
        }else{
            return null;
        }
    }
}

function getInputString(){
    var ar = new Array();
    try{
        var cell = tempGraph.getSelectionCell();
        var stencil = cell.getStyle();
        var base64 = stencil.substring(14, stencil.length-2);
        var desc = tempGraph.decompress(base64);
        var shapeXml = mxUtils.parseXml(desc).documentElement;
        var elem1 =  shapeXml.getElementsByTagName("inputstring")[0];
        var elem2 =  shapeXml.getElementsByTagName("inputstringtype")[0];
        if(elem1 != null && elem2 !=null){
            let e1 = elem1.innerHTML;
            e1 = e1.replace("frecciasinistra","<");
            e1 = e1.replace("frecciadestra","<");
            let e2 = elem2.innerHTML;
            e2 = e2.replace("frecciasinistra","<");
            e2 = e2.replace("frecciadestra","<");
            ar.push(e1);
            ar.push(e2);
            return ar;
        }else{
            return null;
        }
    }catch (e) {
        var edge = tempGraph.getSelectionCell();
        var edgeStyle = edge.getStyle();
        var initCut = edgeStyle.indexOf("inputstring=");
        var initCut2 = edgeStyle.indexOf("inputstringtype=");
        if(initCut != -1 && initCut2 != -1){
            var edgeStyle1 = getTableInfoFromConnector(edgeStyle,"inputstring=");
            var edgeStyle2 = getTableInfoFromConnector(edgeStyle,"inputstringtype=");
            edgeStyle1 = edgeStyle1.replaceAll("[puntovirgola]", ';');
            edgeStyle2 = edgeStyle2.replaceAll("[puntovirgola]", ';');
            ar.push(edgeStyle1);
            ar.push(edgeStyle2);
            return  ar;
        }else{
            return null;
        }
    }
}

function saveInputStringXML(text,type){
    try {
        var cell = tempGraph.getSelectionCell();
        var stencil = cell.getStyle();
        var base64 = stencil.substring(14, stencil.length-2);
        var desc = tempGraph.decompress(base64);
        var shapeXml = mxUtils.parseXml(desc).documentElement;
        var print = shapeXml.getElementsByTagName("inputstring")[0];
        var print2 = shapeXml.getElementsByTagName("inputstringtype")[0];
        if(text != null && type != null){
            if(print == null){
                let xml = document.createElement("inputstring");
                text = text.replace("<","frecciasinistra");
                text = text.replace("<","frecciadestra");
                xml.innerHTML = text;
                shapeXml.appendChild(xml);
            }else{
                print.innerHTML = text;
            }
            if(print2 == null){
                let xml = document.createElement("inputstringtype");
                xml.innerHTML = type;
                shapeXml.appendChild(xml);
            }else{
                print2.innerHTML = type;
            }
        }else{
            if(print != null){
                print.remove();
            }
            if(print2 != null){
                print2.remove();
            }
        }
        var xmlBase64 = tempGraph.compress(mxUtils.getXml(shapeXml));
        cell.setStyle('shape=stencil(' + xmlBase64 + ');')
    }catch (e){
        var edge = tempGraph.getSelectionCell();
        var edgeStyle = edge.getStyle();
        var initCut = edgeStyle.indexOf("inputstring=");
        var initCut2 = edgeStyle.indexOf("inputstringtype=");
        if(initCut != -1){
            edgeStyle = removeTableInfo(edge,"inputstring=");
        }
        if(initCut2 != -1){
            edgeStyle = removeTableInfo(edge,"inputstringtype=");
        }
        if(text != null){
            text = text.replaceAll(";", '[puntovirgola]');
            edgeStyle = edgeStyle +"inputstring="+ text + ";";
            edge.setStyle(edgeStyle);
        }
        if(type != null){
            type = type.replaceAll(";", '[puntovirgola]');
            edgeStyle = edgeStyle +"inputstringtype="+ type + ";";
            edge.setStyle(edgeStyle);
        }
    }
}
