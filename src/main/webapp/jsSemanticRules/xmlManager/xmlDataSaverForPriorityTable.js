function saveGenericValue(element,text,type){
    try {
        var cell = element;
        var stencil = cell.getStyle();
        var base64 = stencil.substring(14, stencil.length-2);
        var desc = tempGraph.decompress(base64);
        var shapeXml = mxUtils.parseXml(desc).documentElement;
        var print = shapeXml.getElementsByTagName(type)[0];
        if(text != null){
            if(print == null || print == undefined){
                var xml = document.createElement(type);
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
        var edge = element
        var edgeStyle = edge.getStyle();
        var initCut = edgeStyle.indexOf(type+"=");
        if(initCut != -1){
            edgeStyle = removeTableInfo(edge,type+"=");
        }
        if(text != null){
            text = text.replaceAll(";", '[puntovirgola]');
            edgeStyle = edgeStyle + type+"="+ text + ";";
            edge.setStyle(edgeStyle);
        }
    }
}

function getGeneric(element,type){
    try{
        var cell = element;
        var stencil = cell.getStyle();
        var base64 = stencil.substring(14, stencil.length-2);
        var desc = tempGraph.decompress(base64);
        var shapeXml = mxUtils.parseXml(desc).documentElement;
        var print =  shapeXml.getElementsByTagName(type)[0];
        if(print != null){
            return print.innerHTML;
        }else{
            return null;
        }
    }catch (e) {
        var edge = element;
        var edgeStyle = edge.getStyle();
        var initCut = edgeStyle.indexOf(type+"=");
        if(initCut != -1){
            edgeStyle = getTableInfoFromConnector(edgeStyle,type+ "=");
            return  edgeStyle;
        }else{
            return null;
        }
    }
}


function visitTableToXML(object) {
    var xml = document.createElement("pathinfo");
    for(var i=0;i<object.length;i++){
        if(object[i]["path"] != "") {
            var id = document.createElement("id" + i);
            var patht = document.createElement("patht");
            patht.innerHTML = object[i]["patht"];
            var path = document.createElement("path");
            path.innerHTML = object[i]["path"];
            id.appendChild(patht);
            id.appendChild(path);
            xml.appendChild(id);
        }
    }
    return getXmlString(xml);
}

function getPathForElementXML(xml){
    var array = new Array();
    const parser = new DOMParser();
    let doc = parser.parseFromString(xml, "application/xml");
    const errorNode = doc.querySelector("parsererror");
    if (errorNode) {
        return null;
    }else {
        doc = doc.getElementsByTagName("pathinfo")[0];
        for (var i = 0; i < doc.childElementCount; i++) {
            var id = doc.getElementsByTagName("id" + i)[0];
            var patht = id.getElementsByTagName("patht")[0].innerHTML;
            var path = id.getElementsByTagName("path")[0].innerHTML;
            var data = {
                patht: patht,
                path: path,
            };
            array.push(data);
        }
        return array;
    }
}

function saveVisitTableXML(array){
    var xml = visitTableToXML(array);
    var xmlstring = getXmlString(xml)
    try{
        var cell = tempGraph.getSelectionCell();
        var stencil = cell.getStyle();
        var base64 = stencil.substring(14, stencil.length-2);
        var desc = tempGraph.decompress(base64);
        var shapeXml = mxUtils.parseXml(desc).documentElement;
        var tableinfo = shapeXml.getElementsByTagName("pathinfo")[0];
        if(tableinfo == null){
            shapeXml.appendChild(xml);
        }else{
            shapeXml.getElementsByTagName("pathinfo")[0].remove();
            shapeXml.appendChild(xml);
        }
        var xmlBase64 = tempGraph.compress(mxUtils.getXml(shapeXml));
        cell.setStyle('shape=stencil(' + xmlBase64 + ');')
    }catch (e){
        var edge = tempGraph.getSelectionCell();
        var edgeStyle = edge.getStyle();
        var initCut = edgeStyle.indexOf("pathinfo=");
        if(initCut != -1){
            edgeStyle = removeTableInfo(edge,"pathinfo=");
        }
        xmlstring = xmlstring.replaceAll(";", '[puntovirgola]');
        edgeStyle = edgeStyle +"pathinfo="+ xmlstring + ";";
        edge.setStyle(edgeStyle);

    }

}
