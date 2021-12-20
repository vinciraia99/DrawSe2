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
                param.innerHTML = object[i]["params"][k]["param"];
                let procedure = document.createElement("procedure");
                procedure.innerHTML =  object[i]["params"][k]["procedure"];
                let param2 = document.createElement("param2");
                param2.innerHTML = object[i]["params"][k]["param2"];
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
            let procedure = ids.getElementsByTagName("procedure")[0].innerHTML;
            let param = ids.getElementsByTagName("param")[0].innerHTML;
            let param2 = ids.getElementsByTagName("param2")[0].innerHTML;
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
            ar.push(elem1.innerHTML);
            ar.push(elem2.innerHTML);
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
