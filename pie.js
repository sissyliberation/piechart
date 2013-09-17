 var pie, ctx, numSamples, xScalar, yScalar, radius, quarter;
// data sets -- set literally or obtain from an ajax call
var dataName = [  ];
var dataSet = [ ];
var dataColor = [];
var dataForm;
var total;
var titleCount=1;

function addData(newName, newValue, newColor) {
    dataName.push(newName);
    dataSet.push(newValue);
    dataColor.push(newColor);
    drawPie();
    resetRows();
    for(var i=0;i<dataSet.length;++i) {
        addRow(i);
       var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.row'+i+' td:nth-child('+4+'){ color:'+dataColor[i]+';}';
        document.getElementsByTagName('head')[0].appendChild(style);
        document.getElementById('row'+i).className += 'row'+i;
   
    } 
    document.getElementById('title').value = "";
    document.getElementById('value').value = "";
    document.getElementById('color').value = "";
}

function addRow(input) {
    var table = document.getElementById('chartData');
    var row = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    
    row.setAttribute("id","row"+input);

    td1.innerHTML = dataName[input];
    td2.innerHTML = dataSet[input];
    total=0;
    for (var i = 0; i < dataSet.length; i++) { total += parseInt(dataValue[i]); }
    td3.innerHTML = Math.round((dataSet[input] / total)* 100 * 100) /100+"%";
    td4.innerHTML = dataColor[input];
    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);
    row.appendChild(td4);
    table.children[1].appendChild(row, table.children[0].childNodes[1]);
}

function checkInput() {
    dataForm = document.getElementById("dataInput");
    if(dataForm[0].value.length < 1) {
        dataForm[0].value = titleCount++;
    }
    if(dataForm[1].value.length < 1) {
        alert("Please enter value!");
    }
    else if(!(isNewTitle(dataForm[0].value))) {
        alert("The title must be a unique one!");
    }
	else if(!(isNumber(dataForm[1].value))) {
		alert("The value must me a positive integer!");
	}
	else if(dataForm[1].value == 0) {
		alert("The value must be greater than 0!");
	}
    else if(!(isNewColor(dataForm[2].value))) {
        var tempColor = "#"+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
        if(!(isNewColor(tempColor))) {
            while(!(isNewColor(tempColor))) {
                tempColor = "#"+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
            }
        }
        dataForm[2].value = tempColor;
        addData(dataForm[0].value, dataForm[1].value, dataForm[2].value);
    }

    else if(dataForm[2].value.length < 6) {
            var tempColor = "#"+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
            var alreadyUsed = 2;

            while(alreadyUsed==2) {
                tempColor = "#"+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
                var counter=0;
                for(var i =0; i < dataColor.length;++i) {
                    
                    if(tempColor == dataColor[i]) { alreadyUsed=1; }
                    else { ++counter; }
                }
                if(counter==dataColor.length) { alreadyUsed = 1; }
            }
            dataForm[2].value = tempColor;
        }
        else {
    var a = dataForm[0].value;
    var b = dataForm[1].value;
    var c = dataForm[2].value;
    addData(dataForm[0].value, dataForm[1].value, dataForm[2].value);

    }      
}

function resetData() {
    for(var i=0;i<dataName.length;++i){ removeRow(); }
    dataName = [];
    dataSet= [];
    dataColor = [];
    drawPie();
    
}
function resetRows() {
    for(var i=0;i<dataName.length-1;++i) {removeRow();}
}

function removeRow(){
    var obj=document.getElementById('chartBody');
    var rws=obj.getElementsByTagName('tr');
    obj.removeChild(rws[rws.length-1]);
}

function isNumber (o) {
	return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
}

function isNewTitle (title) {
    for (var i = 0; i < dataName.length; i++) {
        if(title == dataName[i]) {
            return false;
        }
    }

    return true;
}

function isNewColor (val) {
    for (var i = 0; i < dataColor.length; i++) {
        if(val == dataColor[i]) {
            return false;
        }
    }
    return true;
}

function downloadPie() {
    alert("Sorry, this hasn't been implemented yet.");
}

function init() {
    pie = document.getElementById("pie");
    quarter = document.getElementById("quarter");
    ctx = pie.getContext("2d");
    drawPie();

}

function drawPie() {

    radius = pie.height / 3;
    var midX = pie.width / 2;
    var midY = pie.height / 2;
    ctx.strokeStyle = "black";
    ctx.font = "18pt Helvetica";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // get data set
    dataValue = dataSet;
    total = 0;
    numSamples = dataName.length;

    
    for (var i = 0; i < numSamples; i++) { total += parseInt(dataValue[i]); }

    ctx.clearRect(0, 0, pie.width, pie.height);
    var oldAngle = 0;

    for (var i = 0; i < numSamples; i++) {
        var portion = dataValue[i] / total;
        var wedge = 2 * Math.PI * portion;
        ctx.beginPath();
        var angle = oldAngle + wedge;
        ctx.arc(midX, midY, radius, oldAngle, angle);
        ctx.lineTo(midX, midY);
        ctx.closePath();
        ctx.fillStyle = dataColor[i];
        ctx.fill();

        var labAngle = oldAngle + wedge / 2;
        var labX = midX + Math.cos(labAngle) * radius* 1.4;
        var labY = midY + Math.sin(labAngle) * radius * 1.3-26;
        ctx.save();
        ctx.fillStyle = dataColor[i];
        var rounded = Math.round((dataValue[i] / total )* 100 * 100) / 100;
        ctx.fillText(rounded +"%", labX, labY + 25);
        ctx.restore();

        oldAngle += wedge;
    }

}