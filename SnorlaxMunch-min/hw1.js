function SnorlaxMunch(){function f(){this.menuState={choice:0,picked:false,menuId:undefined};this.ballState={radius:10,top:{arr:[],side:"top"},right:{arr:[],side:"right"},left:{arr:[],side:"left"},bottom:{arr:[],side:"bottom"}};this.gameState={score:0,paused:false,ended:0,level:1,stInt:undefined};this.snorlax={x:a.width/2,y:a.height/2,dx:0,dy:0,rotation:0,zState:0,mouthOpen:false,awakeMeter:d.maxAwakeMeter,awakeMeterDelta:d.awakeMeterRechargeDelta,health:d.maxHealth,radius:50,hit:false}}function h(){g=new f}function j(){clearInterval(g.menuState.menuId);clearInterval(g.gameState.stInt);clearInterval(g.snorlax.sleepToggler);clearInterval(g.snorlax.awakeMeterInterval);V()}function k(){j();h();c.introMenu()}function l(a){r(e[a.keyCode])}function m(a){s(e[a.keyCode])}function n(b){var c=b.pageX-a.offsetLeft;var d=b.pageY-a.offsetTop;var c=g.snorlax.x-c;var d=g.snorlax.y-d;x(Math.atan2(d,c)-Math.PI/2)}function o(a){g.snorlax.mouthOpen=true}function q(a){g.snorlax.mouthOpen=false}function r(a){if(a===undefined){return}switch(a.type){case"move":v(a.value);break;case"game":t(a.value);break;case"menu":u(a.value);break}}function s(a){if(a===undefined||a.type!=="move"){return}w(a.value)}function t(a){switch(a){case"pause":g.gameState.paused=!g.gameState.paused;break;case"restart":if(g.gameState.ended>0){k()}break}}function u(a){switch(a){case"menuup":if(g.menuState.choice>0&&g.menuState.picked===false){g.menuState.choice--}break;case"menudown":if(g.menuState.choice<2&&g.menuState.picked===false){g.menuState.choice++}break;case"menuenter":if(g.menuState.picked===true){break}clearInterval(g.menuState.menuId);g.menuState.picked=true;switch(g.menuState.choice){case 0:W();break;case 1:g.menuState.menuId=setInterval(X,20);break;case 2:Y();break}break;case"menuesc":if(g.menuState.picked===true&&g.menuState.choice===1){clearInterval(g.menuState.menuId);g.menuState.picked=false;g.menuState.menuId=setInterval(Z,20)}break}}function v(a){if(g.gameState.paused){return}switch(a){case"up":g.snorlax.dy=-1*d.snorlaxMoveSpeed;break;case"down":g.snorlax.dy=d.snorlaxMoveSpeed;break;case"left":g.snorlax.dx=-1*d.snorlaxMoveSpeed;break;case"right":g.snorlax.dx=d.snorlaxMoveSpeed;break}}function w(a){if(g.gameState.paused){return}switch(a){case"up":g.snorlax.dy=0;break;case"down":g.snorlax.dy=0;break;case"left":g.snorlax.dx=0;break;case"right":g.snorlax.dx=0;break}}function x(a){g.snorlax.rotation=a}function y(){if(g.snorlax.x+g.snorlax.dx>g.snorlax.radius&&g.snorlax.x+g.snorlax.dx<a.width-g.snorlax.radius){g.snorlax.x+=g.snorlax.dx}if(g.snorlax.y+g.snorlax.dy>g.snorlax.radius&&g.snorlax.y+g.snorlax.dy<a.height-g.snorlax.radius){g.snorlax.y+=g.snorlax.dy}}function z(){b.save();y();b.translate(g.snorlax.x,g.snorlax.y);b.rotate(g.snorlax.rotation);A();b.restore()}function A(){function n(a,b,c,d){a.arc(b,c,d,0,2*Math.PI,true)}var a=0;var c=0;var d=g.snorlax.radius;var e=g.snorlax.mouthOpen;var f=g.snorlax.zState;var h="rgb(178, 173, 131)";var i="black";var j="rgb(46,82,79)";var k="black";var l="white";var m=e===true?"rgb(251, 113, 83)":"black";if(!g.snorlax.hit)b.fillStyle=h;else b.fillStyle="rgb(186, 7, 16)";b.beginPath();n(b,a,c,d);b.fill();b.fillStyle=i;b.fillRect(a-30,c-20,20,5);b.fillRect(a+10,c-20,20,5);b.fillStyle=m;if(e){b.fillRect(a-15,c+10,30,20)}else{b.fillRect(a-15,c+10,30,5)}b.fillStyle=j;b.beginPath();b.moveTo(a-43,c-25);b.lineTo(a-38,c-25-40);b.lineTo(a,c-d);b.arc(a,c,50,-Math.PI/2,3.665,true);b.fill();b.fillStyle=j;b.beginPath();b.moveTo(a+43,c-25);b.lineTo(a+38,c-25-40);b.lineTo(a,c-d);b.arc(a,c,50,-Math.PI/2,-.52,false);b.fill();b.fillStyle=k;b.font="20px Arial";b.textAlign="center";if(!e){if(f===0){b.fillText("Z",a+45,c-55)}else{b.fillText("Z",a+53,c-60)}}b.fillStyle=j;b.beginPath();b.moveTo(a+25,c+43);b.arc(a,c,45,.8,-1.05,true);b.lineTo(a,c-30);b.lineTo(a-22,c-38);b.arc(a,c,45,4.19,2.09,true);b.lineTo(a-16,c+47);b.arc(a,c,50,2.09,1.05,false);b.fill();b.fillStyle=l;b.beginPath();b.moveTo(a-15,c+10);b.lineTo(a-12,c+14);b.lineTo(a-9,c+10);b.fill();b.beginPath();b.moveTo(a+15,c+10);b.lineTo(a+12,c+14);b.lineTo(a+9,c+10);b.fill()}function B(){var a=g.snorlax.health<=100?g.snorlax.health:100;var c=g.snorlax.awakeMeter<=100?g.snorlax.awakeMeter:100;var d=g.gameState.level;var e=g.gameState.score;var f=100;var h=700;var i=100;var j=750;b.fillStyle="red";b.strokeStyle="black";b.lineWidth=3;b.fillRect(f,h,a*8,40);b.strokeRect(f,h,800,40);b.fillStyle="teal";b.fillRect(i,j,c*8,40);b.strokeRect(i,j,800,40);b.fillStyle="black";b.font="25px Arial";b.textAlign="center";b.fillText("LEVEL",50,725);b.fillText(d,50,770);b.fillText("POINTS",950,725);b.fillText(e,950,770);b.fillText("HP",500,725);b.fillText("PP",500,775)}function C(){if(g.ballState.top.arr.length==0&&g.ballState.bottom.arr.length==0&&g.ballState.right.arr.length==0&&g.ballState.left.arr.length==0){g.gameState.level++;console.log(g.gameState.level);return true}else{return false}}function D(a,c){b.fillStyle="green";b.beginPath();b.moveTo(a,c);b.lineTo(a-25,c);b.arc(a-25-45,c,45,0,-.8,true);b.lineTo(a-10,c-15);b.lineTo(a,c-40);b.lineTo(a+10,c-15);b.arc(a+25+45,c,45,Math.PI+.8,Math.PI,true);b.fill()}function E(a,c,d){b.beginPath();b.fillStyle="yellow";b.arc(a,c,5,0,2*Math.PI,true);b.fill();b.fillStyle=d;b.beginPath();b.arc(a+10,c,5,0,2*Math.PI,true);b.fill();b.beginPath();b.arc(a-10,c,5,0,2*Math.PI,true);b.fill();b.beginPath();b.arc(a,c+10,5,0,2*Math.PI,true);b.fill();b.beginPath();b.arc(a,c-10,5,0,2*Math.PI,true);b.fill();b.beginPath();b.arc(a+7,c-7,5,0,2*Math.PI,true);b.fill();b.beginPath();b.arc(a-7,c-7,5,0,2*Math.PI,true);b.fill();b.arc(a+7,c+7,5,0,2*Math.PI,true);b.fill();b.beginPath();b.arc(a-7,c+7,5,0,2*Math.PI,true);b.fill();b.strokeStyle="green";b.lineWidth=6;b.beginPath();b.moveTo(a,c+15);b.lineTo(a,c+25);b.lineTo(a+2,c+26);b.lineTo(a-2,c+26);b.closePath();b.stroke()}function F(){b.fillStyle="lightgreen";b.fillRect(0,0,a.width,a.height);D(50,50);D(556,600);D(311,411);D(637,200);D(392,650);D(150,300);D(150,620);D(400,110);D(500,320);D(800,90);D(750,430);D(850,570);E(110,120,"red");E(410,150,"purple");E(240,560,"gold");E(710,320,"blue");E(850,480,"pink")}function H(a,b,c,d,e){e(a);e(b);e(c);e(d)}function I(){g.snorlax.sleepToggler=setInterval(function(){g.snorlax.zState=(g.snorlax.zState+1)%2},500)}function J(){g.snorlax.awakeMeterInterval=setInterval(function(){if(g.snorlax.mouthOpen){g.snorlax.awakeMeterDelta=d.awakeMeterDrainDelta}else{g.snorlax.awakeMeterDelta=d.awakeMeterRechargeDelta}g.snorlax.awakeMeter+=g.snorlax.awakeMeterDelta;if(g.snorlax.awakeMeter<=0){g.snorlax.awakeMeter=0;g.snorlax.mouthOpen=false}else if(g.snorlax.awakeMeter>=100){g.snorlax.awakeMeter=100}},10)}function K(b,c,d,e,f,g,h){this.canvas=a;this.ctx=a.getContext("2d");this.radius=d;this.x=b;this.y=c;this.dx=e;this.dy=f;this.side=g;this.created=h}function L(b,c,d,e,f,g,h){K.call(this,b,c,d,e,f,g,h);this.canvas=a;this.ctx=a.getContext("2d")}function M(){var b=0;var c=0;var d=Math.floor(Math.random()*5)+1;var e=Math.floor(Math.random()*5)+1;if(g.gameState.level==1||g.gameState.level==2){d=3;e=3}while(b<800){b+=g.ballState.radius+150;switch(g.gameState.level){case 1:g.ballState.top.arr.push(new K(b,-11,10,Math.floor(Math.random()*5)+1,Math.floor(Math.random()*5)+1,"top",false));break;case 2:g.ballState.top.arr.push(new K(b,-11,10,Math.floor(Math.random()*5)+1,Math.floor(Math.random()*5)+1,"top",false));break;case 3:g.ballState.top.arr.push(new K(b,-11,10,Math.floor(Math.random()*5)+1,Math.floor(Math.random()*5)+1,"top",false));break;case 4:g.ballState.top.arr.push(new K(b,-11,10,Math.floor(Math.random()*5)+1,Math.floor(Math.random()*5)+1,"top",false));break}}while(c<600){c+=g.ballState.radius+150;switch(g.gameState.level){case 1:break;case 2:g.ballState.right.arr.push(new L(a.width+11,c,10,Math.floor(Math.random()*5)+1,Math.floor(Math.random()*5)+1,"right",false));break;case 3:break;case 4:g.ballState.right.arr.push(new L(a.width+11,c,10,Math.floor(Math.random()*5)+1,Math.floor(Math.random()*5)+1,"right",false));g.ballState.left.arr.push(new L(-11,c+100,10,Math.floor(Math.random()*5)+1,Math.floor(Math.random()*5)+1,"left",false));break}}}function N(){b.textAlign="center";b.textBaseline="middle";b.font="bold 20px sans-serif";b.fillStyle="rgba(0, 0, 0, 0.6)";b.fillRect(0,0,1e3,800);b.fillStyle="orange";b.fillText("Hit P to resume.",500,500)}function O(){if(!g.gameState.ended&&g.snorlax.health<=0){g.gameState.ended=1}}function P(){b.textAlign="center";b.textBaseline="middle";b.font="bold 20px sans-serif";b.fillStyle="rgba(0, 0, 0, 0.6)";b.fillRect(0,0,1e3,800);b.fillStyle="orange";b.fillText("Game Over!",500,300);b.fillText("You've been caught!",500,350);b.fillText("Hit R to restart",500,450)}function Q(){if(g.gameState.level==4&&g.ballState.top.arr.length==0&&g.ballState.bottom.arr.length==0&&g.ballState.right.arr.length==0&&g.ballState.left.arr.length==0){g.gameState.ended=2}}function R(){b.textAlign="center";b.textBaseline="middle";b.font="bold 20px sans-serif";b.fillStyle="rgba(0, 0, 0, 0.6)";b.fillRect(0,0,1e3,800);b.fillStyle="orange";b.fillText("You won, you've eaten all the Pokeballs!",500,300);b.fillText("SCORE",500,350);b.fillText(g.gameState.score,500,400);b.fillText("Hit R to restart",500,500)}function S(){b.clearRect(0,0,a.width,a.height)}function T(){S();F();switch(g.gameState.ended){case 0:if(!g.gameState.paused){B();z();if(C()){M()}H(g.ballState.top,g.ballState.left,g.ballState.right,g.ballState.bottom,G);O();Q()}else{N()}break;case 1:P();break;case 2:R();break}}function U(){a.addEventListener("keydown",l,false);a.addEventListener("keyup",m,false);a.addEventListener("mousemove",n,false);a.addEventListener("mousedown",o,false);a.addEventListener("mouseup",q,false)}function V(){a.removeEventListener("keydown",l);a.removeEventListener("keyup",m);a.removeEventListener("mousemove",n);a.removeEventListener("mousedown",o);a.removeEventListener("mouseup",q)}function W(){I();J();M();T();g.gameState.stInt=setInterval(T,20);a.setAttribute("tabindex","0");a.focus()}function X(){S();F();b.textAlign="center";b.textBaseline="middle";b.font="bold 100px sans-serif";b.fillStyle="indigo";b.fillText("Snorlax Munch",500,100);b.font="bold 20px sans-serif";b.fillStyle="rgba(0, 0, 0, 0.6)";b.fillRect(0,0,1e3,800);b.fillStyle="white";b.fillText("Use WASD to Move, and the mouse to rotate.",500,300);b.fillText("Click to open Snorlax's Mouth.",500,350);b.fillText("P to pause the game",500,400);b.fillText("Eat as many pokeballs as you can.",500,450);b.fillText("But be careful, if you get hit anywhere but your mouth, you lose health.",500,500);b.fillText("Now go show that trainer who is the boss.",500,550);b.fillStyle="orange";b.fillText("Hit Esc to go back to the Menu.",500,600)}function Y(){S();F();b.textAlign="center";b.textBaseline="middle";b.font="bold 40px sans-serif";b.fillStyle="rgba(0, 0, 0, 0.6)";b.fillRect(0,0,1e3,800);b.fillStyle="white";b.fillText("Without your help, Snorlax was captured.",500,300);b.fillText("Hope you're happy.",500,500)}function Z(){S();F();b.textAlign="center";b.textBaseline="middle";b.font="bold 100px sans-serif";b.fillStyle="indigo";b.fillText("Snorlax Munch",500,100);b.font="bold 20px sans-serif";b.fillStyle="black";b.fillText("Use UP/DOWN to Navigate and Enter to Pick.",500,220);b.font="bold 50px sans-serif";b.fillStyle="black";b.fillRect(390,265,220,60);b.fillStyle="lightgrey";b.fillText("Play!",500,300);b.fillStyle="black";b.fillRect(390,365,220,60);b.fillStyle="lightgrey";b.fillText("Controls",500,400);b.fillStyle="black";b.fillRect(390,465,220,60);b.fillStyle="lightgrey";b.fillText("Quit",500,500);b.strokeStyle="orange";b.strokeRect(392,268+100*g.menuState.choice,215,55)}var a=document.getElementById("myCanvas"),b=a.getContext("2d");var c=this;var d={pointsPerPokeballEaten:10,damagePerPokeballHit:25,maxHealth:100,maxAwakeMeter:100,awakeMeterRechargeDelta:1,awakeMeterDrainDelta:-1,snorlaxMoveSpeed:5};var e={87:{type:"move",value:"up"},65:{type:"move",value:"left"},83:{type:"move",value:"down"},68:{type:"move",value:"right"},80:{type:"game",value:"pause"},82:{type:"game",value:"restart"},38:{type:"menu",value:"menuup"},40:{type:"menu",value:"menudown"},13:{type:"menu",value:"menuenter"},27:{type:"menu",value:"menuesc"}};var g=new f;var G=function(a){for(i in a.arr){a.arr[i].Create();switch(a.side){case"top":a.arr[i].y+=a.arr[i].dy;if(g.gameState.level==3||g.gameState.level==4){a.arr[i].x+=a.arr[i].dx}break;case"bottom":a.arr[i].y-=a.arr[i].dy;if(g.gameState.level==3||g.gameState.level==4){a.arr[i].x-=a.arr[i].dx}break;case"right":a.arr[i].x-=a.arr[i].dx;if(g.gameState.level==3||g.gameState.level==4){a.arr[i].y-=a.arr[i].dy}break;case"left":a.arr[i].x+=a.arr[i].dx;if(g.gameState.level==3||g.gameState.level==4){a.arr[i].y+=a.arr[i].dy}break}a.arr[i].Bounce();if(a.arr[i].Collide()){if(i===0)a.arr.splice(0,1);else a.arr.splice(i,1);setTimeout(function(){g.snorlax.hit=false},1e3)}}};K.prototype.Create=function(){this.ctx.beginPath();this.ctx.fillStyle="red";this.ctx.lineWidth="2";this.ctx.arc(this.x,this.y,this.radius,0,3*Math.PI,true);this.ctx.fill();this.ctx.stroke();this.ctx.closePath();this.ctx.beginPath();this.ctx.fillStyle="white";this.ctx.lineWidth="2";this.ctx.arc(this.x,this.y,this.radius,Math.PI,0,true);this.ctx.fill();this.ctx.stroke();this.ctx.closePath();this.ctx.beginPath();this.ctx.moveTo(this.x,this.y);this.ctx.lineTo(this.x-this.radius,this.y);this.ctx.moveTo(this.x,this.y);this.ctx.lineTo(this.x+this.radius,this.y);this.ctx.stroke();this.ctx.closePath();this.ctx.beginPath();this.ctx.fillStyle="white";this.ctx.lineWidth="2";this.ctx.arc(this.x,this.y,this.radius/6.25,0,Math.PI*4,true);this.ctx.fill();this.ctx.stroke();this.ctx.closePath()};L.prototype=new K;L.prototype.constructor=L;L.prototype.Create=function(){this.ctx.beginPath();this.ctx.fillStyle="blue";this.ctx.lineWidth="2";this.ctx.arc(this.x,this.y,this.radius,0,3*Math.PI,true);this.ctx.fill();this.ctx.stroke();this.ctx.closePath();this.ctx.beginPath();this.ctx.fillStyle="white";this.ctx.lineWidth="2";this.ctx.arc(this.x,this.y,this.radius,Math.PI,0,true);this.ctx.fill();this.ctx.stroke();this.ctx.closePath();this.ctx.beginPath();this.ctx.moveTo(this.x,this.y);this.ctx.lineTo(this.x-this.radius,this.y);this.ctx.moveTo(this.x,this.y);this.ctx.lineTo(this.x+this.radius,this.y);this.ctx.stroke();this.ctx.closePath();this.ctx.beginPath();this.ctx.fillStyle="black";this.ctx.lineWidth="2";this.ctx.arc(this.x,this.y,this.radius/6.25,0,Math.PI*4,true);this.ctx.fill();this.ctx.stroke();this.ctx.closePath()};K.prototype.Bounce=function(){if(this.side=="top"){if(this.y>=a.height){this.dy*=-1;this.created=true}if(this.x>=a.width){this.dx*=-1;this.created=true}if(this.y<=this.radius&&this.created){this.dy*=-1}if(this.x<=this.radius){this.dx*=-1}}else if(this.side=="bottom"){if(this.y<=this.radius){this.dy*=-1;this.created=true}if(this.x>=a.width){this.dx*=-1;this.created=true}if(this.y>=a.height&&this.created){this.dy*=-1}if(this.x<=this.radius){this.dx*=-1}}else if(this.side=="right"){if(this.x<=this.radius){this.dx*=-1;this.created=true}if(this.y>=a.height){this.dy*=-1}if(this.x>=a.width&&this.created){this.dx*=-1}if(this.y<=this.radius){this.dy*=-1}}else{if(this.x>=a.width){this.dx*=-1;this.created=true}if(this.y>=a.height){this.dy*=-1}if(this.x<=this.radius&&this.created){this.dx*=-1}if(this.y<=this.radius){this.dy*=-1}}};K.prototype.Collide=function(){function c(a,b,c){return.5*(b.x*c.y-b.y*c.x-a.x*c.y+a.y*c.x+a.x*b.y-a.y*b.x)}function e(a){return a<0?-1:1}var a=Math.sqrt(Math.pow(this.x-g.snorlax.x,2)+Math.pow(this.y-g.snorlax.y,2));var b=this.radius+g.snorlax.radius;mouthP=[{x:g.snorlax.x-15,y:g.snorlax.y+10},{x:g.snorlax.x-15,y:g.snorlax.y+30},{x:g.snorlax.x+15,y:g.snorlax.y+30},{x:g.snorlax.x+15,y:g.snorlax.y+10}];this.rotatePoint=function(a){return{x:Math.cos(g.snorlax.rotation)*(a.x-g.snorlax.x)-Math.sin(g.snorlax.rotation)*(a.y-g.snorlax.y)+g.snorlax.x,y:Math.sin(g.snorlax.rotation)*(a.x-g.snorlax.x)+Math.cos(g.snorlax.rotation)*(a.y-g.snorlax.y)+g.snorlax.y}};mouthPTrans=mouthP.map(this.rotatePoint);p={x:this.x,y:this.y};detSigns=[e(c(mouthPTrans[0],mouthPTrans[1],p)),e(c(mouthPTrans[1],mouthPTrans[2],p)),e(c(mouthPTrans[2],mouthPTrans[3],p)),e(c(mouthPTrans[3],mouthPTrans[0],p))];if(g.snorlax.mouthOpen){if(detSigns[0]===detSigns[1]&&detSigns[1]===detSigns[2]&&detSigns[2]===detSigns[3]){g.gameState.score+=d.pointsPerPokeballEaten;return true}}else{if(a<=b){g.snorlax.health-=d.damagePerPokeballHit;if(g.snorlax.health<0){g.snorlax.health=0}g.snorlax.hit=true;return true}}};this.introMenu=function(){U();Z();g.menuState.menuId=setInterval(Z,20);a.setAttribute("tabindex","0");a.focus()}}var snorlaxGame=new SnorlaxMunch;snorlaxGame.introMenu()