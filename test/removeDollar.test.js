let myNum = "$1,000       .50";
let newNumber = Math.round(myNum.replace(/[$,]/g, "").replace(/\s/g, ""));
console.log(newNumber);
