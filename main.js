var A = [], b = [],n=0, x=[], y=[];
let expression = "";

let colors = {
  "lnlReg" : Desmos.Colors.BLUE,
  "sqrdReg" : Desmos.Colors.RED,
  "plnReg" : Desmos.Colors.GREEN,
  "expReg" : Desmos.Colors.PURPLE,
  "potReg" : Desmos.Colors.ORANGE,
  "logReg" : Desmos.Colors.GREEN
}

let labelTexts = {
  "lblLnl" : "Regresión Lineal",
  "lblSqrd" : "Regresión cuadrática",
  "lblExp" : "Regresión exponecial",
  "lblPot" : "Regresión potencia",
  "lblLog" : "Regresión logarítmica"
}

var elt = null, calculator = null; //document.getElementById('calculator');
let current = "";
initCalc()

function initCalc(){
  elt = document.getElementById('calculator');
  let divBase = document.getElementById("baseInput");
  divBase.style.visibility = 'hidden';
  document.getElementById("nText").value = "";
  calculator = Desmos.GraphingCalculator(elt);
  calculator.updateSettings({ expressionsCollapsed: true });
  //elt.style.width = (0.8*window.innerWidth/2).toString()+"px";
  elt.style.height = (0.9*window.innerHeight).toString()+"px"; 
  let radios = document.getElementsByName("regsOpts");
  radios.forEach(item => {
    item.checked = false;
  });
}

let butt = document.getElementById("nBut").addEventListener("click",function(){
  clicked();
}, false);

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
    left: Math.min(...x)-2,
    right: Math.max(...x)+2,
    bottom: Math.min(...y)-2,
    top: Math.max(...y)+2
  });
}

function clicked(){
  console.log("click")
  x=[];
  y=[];
  n = parseInt(document.getElementById("nText").value);
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
    elt.style.visibility = 'visible';
  }
}

function initPoints(n){
  let divNe = document.getElementById("mainOpts");
  let divBase = document.getElementById("baseInput");
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
    let range0 = Math.max.apply(Math,x) - Math.min.apply(Math,x);
    let eq = "";
    if (isExp == true){
      let a = Math.exp(s[0]);
      let b = s[1];
      console.log(a,b, s)
      let ae = "(("+parseFloat(b).toFixed(7).toString()+"*x))";
      eq = parseFloat(a).toFixed(7).toString()+"*e^(".concat(ae).concat(")");
      calculator.setExpression({ id: 'exp', latex: parseFloat(a).toFixed(7).toString()+"*e^{"+ae+"}", color: colors[current] });
      let labelUsed = document.getElementById("lblExp");
      labelUsed.innerHTML += " y="+parseFloat(a).toFixed(7).toString()+"*e^"+ae+"";
      return s;
    }
    else if (isPot==true){
      let a = Math.exp(s[0]);
      let b = s[1];
      let bS = parseFloat(b).toFixed(7).toString();
      let aS = parseFloat(a).toFixed(7).toString();
      calculator.setExpression({ id: 'pot', latex: aS+"*x^{"+bS+"}",color: colors[current] });
      let labelUsed = document.getElementById("lblPot");
      labelUsed.innerHTML += " y="+aS+"*x^("+bS+")";
      return s;
    }
    else if (isLn==true){
      let a = s[0];
      let b = s[1];
      let bS = parseFloat(b).toFixed(7).toString();
      let aS = parseFloat(a).toFixed(7).toString();
      console.log(s[0],s[1]);
      calculator.setExpression({ id: 'logr', latex: aS+"+"+bS+"*(\ln{x})", color: colors[current] });
      let labelUsed = document.getElementById("lblLog");
      labelUsed.innerHTML += " y="+aS+"+"+bS+"*ln(x)";
      return s;
    }
    else{
      for (let index = 0; index < s.length; index++) {
        let i=0;
        if (s[index]<0){
          eq += parseFloat(s[index]).toFixed(7).toString()+"x^"+parseFloat(index).toString();// + toString(x) + "^" + toString(index);
        }
        else{
            if (index==0){
                eq +=parseFloat(s[index]).toFixed(7).toString();
            }
            else{
                eq +="+"+parseFloat(s[index]).toFixed(7).toString()+"x^"+parseFloat(index).toString();
                //.toLocaleString('fullwide', { useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 15  }))
            }
        }
      } 
    }
    let labelUsed = null;
    expression = eq//math.simplify(eq,{},{exactFractions: false, fractionsLimit:1000000000000000}).toString();
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
    rSquared(s,x,y);
}

