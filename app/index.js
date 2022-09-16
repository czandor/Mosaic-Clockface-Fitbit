import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import * as C from "../common/const";
import { units} from "user-settings";
import { user } from "user-profile";
import { today as todayActivity } from "user-activity";
import { primaryGoal } from "user-activity";
import { goals } from "user-activity";

import { me } from "appbit";
import { display } from "display";

import { vibration } from "haptics";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { battery } from "power";
import { charger } from "power";
import { me as device } from "device";
util.setDevice(device);

// Update the clock every minute
clock.granularity = "minutes";
  

const dataHolder = document.getElementById("dataHolder");
const button = document.getElementById("button");
const datumBg = document.getElementById("datumBg");
const datumText1 = document.getElementById("datumText1");
const datumText2 = document.getElementById("datumText2");
const datumText3 = document.getElementById("datumText3");
const infoBg = document.getElementById("infoBg");
const infoIcon = document.getElementById("infoIcon");
const infoText = document.getElementById("infoText");

let bodyPresent=false;
let hrbpm=0;
let hrm=null;
let body=null;
let forceRedraw=true;

let showData=C.DataNone;

button.addEventListener("click", (evt) => { 
  vibration.stop();
  vibration.start("bump")
  showData++;
  if(device.noBarometer && showData==C.DataFloors) showData++;
  if(showData >= C.DataMax) showData=C.DataNone;
  drawData();
});
battery.onchange=function(evt){updateBattery();};
charger.onchange=function(evt){updateBattery();};

if (me.permissions.granted("access_heart_rate")) {
  if (HeartRateSensor) {
    hrm = new HeartRateSensor({ frequency: 1 });
    hrm.addEventListener("reading", () => {
      //if(LOG) log("Current heart rate: " + hrm.heartRate);
      hrbpm = hrm.heartRate;
      updateHR();
      //drawDelayed();
    });
    hrm.start();
  }
  if (BodyPresenceSensor) {
    body = new BodyPresenceSensor();
    body.addEventListener("reading", () => {
      bodyPresent=body.present;
      //updateHR();
      if (!bodyPresent) {
        hrm.stop();
      } else {
        hrm.start();
      }
      //drawDelayed();
    });
    body.start();
  }
  
  
  //if(LOG) log("Started heart rate: " + JSON.stringify(hrm));
}
else{
  //if(LOG) log("Heart rate not started, no permission");
}
let mosaicState=[];
for(let i=0 ; i < (C.ledRows*C.ledRows) ; i++) mosaicState[i]=C.MosaicStateColor;

display.onchange = function() {
  //let today = new Date();
  //log("display.on: "+display.on);
  //log("aodAllowed: "+display.aodAllowed);
  //log("aodAvailable: "+display.aodAvailable);
  //log("aodEnabled: "+display.aodEnabled);

  if (!display.on) { //képernyő KIKAPCSOLVA 
    onDisplayOff();
  }
  else{ //képernyő BEKAPCSOLVA
    onDisplayOn();
   }
}

