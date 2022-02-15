function generateXMLSemanticRules(graph,languageName){
    if(graph.editorMode == "Shape Editor Mode") {
        tempGraph = graph;
        let alltable = loadAllTable(graph);
        if(alltable == null) {
            return null;
        }
        if(languageName == null){
            mxUtils.alert("A language name has not been defined");
            return false;
        }

        var root = document.createElement("language");
        root.setAttribute("name",languageName);

        for(var i =0;i<alltable.length;i++) {
            let semantic = document.createElement("semantic");
            if (alltable[i]["semantic"]["reference"] != null) {
                semantic.setAttribute("ref", alltable[i]["semantic"]["reference"]);
            } else {
                mxUtils.alert("Define a reference for the object " + alltable[i]["semantic"]["name"]);
                return;
            }
            if (alltable[i]["semantic"]["inputstring"] != null) {
                let text = document.createElement("text")
                text.setAttribute("graphicRef", "Center");
                text.setAttribute("name", alltable[i]["semantic"]["inputstring"]);
                text.setAttribute("type", "string");
                semantic.appendChild(text);
            }
            for (let k = 0; k < alltable[i]["semantic"]["table"].length; k++) {
                let property = document.createElement("property");
                if (alltable[i]["semantic"]["table"][k]["property"] != "" && alltable[i]["semantic"]["table"][k]["type"] != null) {
                    property.setAttribute("name", alltable[i]["semantic"]["table"][k]["property"].replaceAll("$",""));
                    property.setAttribute("type", alltable[i]["semantic"]["table"][k]["type"]);
                    property.setAttribute("condition", alltable[i]["semantic"]["table"][k]["postcondition"]);
                }
                for (let x = 0; x < alltable[i]["semantic"]["table"][k]["params"].length; x++) {
                    let functions = document.createElement("function");
                    functions.setAttribute("name", alltable[i]["semantic"]["table"][k]["params"][x]["procedure"]);
                    functions.setAttribute("path", alltable[i]["semantic"]["table"][k]["params"][x]["param"]);
                    if (alltable[i]["semantic"]["table"][k]["params"][x]["param2"] != "") {
                        functions.setAttribute("param", alltable[i]["semantic"]["table"][k]["params"][x]["param2"]);
                    }

                    property.appendChild(functions);
                }
                semantic.appendChild(property);
            }
            if (alltable[i]["semantic"]["printpath"] != "" || alltable[i]["semantic"]["print"] != "") {
                let property = document.createElement("property");
                property.setAttribute("name", "print");
                property.setAttribute("path", alltable[i]["semantic"]["printpath"]);
                property.setAttribute("param", alltable[i]["semantic"]["print"]);
                semantic.appendChild(property);
            }
            if(alltable[i]["visit"] == null && checkIsSelected() == false){
                mxUtils.alert("The visit table has not been defined for " + alltable[i]["semantic"]["name"] +", if you want to use the visit table define it for all references otherwise uncheck it");
                return false;
            }else if(alltable[i]["visit"] != null && checkIsSelected() == false){
                let visit = document.createElement("visit");
                visit.setAttribute("priority",alltable[i]["visit"]["priority"]);
                let increment = parseInt(alltable[i]["visit"]["order"]);
                visit.setAttribute("order",increment + "");
                for(let k=0;k<alltable[i]["visit"]["path"].length;k++){
                    let path = document.createElement("path");
                    path.setAttribute("value",alltable[i]["visit"]["path"][k]["path"]);
                    visit.appendChild(path);
                }
                semantic.appendChild(visit);
            }
            root.appendChild(semantic);
        }
    }else{
        mxUtils.alert("You can use this function only in Shape Mode");
        return false;
    }
    let finalxml = getXmlString(root);
    finalxml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + getXmlString(root);
    finalxml = finalxml.replaceAll(" xmlns=\"http://www.w3.org/1999/xhtml\"","");
    finalxml = finalxml.replaceAll("graphicref=","graphicRef=");
    console.log(finalxml);
    return finalxml;
}

function generateJSONSemanticRules(graph,languageName){
        let xmlText = generateXMLSemanticRules(graph,languageName);
        if(xmlText == false) return false;
        let x2js = new X2JS();
        let jsonObj = x2js.xml_str2json( xmlText );
        return  JSON.stringify(jsonObj);
}