function generalizedExponential(n,x,y){
  let yLn = [];
  y.forEach(y_i =>{
    yLn.push(Math.log1p(y_i-1));
  });
  let s = regressionGeneralized(n,x,yLn, true, false, false);
  let f = function (a, b, x) {
    return a*Math.exp(x*b);
  }
  let e = 0;
  let i = 0;
  y.forEach((y_i) =>{
    e +=  f(Math.exp(s[0]), s[1], x[i]) - y_i ;
    i+=1;
  });
  e = Math.sqrt((Math.pow(e,2))/x.length);
  let labelUsed = document.getElementById("lblExp");
  labelUsed.innerHTML += " error="+e;
  plot(null,x,y, null, Desmos.Colors.PURPLE);
}

function generalizedPotential(n,x,y){
  let yLn = [], xLn = [];
  y.forEach(y_i =>{yLn.push(Math.log1p(y_i-1));});
  x.forEach(x_i =>{xLn.push(Math.log1p(x_i-1));});
  let s = regressionGeneralized(n,xLn,yLn, false, true, false);
  let f = function (a, b, x) {
    return a*Math.pow(x,b);
  }
  let e = 0;
  let i = 0;
  y.forEach((y_i) =>{
    e +=  f( Math.exp(s[0]), s[1],x[i]) - y_i ;
    i+=1;
  });
  e = Math.sqrt((Math.pow(e,2))/x.length);
  let labelUsed = document.getElementById("lblPot");
  labelUsed.innerHTML += " error="+e;
  plot(null,x,y, null, colors["potReg"] );
}

function generalizedLogarithmic(n,x,y){
  let xLn= [];
  x.forEach(x_i => {xLn.push(Math.log1p(x_i-1));});
  let s = regressionGeneralized(n, xLn,y, false, false, true);
  let f = function (a, b, x) {
    return a + b*Math.log1p(x-1);
  }
  let e = 0;
  let i = 0;
  y.forEach((y_i) =>{
    e +=   f(s[0], s[1],x[i]) - y_i ;
    i+=1;
  });
  e = Math.sqrt((Math.pow(e,2))/x.length);
  let labelUsed = document.getElementById("lblLog");
  labelUsed.innerHTML += " error="+e;
  plot(null,x,y, null, colors["logReg"]);
}

function rSquared(s, x, y){
  if (current=="lnlReg"){
      let f = function (a, b, x) {
        return a+b*x;
      }
      let e = 0;
      let i = 0;
      y.forEach((y_i) =>{
        e +=  Math.pow((f(s[0], s[1],x[i]) - y_i ),2);
        i+=1;
      });
      e = Math.sqrt(e/y.length);
      let labelUsed = document.getElementById("lblLnl");
      console.log(labelUsed.innerHTML);
      labelUsed.innerHTML += " error="+e;
  }
  else if (current=="sqrdReg"){
    let f = function (a, b, c, x) {
      return a*Math.pow(x,2) + b*x + c;
    }
    let e = 0, i=0;
    y.forEach((y_i) =>{
     e +=  Math.pow(( f(s[2], s[1], s[0],x[i]) - y_i ),2);
        i+=1;
      });
      e = Math.sqrt(e/y.length);
    let labelUsed = document.getElementById("lblSqrd");
    labelUsed.innerHTML += " error="+e;
    console.log(labelUsed.innerHTML)
  }
}

function plot(expr=null,x,y, id, color){
  calculator.updateSettings({ expressionsCollapsed: true });
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
}