function onDisplayOn(){
    //log("képernyő bekapcs, actualPet: "+actualPet);
    //if(util.getRandomInt(0,50) == 0) bgdeath.animate("enable");
    //refreshScreen(new Date());
    if(hrm) hrm.start();
    if(body) body.start();
    tick();
}
let reDrawTimer=null;
function onDisplayOff(){
    //log("képernyő kikapcs");
    if(hrm) hrm.stop();
    if(body) body.stop();
    if(reDrawTimer) clearTimeout(reDrawTimer);
    reDrawTimer=null;
    forceRedraw=true;
    showData=C.DataNone;
    drawData();
    stopSeconds();
    for(let i=0 ; i < (C.ledRows*C.ledRows) ; i++) {
      if(mosaicState[i] == C.MosaicStateBlack) {
        document.getElementById("led-"+i).style.fill=getRandomColor();
          //document.getElementById("led-"+i).style.opacity=1;
        mosaicState[i] = C.MosaicStateColor;
      }
    }
}
let secondsTimer=null;
function startSeconds(){
  stopSeconds();
  //return;
  //let today=new Date();
  //setTimeout(function(){
    //updateSeconds();
    secondsTimer = setInterval(function(){
      updateSeconds();
    },1000);
  //},1000-today.getMilliseconds());
}
function stopSeconds(){
  if(secondsTimer) clearInterval(secondsTimer);
  secondsTimer=null;
}
function updateSeconds(){
  //tick();
  for(let a=1 ; a <= C.ledChangeNum ; a++) changeLED(a);
}
function tick(){
  let today = new Date();
 
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    //hours = util.zeroPad(hours);
  }
  //let mins = util.zeroPad(today.getMinutes());
  let mins = (today.getMinutes());
  //myLabel.text = `${hours}:${mins}`;
  //mins=today.getSeconds();
  let mosaicStateOld=[];
  for(let i=0 ; i < (C.ledRows*C.ledRows) ; i++) {
    mosaicStateOld[i]=mosaicState[i];
    if(mosaicState[i] != C.MosaicStateColor) mosaicState[i] = C.MosaicStateToColor;
  }
  //hours=4;
  //mins-=3;
  
  const h1=Math.floor(hours/10);
  const h2=Math.round(hours%10);
  const m1=Math.floor(mins/10);
  const m2=Math.round(mins%10);
  drawNum(h1,1,0);
  //drawNum(h2,2,(h1==1)?-1:((h1==4)?1:0));
  drawNum(h2,2,C.matrixNums[h1].length-5);
  drawNum(m1,3,0);
  drawNum(m2,4,C.matrixNums[m1].length-5);
  for(let i=0 ; i < (C.ledRows*C.ledRows) ; i++) {
    if(mosaicStateOld[i] == C.MosaicStateBlack && mosaicState[i] == C.MosaicStateToBlack) mosaicState[i] = C.MosaicStateBlack;
  }
  
  //if(!display.on) forceRedraw=true;
  reDrawTimer=setTimeout(function(){
    drawData();
    if(forceRedraw) {
        forceRedraw=false;
        for(let i=0 ; i < (C.ledRows*C.ledRows) ; i++) {
          if(mosaicState[i] == C.MosaicStateToBlack){
            document.getElementById("led-"+i).style.fill=getRandomColor(true);//"black";
            //document.getElementById("led-"+i).style.opacity=0.15;
            mosaicState[i] = C.MosaicStateBlack;
          }
          if(mosaicState[i] == C.MosaicStateToColor) {
            document.getElementById("led-"+i).style.fill=getRandomColor();
            //document.getElementById("led-"+i).style.opacity=1;
            mosaicState[i] = C.MosaicStateColor;
          }
        }
    }
    //setTimeout(function(){changeLED();},500);
    //updateSeconds();
  },(device.performance==1)?250:1);
  stopSeconds();
  if(display.on) startSeconds();
}
clock.ontick = (evt) => {
  let today = evt.date;
  tick();

}
function in_array(haystack,needle){
  for(let a=0 ; a < haystack.length ; a++) if(haystack[a] == needle) return true;
  return false;
}
function changeLED(number,counter){
  const objId="led-opacity-"+number;
  if(!counter) counter=0;
  if(counter > 10) return false;
  let i=util.getRandomInt(0,C.ledRows*C.ledRows-1);
  
  let point=generatePoint(i);
  i=point.i;
  let c=point.c;
  
  let col=Math.floor(i%C.ledRows);//util.getRandomInt(0,C.ledRows-1);
  let row=Math.floor(i/C.ledRows);//util.getRandomInt(0,C.ledRows-1);
  if(deadLED(col,row)) {
    return changeLED(number,counter+1);
  }
  //let i=row*C.ledRows+col;
  let x=col*(C.drawSize/C.ledRows);
  let y=row*(C.drawSize/C.ledRows);
  log('col:'+col+', row:'+row+', c:'+c+', x:'+x+', y:'+y);
  //document.getElementById("led-"+i).animate("disable");
  document.getElementById(objId).x=x;
  document.getElementById(objId).y=y;
  
  setTimeout(function(){
    document.getElementById(objId).animate('enable');
    setTimeout(function(){
      document.getElementById("led-"+i).style.fill=c;
      //document.getElementById("led-"+i).animate("enable");
      document.getElementById(objId).animate('disable');
    },200);
  },50);
  
  
  return true;
}
function generatePoint(i){
  let c=getRandomColor(); 

  for(let ii=0 ; ii < (C.ledRows*C.ledRows) ; ii++){
    if(mosaicState[ii]==C.MosaicStateToColor){
      i=ii;
      mosaicState[ii]=C.MosaicStateColor;
      log("MosaicStateToColor, i:"+i+"");
      break;
      //ii=C.ledRows*C.ledRows;
    }
    if(mosaicState[ii]==C.MosaicStateToBlack){
      i=ii;
      //c=getRandomColor(true);//"black";
      mosaicState[ii]=C.MosaicStateBlack;
      log("MosaicStateToBlack, i:"+i+"");
      break;
      //ii=C.ledRows*C.ledRows;
    }
    
    if(i==ii && (mosaicState[ii]==C.MosaicStateBlack || mosaicState[ii]==C.MosaicStateToColor)) return generatePoint(i+1);
  }
  if(mosaicState[i]==C.MosaicStateBlack) c=getRandomColor(true);//"black";
  return {"i":i,"c":c};
}
function drawNum(num,position,offset){
  if(!offset) offset=0;
  let x=3;
  let y=2;
  if(position == 2){
    x=9;
  }
  if(position == 3){
    x=6;
    y=11;
  }
  if(position == 4){
    x=12;
    y=11;
  }
  x+=offset;
  for(let col=0 ; col < C.matrixNums[num].length ; col++){
    let mask=C.matrixNums[num][col];
    for(let row=0 ; row < C.matrixRows ; row++){
      if(getBit(mask, row)) {
        let i=(row+y)*C.ledRows+(col+x);
        //document.getElementById("led-"+i).style.fill="black";
        if(mosaicState[i]!=C.MosaicStateBlack) mosaicState[i]=C.MosaicStateToBlack;
      }
    }
  }
}
function getBit(number, bitPosition) {
  return (number & (1 << bitPosition)) === 0 ? 0 : 1;
}
let randomCounter=0;
function getRandomColor(dark){
  randomCounter++;
  let rgb=Math.floor(randomCounter/(400));
  //console.log(randomCounter+" "+rgb);
  if(rgb > 2) randomCounter=rgb=0;
  //dark=false;
  let defaultColor="#EEEEEE";
  if(!dark) dark=false;
  else defaultColor="#222222";
  
  let letters = [(dark)?'0000011111222223':'0123456789ABCDEF','0123456789ABCDEF'];
  //let letters = [(dark)?'0000011111222223':'0123456789ABCDEF','0123456789ABCDEF'];
  //let letters = [(dark)?'0000001111122222':'23456789ABCDEEFF','0123456789ABCDEF'];
  //let letters = [(dark)?'0000001111122222':'23456789ABCDEEFF','0123456789ABCDEF'];
  for(let counter=0 ; counter < 10 ; counter++){
    let c_i=[Math.floor(Math.random() * 16),Math.floor(Math.random() * 16),Math.floor(Math.random() * 16),Math.floor(Math.random() * 16),Math.floor(Math.random() * 16),Math.floor(Math.random() * 16)];
    //let brightness = (((c_i[0]*16+c_i[1]) * 299) + ((c_i[2]*16+c_i[3]) * 587) + ((c_i[4]*16+c_i[5]) * 114)) / 1000;
    if(!dark) c_i[rgb*2]=Math.min(15,c_i[rgb*2]*3);
    let brightness = Math.sqrt(
    0.299 * ((c_i[0]*16+c_i[1]) * (c_i[0]*16+c_i[1])) +
    0.587 * ((c_i[2]*16+c_i[3]) * (c_i[2]*16+c_i[3])) +
    0.114 * ((c_i[4]*16+c_i[5]) * (c_i[4]*16+c_i[5]))
    );
    let color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[(i%2)][c_i[i]];
    }
    if(false) log("counter: "+counter+", color: "+color+", dark: "+dark+", brightness: "+brightness);
    //return color;
    if(!dark && brightness > 127.5) return color;
    if(dark) return color;
    if(dark) return "black";
    if(dark && brightness < 30) return color;
  }
  return defaultColor;
  /*let vivid=true;
  return C.colors[util.getRandomInt(0,C.colors.length-1)].getColor(vivid);*/
}

