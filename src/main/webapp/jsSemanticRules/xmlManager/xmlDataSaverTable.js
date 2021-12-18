function semanticTableToXml(object) {
    var xml = document.createElement("tableinfo");
    for(var i=0;i<object.length;i++){
        var id = document.createElement("id" + i);
        var property = document.createElement("property");
        property.innerHTML = object[i]["property"];
        var type = document.createElement("type");
        type.innerHTML = object[i]["type"];
        var params = document.createElement("params");
        params.innerHTML = object[i]["params"];
        var procedure = document.createElement("procedure");
        procedure.innerHTML = object[i]["procedure"];
        var params2 = document.createElement("params2");
        params2.innerHTML = object[i]["params2"];
        var postcondition = document.createElement("postcondition");
        postcondition.innerHTML = object[i]["postcondition"];
        id.appendChild(property);
        id.appendChild(type);
        id.appendChild(params);
        id.appendChild(procedure);
        id.appendChild(params2);
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
            return print.innerHTML;
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
                    console.log("error while parsing");
                    return null;
                }else{
                    var table = doc.getElementsByTagName("tableinfo")[0];;
                }
            }else{
                return null;
            }
        }

        for(var i=0;i<table.childElementCount;i++){
            var id = table.getElementsByTagName("id" + i)[0];
            var property = id.getElementsByTagName("property")[0].innerHTML;
            var type = id.getElementsByTagName("type")[0].innerHTML;
            var procedure = id.getElementsByTagName("procedure")[0].innerHTML;
            var params = id.getElementsByTagName("params")[0].innerHTML;
            var params2 = id.getElementsByTagName("params2")[0].innerHTML;
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
        return null;
    }

}

function getXmlString(xml) {
    if (window.ActiveXObject) { return xml.xml; }
    return new XMLSerializer().serializeToString(xml);
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
    try{
        var cell = tempGraph.getSelectionCell();
        var stencil = cell.getStyle();
        var base64 = stencil.substring(14, stencil.length-2);
        var desc = tempGraph.decompress(base64);
        var shapeXml = mxUtils.parseXml(desc).documentElement;
        var print =  shapeXml.getElementsByTagName("inputstring")[0];
        if(print != null){
            return print.innerHTML;
        }else{
            return null;
        }
    }catch (e) {
        var edge = tempGraph.getSelectionCell();
        var edgeStyle = edge.getStyle();
        var initCut = edgeStyle.indexOf("inputstring=");
        if(initCut != -1){
            edgeStyle = getTableInfoFromConnector(edgeStyle,"inputstring=");
            return  edgeStyle;
        }else{
            return null;
        }
    }
}

function saveInputStringXML(text){
    try {
        var cell = tempGraph.getSelectionCell();
        var stencil = cell.getStyle();
        var base64 = stencil.substring(14, stencil.length-2);
        var desc = tempGraph.decompress(base64);
        var shapeXml = mxUtils.parseXml(desc).documentElement;
        var print = shapeXml.getElementsByTagName("inputstring")[0];
        if(text != null){
            if(print == null){
                var xml = document.createElement("inputstring");
                xml.innerHTML = text;
                shapeXml.appendChild(xml);
            }else{
                print.innerHTML = text;
            }
        }else{
            if(print != null){
                print.remove();
            }
        }
        var xmlBase64 = tempGraph.compress(mxUtils.getXml(shapeXml));
        cell.setStyle('shape=stencil(' + xmlBase64 + ');')
    }catch (e){
        var edge = tempGraph.getSelectionCell();
        var edgeStyle = edge.getStyle();
        var initCut = edgeStyle.indexOf("inputstring=");
        if(initCut != -1){
            edgeStyle = removeTableInfo(edge,"inputstring=");
        }
        if(text != null){
            text = text.replaceAll(";", '[puntovirgola]');
            edgeStyle = edgeStyle +"inputstring="+ text + ";";
            edge.setStyle(edgeStyle);
        }
    }
}
