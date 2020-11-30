var A = [], b = [],n=0, x=[], y=[];
let expression = "";

let colors = {
  "lnlReg" : Desmos.Colors.BLUE,
  "sqrdReg" : Desmos.Colors.RED,
  "plnReg" : Desmos.Colors.GREEN,
  "expReg" : Desmos.Colors.PURPLE,
  "potReg" : Desmos.Colors.ORANGE,
  "logReg" : Desmos.Colors.BLACK
}

let labelTexts = {
  "lblLnl" : "Regresión Lineal",
  "lblSqrd" : "Regresión cuadrática",
  "lblPln" : "Regresión polinomial",
  "lblExp" : "Regresión exponecial",
  "lblPot" : "Regresión potencia",
  "lblLog" : "Regresión logarítmica"
}

var elt = null, calculator = null; //document.getElementById('calculator');
initCalc()
function initCalc(){
  elt = document.getElementById('calculator');
  //elt.style.visibility = 'hidden';
  let divBase = document.getElementById("baseInput");
  divBase.style.visibility = 'hidden';
  document.getElementById("nText").value = "";
  calculator = Desmos.GraphingCalculator(elt);
  calculator.updateSettings({ expressionsCollapsed: true });
  elt.style.width = (0.8*window.innerWidth/2).toString()+"px";
  elt.style.height = (0.9*window.innerHeight).toString()+"px"; 
  let radios = document.getElementsByName("regsOpts");
  radios.forEach(item => {
    item.checked = false;
  });

}
window.addEventListener('resize', function(){
  //elt.style.width = document.body.clientWidth.toString()+"px";
  elt.style.height = (0.9*window.innerHeight).toString()+"px"; 
});

let butt = document.getElementById("nBut").addEventListener("click",function(){
  clicked();
}, false);
let current = "";
let divRad = document.getElementById("radsDiv").addEventListener("change", radiosChecked, false);

function radiosChecked(){
  Object.keys(labelTexts).forEach(element => {
    let lbl = document.getElementById(element);
    lbl.innerHTML = labelTexts[element];
  });
  let radios = document.getElementsByName("regsOpts");
  radios.forEach(element => {
    if (element.checked==true){
      current = element.id;
      if (element.id=="lnlReg" && element.checked==true ){
        initMatrices(2);
        regressionGeneralized(2,x,y,false, false, false);
      }
      if (element.id == "sqrdReg" && element.checked==true){
        initMatrices(3);
        regressionGeneralized(3,x,y,false, false, false);
      }
      if (element.id == "plnReg" && element.checked==true){
        initMatrices(n);
        regressionGeneralized(n,x,y,false, false, false);
      }
      if (element.id=="expReg" && element.checked==true){
        initMatrices(2);
        generalizedExponential(2,x,y);
      }
      if (element.id=="potReg"  && element.checked==true){
        initMatrices(2);
        generalizedPotential(2,x,y);
      }
      if (element.id=="logReg" && element.checked==true){
        initMatrices(2);
        generalizedLogarithmic(2,x,y);
      }
    }
  });
}

function setMargins(x,y){
  calculator.setMathBounds({
    left: Math.min(...x)-Math.min(...x)*5,
    right: Math.max(...x)+Math.min(...x)*5,
    bottom: Math.min(...y)-Math.min(...y)*5,
    top: Math.max(...y)+Math.min(...y)*5
  });
}

function clicked(){
  console.log("click")
  x=[];
  y=[];
  n = parseInt(document.getElementById("nText").value);
  //initMatrices(n);
  initPoints(n);
}

function clickAddPoint(id){
  let node = document.getElementById(id);
  let divBase = document.getElementById("baseInput");
  let divNe = document.getElementById("mainOpts");
  console.log(node);
  x.push(parseFloat(node.childNodes[1].value));
  y.push(parseFloat(node.childNodes[3].value));
  setMargins(x,y);
  plot(null,x,y )
  console.log(x,y);
  divNe.removeChild(node);
  console.log(divNe.childElementCount);
  if (divNe.childElementCount==1){
    //divNe.style.visibility = 'hidden';
    //divNe.removeChild(divBase);
    elt.style.visibility = 'visible';
  }
}