function deadLED(col,row){
  for(let i=0 ; i < C.corners.length ; i++) if ((C.corners[i][0]==col && C.corners[i][1]==row)) return true;
  return false;
}
function log(message){
  if(C.APP_LOG) console.log(message);
}
function drawData(){

  if(showData==C.DataNone){
    dataHolder.style.display="none";
    return;
  }
  dataHolder.style.display="inline";
  
  let today = new Date();
  
  datumText3.text=C.WEEKDAYS_DEFAULT[today.getDay()]
  datumText2.text=(today.getDate());
  datumText1.text=C.MONTHNAMES_DEFAULT[today.getMonth()];
  
  
  let number=0;
  let icon="";
  switch (showData){
    case C.DataBatt:
      number=Math.floor(battery.chargeLevel);
      let charging=(battery.charging || charger.connected);
      let icons=    ["battery_0","battery_2","battery_2","battery_3","battery_3","battery_4","battery_4","battery_5","battery_5","battery_6","battery_7",    "battery_8"];
      icon=icons[charging?11:Math.round(number/10)];
      number+="%";
      break;
    case C.DataHR:
      number=hrbpm;
      if(!bodyPresent) number="--";
      icon="hr";
      break;
    case C.DataSteps:
      number=(todayActivity.adjusted.steps || todayActivity.local.steps || 0);
      //if(number >= 10000) number=(number/1000).toFixed(1)+"k";
      icon="steps";
      break;
    case C.DataDist:
      number=(todayActivity.adjusted.distance || todayActivity.local.distance || 0);
      //if(number >= 10000) number=(number/1000).toFixed(1)+"k";
      icon="dist";
      break;
    case C.DataAZM:
      number=((todayActivity.adjusted.activeZoneMinutes || todayActivity.local.activeZoneMinutes || {total:0}).total);
      if(!number) number=0;
      //if(number >= 10000) number=(number/1000).toFixed(1)+"k";
      icon="azm";
      break;
    case C.DataCals:
      number=(todayActivity.adjusted.calories || todayActivity.local.calories || 0);
      //if(number >= 10000) number=(number/1000).toFixed(1)+"k";
      icon="cals";
      break;
    case C.DataFloors:
      number=(todayActivity.adjusted.elevationGain || todayActivity.local.elevationGain || 0);;
      //if(number >= 10000) number=(number/1000).toFixed(1)+"k";
      icon="floors";
      break;
  }
  if(icon){
    infoIcon.href="images/"+icon+".png";
    infoText.text=number;
  }
  else{
    showData=C.DataNone;
    drawData();
  }
}
function updateHR(){
  if(showData==C.DataHR) drawData();
}
function updateBattery(){
  if(showData==C.DataBatt) drawData();
}
/*
setTimeout(function(){
  for(let row=0 ; row < C.ledRows ; row++) for(let col=0 ; col < C.ledRows ; col++) if(!deadLED(col,row)){
    let i=(row*C.ledRows+col);
    document.getElementById("led-"+i).style.fill=getRandomColor();
    isBlack[i]=false;
  }
},100);
*/