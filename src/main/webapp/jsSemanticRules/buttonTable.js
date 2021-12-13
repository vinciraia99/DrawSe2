function setOrderUpBex(i){
    if(i!=2){
        var j=i-1;
        var k = i-2;
        document.getElementsByClassName("btnup")[k].setAttribute("onclick","setOrderUpBex("+ j +")");
        document.getElementsByClassName("btndown")[k].setAttribute("onclick","setOrderDownBex("+ j +")");
        document.getElementsByClassName("btnup")[k-1].setAttribute("onclick","setOrderUpBex("+ i +")");
        document.getElementsByClassName("btndown")[k-1].setAttribute("onclick","setOrderDownBex("+ i +")");
        document.getElementsByTagName("tbody")[0].insertBefore(document.getElementsByTagName("tr")[i],document.getElementsByTagName("tr")[j]);
        arraymove(elementFigureList,i,j);

    }

}

function setOrderDownBex(i){
    if((indexprioritytable-1) !=i){
        var j=i+1;
        var k = i-2;
        document.getElementsByClassName("btnup")[k].setAttribute("onclick","setOrderUpBex("+ j +")");
        document.getElementsByClassName("btndown")[k].setAttribute("onclick","setOrderDownBex("+ j +")");
        document.getElementsByClassName("btnup")[k+1].setAttribute("onclick","setOrderUpBex("+ i +")");
        document.getElementsByClassName("btndown")[k+1].setAttribute("onclick","setOrderDownBex("+ i +")");
        document.getElementsByTagName("tbody")[0].insertBefore(document.getElementsByTagName("tr")[j],document.getElementsByTagName("tr")[i]);
        arraymove(elementFigureList,i,j);
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