function initPoints(n){
  let divNe = document.getElementById("mainOpts");
  let divBase = document.getElementById("baseInput");
  //console.log(divBase.childNodes[1].value);
  for (let index = 0; index < n; index++) {
      let newNode = divBase.cloneNode(true);
      newNode.style.visibility = 'visible';
      newNode.id = "point"+index.toString();
      newNode.childNodes[1].id = "x"+index.toString(); newNode.childNodes[1].value = ""; newNode.childNodes[1].placeholder = "Punto "+index.toString()+" :x";
      newNode.childNodes[3].id = "y"+index.toString();  newNode.childNodes[3].value = ""; newNode.childNodes[3].placeholder = "Punto "+index.toString()+" :y"
      newNode.childNodes[5].childNodes[1].id = "but"+index.toString(); //newNode.childNodes[5].childNodes[1].value = "";
      newNode.childNodes[5].childNodes[1].onclick = function(){
       clickAddPoint( newNode.id);
      };
      divNe.appendChild(newNode);
  }
  //for (let index = 0; index < n; index++) {
  //  let divX = document.createElement("div"), divY = document.createElement("div");
    //divX.value = "x";
    //divY.value = "y";
  //  divNe.appendChild(divX); divNe.appendChild(divY);
  //}
}


function initMatrices(n){
  A=[];
  b=[];
  for (let index = 0; index < n; index++) {
      A.push([]);  
      b.push([])  
  }
  for (let i = 0; i < n; i++) {
      b[i][0] = 0;
      for (let j = 0; j < n; j++) {
          A[i][j] = 0;
      }    
  }
}

function regressionGeneralized(n,x,y, isExp=false, isPot=false, isLn=false){
    let nPoints = x.length;
    function Afunc(last, i){
        let row = 0;
        for (let exp = 0; exp < Math.pow(n,2) ; exp++) {
            if (exp%n==0 && exp!=0){
                last = exp-1-i;
                i+=1;
            }        
            let aux = 0
            x.forEach(x_i => {
                aux += Math.pow(x_i, exp-last);
            });
            if (exp!=0 && exp%n==0){
                row+=1;
            }
            A[row][parseInt(exp%n)] = aux;
        }
    }
    function makeArr(startValue, stopValue, cardinality) {
        var arr = [];
        var step = (stopValue - startValue) / (cardinality - 1);
        for (var i = 0; i < cardinality; i++) {
        arr.push(startValue + (step * i));
        }
        return arr;
    }
    function Bfunc(){
        for (let exp = 0; exp < n; exp++) {
            let sum = 0;
            for (let i = 0; i < x.length; i++) {
                sum += Math.pow(x[i],exp)*y[i];              
            }
            b[exp] = sum;
        }
    }
    Afunc(0,0);
    Bfunc();
    console.log(A,b)
    let s = math.multiply(math.inv(A),b);
    //console.log(Math.min.apply(Math,x),Math.max.apply(Math,x))
    let range0 = Math.max.apply(Math,x) - Math.min.apply(Math,x);
    let newX = makeArr(Math.min.apply(Math,x)-1, Math.max.apply(Math,x)+1,25);
    let newY = [];
    for (let index = 0; index < newX.length; index++) {
        newY.push(0);
    }
    let eq = "";
    if (isExp == true){
      let a = Math.exp(s[0]);
      let b = s[1];
      console.log(a,b, s)
      let ae = "(("+b.toLocaleString('fullwide', { useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 8 }).toString()+"*x))";
      //console.log( math.simplify("3^"+ae).toString());
      eq = a.toLocaleString('fullwide', { useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 8 }).toString()+"*e^(".concat(ae).concat(")");
      //console.log(math.simplify(eq).toString() )
      //setMargins(x,y)
      calculator.setExpression({ id: 'exp', latex: a.toLocaleString('fullwide', { useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 8 }).toString()+"*e^{"+ae+"}", color: colors[current] });
      let labelUsed = document.getElementById("lblExp");
      labelUsed.innerHTML += " y="+a.toLocaleString('fullwide', { useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 8 }).toString()+"*e^"+ae+"";
      return;
    }
    else if (isPot==true){
      let a = Math.exp(s[0]);
      let b = s[1];
      let bS = b.toLocaleString('fullwide', { useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 8 }).toString();
      let aS = a.toLocaleString('fullwide', { useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 8 }).toString();
      //setMargins(x,y)
      calculator.setExpression({ id: 'pot', latex: aS+"*x^{"+bS+"}",color: colors[current] });
      let labelUsed = document.getElementById("lblPot");
      labelUsed.innerHTML += " y="+aS+"*x^("+bS+")";
      return;
    }
    else if (isLn==true){
      let a = s[0];
      let b = s[1];
      let bS = b.toLocaleString('fullwide', { useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 8 }).toString();
      let aS = a.toLocaleString('fullwide', { useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 8 }).toString();
      console.log(s[0],s[1]);
      //setMargins(x,y)
      calculator.setExpression({ id: 'logr', latex: aS+"+"+bS+"*(\ln{x})", color: colors[current] });
      let labelUsed = document.getElementById("lblLog");
      labelUsed.innerHTML += " y="+aS+"+"+bS+"*ln(x)";
      return;
    }
    else{
      for (let index = 0; index < s.length; index++) {
        let i=0;
        //let nfg = s[index].toString();
        //console.log( math.rationalize(parseFloat(s[index].toLocaleString('fullwide', { useGrouping: false }))) );
        //console.log(s[index], s[index].toLocaleString('fullwide', { useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 8 }).toString());
        if (s[index]<0){
            eq += parseFloat(s[index].toLocaleString('fullwide', { useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 8 })).toString()+"x^"+parseFloat(index).toString();// + toString(x) + "^" + toString(index);
        }
        else{
            if (index==0){
                eq +=parseFloat(s[index].toLocaleString('fullwide', { useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 8 })).toString();
            }
            else{
                eq +="+"+parseFloat(s[index].toLocaleString('fullwide', { useGrouping: false, minimumFractionDigits: 0, maximumFractionDigits: 8  })).toString()+"x^"+parseFloat(index).toString();
            }
        }
        newX.forEach(x_i=>{
            newY[i] += Math.pow(x_i,index)*s[index];
            i+=1
        });   
      } 
    }
    //console.log(math.simplify(eq).toString())
    //plot(newX,newY,x,y);
    //console.log(newX,newY,s)
    let labelUsed = null;
    expression = math.simplify(eq).toString();
    setMargins(x,y)
    if (current == "lnlReg"){
      labelUsed = document.getElementById("lblLnl");
      labelUsed.innerHTML += " y="+expression;
      plot(expression,x,y, "lnr", colors["lnlReg"]);
    }
    if (current == "sqrdReg"){
      labelUsed = document.getElementById("lblSqrd");
      labelUsed.innerHTML += " y="+expression;
      plot(expression,x,y, "quad", colors["sqrdReg"]);
    }
    if (current == "plnReg"){
      labelUsed = document.getElementById("lblPln");
      labelUsed.innerHTML += " y="+expression;
      plot(expression,x,y, "pol", colors["plnReg"]);
    }
    
}

