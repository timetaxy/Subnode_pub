//numbertest.js;

// pm 12:27 0xbfe299 12575385
// var test1227 = parseInt("0xbfe299", 16);
// console.log(test1227);

// var test1 = "0xbfde6e";
// var timelabs = 20 * 60 * 5;
// var timelabs2 = 20 * 60 * 6;
// console.log("0x" + (12575385 - timelabs).toString(16)); //bfcb29
// console.log("0x" + (12575385 - timelabs2).toString(16)); //0xbfc679
// console.log(parseInt("be5bf9", 16));

const gas = 2.150331921e-7;
//
const gasl = 22000;
// console.log(gas * gasl);
const feetot = 0.0047307302261999995;

const out = 0.0167300844389208;
const outtot = feetot + out;
// console.log(outtot); //0.0214608146651208 //totbal
// in db 0.0214608146651208
//0.0214608146651208

const nowgaspriceeth = "0x21179c999e";

const nowgaspint = parseInt(nowgaspriceeth, 16);
console.log(nowgaspint);
const nowgaspinteth = nowgaspint * 0.000000001 * 0.000000001 * 22000;
// console.log(nowgaspint);
// console.log(gas);

console.log("tot fee", nowgaspinteth); //0.0031268613129160007

//132gwei
const needFee = outtot - nowgaspinteth;
// const realBal = parseInt("0x4c3e7f4ab47c20", 16);
// console.log("realbal", realBal);
// console.log("bal", outtot);

// console.log("left bal", needFee);

// console.log(2.150331921 * 0.0000001);

// console.log(0.0167300844389208 + 0.001314601688778416);

const blckNum = parseInt("0xcf9294", 16);

console.log(blckNum);