function generalizedExponential(n,x,y){
  let yLn = [];
  y.forEach(y_i =>{
    yLn.push(Math.log1p(y_i-1));
  });
  regressionGeneralized(n,x,yLn, true, false, false);
  plot(null,x,y, null, Desmos.Colors.PURPLE);
}

function generalizedPotential(n,x,y){
  let yLn = [], xLn = [];
  y.forEach(y_i =>{yLn.push(Math.log1p(y_i-1));});
  x.forEach(x_i =>{xLn.push(Math.log1p(x_i-1));});
  regressionGeneralized(n,xLn,yLn, false, true, false);
  plot(null,x,y, null, colors["potReg"] );
}

function generalizedLogarithmic(n,x,y){
  let xLn= [];
  x.forEach(x_i => {xLn.push(Math.log1p(x_i-1));});
  regressionGeneralized(n, xLn,y, false, false, true);
  plot(null,x,y, null, colors["logReg"]);
}

function plot(expr=null,x,y, id, color){
  calculator.updateSettings({ expressionsCollapsed: true });
  //calculator.expressionsCollapsed = true;
  if (expr!=null){
    console.log(expr);
    console.log(current);
    calculator.setExpression({ id: id,
       latex: expr,
       color: colors[current]
    });

  }
  for (let index = 0; index < x.length; index++) {
    calculator.setExpression({ id: index.toString(), latex: '('+x[index].toString()+','+y[index].toString()+')' });
  }
  ///calculator.updateSettings.expressionsCollapsed = true;
  
  //calculator.setExpression({id:'graph2', latex:'y=e^x'});
  //calculator.setExpression({id:'graph3', latex:'(2,3)'});    
}
    


//let x = [1,2,4,8,16,32,64];
//let y = [2,4,7,11,16,19,21];
//let anw = generalizedLogarithmic(n, x, y);
//let x = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]
//let y = [0.3,0.7,1.2,3.5,5.3,7.6,11,16,20,24.1,33.8,44,55.3,69.2,86,109.5,128.3,140.8,158.7,182.1,207.9,233,250,262.7,276.6,300.5]
//let x = [1,2,3,4];//[0, 0.108, 0.215, 0.322, 0.430, 0.537, 0.645, 0.752, 0.860];
//let y = [1,1,2,6];//[1.037, 1.402, 1.638, 1.774, 1.803, 1.715, 1.509, 1.214, 0.831];
//let name = window.prompt("Enter your name: ");
//console.log(name);
//n=4
//regressionGeneralized(n,x,y)
//plot(x,y)


