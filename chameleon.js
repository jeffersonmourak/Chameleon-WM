//---------------------------init--------------------------------------------
/*
   Developed by EasyJS
   Last modifier: Lucas Vendramini & Jefferson Moura - 2014
*/
//-------------------------map of windows------------------------------------

function Global(){
  var windows = []
  return {
    addWindow : function(obj,title,icon){
      windows[windows.length] = {id : "w"+windows.length , zindex : windows.length , object : obj , title : title , icon : icon};
      return "w"+(windows.length - 1);
    },
    /*-----------------------remove a janela do mapa------------------------------*/ 
    removeWindow : function(wId){
      var indexOf = -1;
      for(var i = 0; i < windows.length; i+=1){
        if(windows[i].id == wId){
          indexOf = i;
          break;
        }
      }
      windows.splice(indexOf,1);
    },
    /*-----------------------modifica o z-index da janela -----------------------*/
    changeZindex : function(wId){
      var backup;
      var index;
      for(var i = 0; i < windows.length; i+=1){
        if(windows[i].id == wId){
          index = i;
          backup = windows[i];
          break;
        }
      }
      for(var i = 0; i < windows.length; i+=1){
        if(windows[i].zindex > windows[index].zindex){
          windows[i].zindex -= 1;
        }
      }
      windows.splice(index,1);
      backup.zindex = windows.length;
      windows[windows.length] = backup;
      for(var i = 0; i < windows.length; i+=1){
        windows[i].object.style.zIndex = windows[i].zindex;
        this._stylize(wId);
      }
    },
    /*-----------------------modifica a classe das janelas -----------------------*/
    _stylize : function(wId){
      for(var i = 0; i < windows.length; i+=1){
        if(windows[i].id == wId){
          windows[i].object.className = "window noselect active";
        }
        else{
          windows[i].object.className = "window noselect inactive";
        }
      }
      var changeFocus = new Event("changeWindowFocus");
      document.dispatchEvent(changeFocus);
    },
    /*-----------------------Lista as informações das janelas abertas-----------------------*/
    list : function(){
      var windowList = [];
      for(var i = 0; i < windows.length; i+=1){
        var active = false;
        if(windows[i].object.className.indexOf(" active") > -1){
          active = true;
        }
        windowList[i] = {id : windows[i].id, active : active,title:windows[i].title,icon:windows[i].icon};
      }
      return windowList;
    },
  };
}
global = new Global();

//---------------------------init--------------------------------------------

window.addEventListener("load", function(){

//-------------------Disable Text selection ---------------------------------

    var head = document.querySelector("head");
    var style = document.createElement('style');
    style.innerHTML = ".noselect{-webkit-touch-callout: none;\n-webkit-user-select: none;\n-khtml-user-select: none;\n-moz-user-select: none;\n-ms-user-select: none;\nuser-select: none;}";
    var css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "window.css";
    head.appendChild(style);
    head.appendChild(css);

//-------------------CGButton - Chameleon Generic button----------------------
    
    function CGButton(height, width, color, barGradient, radius, bSize, fSize, parent, bContent, clickEvent, 
      actionObj){
   
       this.height = height || 30; //altura do botão
       this.width = width || 30; //largura do botão
       this.color = color || "#f00";//cor do botão
       
       this.barGradient = barGradient || "linear-gradient(red, #faa)";
       
       this.radius = radius || 5;//raio da borda do botão
       this.bSize = bSize || 2;//espessura da borda
       
       this.fSize = fSize || 15;//tamanho da fonte;
       
       this.parent = parent || document.body;//pai do objeto
       this.bContent = bContent || "";//conteúdo do objeto;
       this.clickEvent = clickEvent || null;//função realizada ao clicar no botão
       
       this.actionObj = actionObj || false; /*objeto que será acionado caso
         tenha a necessidade para a realização do evento
       
       */
    }

/*---------------------create method of CGButton-------------------------------*/
   
   CGButton.prototype.create = function(){
   
      var button = document.createElement("BUTTON");          
      
      var actObj =  this.actionObj;
      button.textContent = this.content;
      if(this.clickEvent == "close"){      
          button.className = "close";
         button.addEventListener("click",function(){
                  
            actObj.destroy();                  
         });            
      }
      else{
        button.style.height = this.height + "px";
        button.style.width = this.width + "px";
        button.className = "button"; 
      }
      
      if(actObj.barAlign == true){//bar align caso ativado
      
         button.style.right = "0px";         
      }
      else{
          button.style.left = "0px";
      }        
      
      this.parent.appendChild(button);  
   }

/*--------------------objeto CDialog - Chameleon Dialog----------------------*/

   function CDialog(msg, title , option, barAlign, barColor){
         
      this.msg = msg || "Are you sure?";
      
      this.title = title || "Message";//título do dialog
      this.option = option || "yesno";    //tipo do dialog
      this.barAlign = barAlign || false;//alinhamento dos icones da barra
      
      this.barColor = barColor || "#f00";//cor da barra
                 
   }
      
   CDialog.prototype.create = function(){
   
      var dia = new CWindow(180, 280);
      
      dia.hStretch = dia.vStretch = false;
      dia.title = this.title;
                
      dia.barAlign = this.barAlign;      
        
      dia.create(); 
      if (this.option == "yesno"){
            
         dia.appendContent(this.msg, true, true);     
         dia.divMargin = 20;     
              
//-------------------------botão yes------------------------------------*/              
         var yes = new CGButton(50, 100);
         
         yes.parent = dia.innerDiv;
                           
         yes.content = "Yes";         
         yes.create();
      
      
/*------------------------botão no---------------------------------------*/      
      
         var no = new CGButton(50, 100);
         
         no.parent = dia.innerDiv;
                           
         no.content = "No";         
         no.create();
                  
      }           
   }
/*----------------------objeto CWindow - Chameleon Window--------------------*/   
   
   function CWindow(height, width, color, radius, bSize, drag, hStretch, vStretch, 
      barAlign, barColor, barGradient , parent, content, title, icon, divMargin, 
      posX, posY){

      this.height = height || 480; //altura da janela
      this.width = width || 640; //largura da janela
      this.color = color || "#aaa";//cor da janela
      this.radius = radius || 10;//raio da borda da janela
      
      this.bSize = bSize || 5; //espessura da borda;
      
      this.drag = drag || true;//arraste desativado/ativado
      
      this.hStretch = hStretch || true;//ajuste horizontal da janela
      this.vStretch = vStretch || true;//ajuste vertical da janela
      
      this.barAlign = barAlign || false//false - icones a esquerda, true - direita
      this.barColor = barColor || "#00f"//false - icones a esquerda, true - direita
            
      this.parent = parent || document.body;// null - body, else - elemento pai

      this.content = content || "";//conteúdo da janela - ver método append
      
      this.title = title || "Janela Vazia"; //título da janela    
      this.icon = icon || "icon.png";
      this.barGradient = barGradient || 
         "linear-gradient("+ this.barColor+ ", black)";    
      
      this.divMargin = divMargin || 5;   //margin
      
      this.posX = posX || 0;//posição da janela, eixo x
      this.posY = posY || 0;//posição da janela, eixo y     
   }    

//------------------------create method of CWindow---------------------------*/
   CWindow.prototype.create = function(){

      var winObj = document.createElement("DIV");

      winObj.className = "noselect window";
      winObj.style.height = this.height + "px";
      winObj.style.width = this.width + "px";
      if(this.barAlign){

      }
      this.id = global.addWindow(winObj,this.title,this.icon); //gerador de ID;
      var id = this.id; //põe o ID no escopo local
      global.changeZindex(id);
/*---------------------------div de conteudo---------------------------------*/           
      var divContent = document.createElement("DIV");
            
      divContent.textContent = this.content;
                   
      divContent.style.position = "relative";     
      divContent.style.margin = this.divMargin + "px";
                    
      winObj.style.position = "absolute";//"absolute";

      var lmb = false; //sensor do botão esquerdo do mouse
      var resize = false; //resize ativo
      var pResize = 0.8;//proporção de resize em %
      
      var oldPosition = {
        x: 0,
        y: 0
      };
      
      var obj = this;      
      
      this.innerDiv = divContent;
      //console.log(divContent);


//-------------------append content method of CWindow-------------------------

      CWindow.prototype.appendContent = function(html, newline, after){
         
         if(newline && after){
         
            divContent.innerHTML += html + "<br />"; 
         }     
              
              
         else if(newline){//caso newline, quebra de linha
            divContent.innerHTML += "<br />" + html;     
         }        
         
         else{
            divContent.textContent += html;//concatena conteúdo
         }
      }    

      winObj.addEventListener("mousedown", function(e){
         global.changeZindex(id); //Move a janela para a frente
         oldPosition.x = this.offsetLeft - e.clientX;
         oldPosition.y = (this.offsetTop - e.clientY) - 40;
         
         lmb = true;   
         
         if(winObj.style.cursor != "default"){
            //se o cursor for diferente do padrão
            //o redimensionamento está ativado
            
            resize = true;
         }
         
         else{
            //caso contrário desativado
            resize = false;         
         }         
              
      });

      window.addEventListener("mouseup", function(){
         
         lmb = false;//botão do mouse levantando, censor desativado
      }); 

       winObj.addEventListener("mousemove", function(e){
         
         var x = e.clientX;//x global
         var y = e.clientY;//y global
         
         var rX = x - this.offsetLeft;//x relativo da janela
         var rY = y - this.offsetTop;//y relativo da janela
         
         var mX = x - obj.width / 2; //x médio da janela
         var mY = y - (obj.height / 2) - 120;//y médio da janela
         var bY = (parseInt(winObj.style.height.replace("px",""))/2) - 40;
         
         if(lmb && obj.drag && !resize){                                             
            winObj.style.left = (x + oldPosition.x) + "px";
            winObj.style.top =  (y + oldPosition.y) + "px";
         }                
         
//se o x e y relativos forem maior que pResize% do tamanho horizontal
// e vertical da janela          
         if(rX > (parseInt(winObj.style.width) * pResize) &&
            rY > (parseInt(winObj.style.height) * pResize)) {
                                        
                          
             if(obj.vStretch && obj.hStretch){           
               winObj.style.cursor = "se-resize";//cursor resize bidirecional
               
               if(lmb){//mudança da largura e altura com o mouse
               
                  winObj.style.width = (rX + 30) + "px";
                  winObj.style.height = (rY + 30) + "px";
               }
            
            }
         }                 
         
//se o x relativo for maior que pResize% do tamanho horizontal da janela         
         
        else if(rX > (parseInt(winObj.style.width) * pResize)){ 
         
            if(obj.hStretch){
               winObj.style.cursor = "e-resize";//cursor resize horizontal
               
               if(lmb){
               
                  winObj.style.width = (rX + 30) + "px";
               }            
            }
            
         }      
      
//se o y relativo for maior que pResize% do tamanho vertical da janela              
         else if (rY > (parseInt(winObj.style.height) * pResize)){
            
            
            if(obj.vStretch){
               
               winObj.style.cursor = "s-resize";//cursor resize vertical
               
               if(lmb){
               
                  winObj.style.height = (rY + 30) + "px";
               }      
            }
         }
         
         else{
            //caso contrário, cursor default
            winObj.style.cursor = "default";
         }        
         
         obj.posX = parseInt(winObj.style.left);
         obj.posY = parseInt(winObj.style.top);
                  
      });      
      
      winObj.style.overflow = "hidden";      
      
//---------------------------posição da janela--------------------------------

      winObj.style.left = obj.posX + "px";
      winObj.style.top = obj.posY + "px";      
               
      obj.parent.appendChild(winObj); 
                
      this.obj = winObj;         
      
 //-----------------------barra de ícones -------------------------------*/     
      
      var iconBar = document.createElement("DIV");
            
      iconBar.className = "bar";    
      winObj.addEventListener("mousemove", function(){
         iconBar.style.width = (parseInt(winObj.style.width)) + "px";
      });
      iconBar.style.overflow = "hidden";            
      
      winObj.appendChild(divContent);
      winObj.insertBefore(iconBar, divContent);
      
      this.bar = iconBar;  
      
      
//--------------------------title-------------------------------------------        
     
     var pTitle = document.createElement("P");
     global._stylize(this.id);
     pTitle.textContent = obj.title;
     pTitle.className = "title";
     if(!this.barAlign){
      
          pTitle.style.right = "40px";
      
         winObj.addEventListener("mousemove", function(){
         
             pTitle.style.right = "40px";
      
         });
      }
      else{
         pTitle.style.left = "40px";
      
         winObj.addEventListener("mousemove", function(){
         
             pTitle.style.left = "40px";
      
         });
      }      
     iconBar.appendChild(pTitle);
      
//---------------------application Icon--------------------------------------*/

    var barIcon = document.createElement("img");
    barIcon.src = this.icon;
    barIcon.className = "icon";
    if(!this.barAlign){
      
          barIcon.style.right = "0px";
      
         winObj.addEventListener("mousemove", function(){
         
             barIcon.style.right = "0px";
      
         });
      }
      else{
         barIcon.style.left = "0px";
      
         winObj.addEventListener("mousemove", function(){
         
             barIcon.style.left = "0px";
      
         });
      }      
     iconBar.appendChild(barIcon);

//---------------------botão fechar------------------------------------------*/     
        
      var closeButton = new CGButton();
      
      closeButton.content = "X";//conteudo do botão
      closeButton.parent = iconBar;//objeto HTML
      closeButton.clickEvent = "close";//evento do botão
      closeButton.actionObj = obj;//objeto que sofrerá a ação
            
      closeButton.create();                             
  } 
  
//-------------------destroy method of CWindow--------------------------------
      
      CWindow.prototype.destroy = function(){
         global.removeWindow(this.id); //remove a janela do mapa
         listWindows();
         this.parent.removeChild(this.obj);
      }
      
/*-----------------------method setPosition of CWindow--------------------*/

      CWindow.prototype.setPosition = function(x, y){
      
         var winObj = this.obj;
         winObj.style.left = x + "px";
         winObj.style.top = y + "px";
           
      }         

/*---------------------------instancias-----------------------------------*/
        
  // msg, title , option, barAlign, barColor
    var wn = new CWindow();
    var dialog = new CDialog("Gabiarra.Net quer acessar seu computador","Acesso ao sistema","yesno",false,false);
    dialog.create();


    //-------------------------------------------- developer tests ---------------------------------------------*/
    var a = {
        _b : [],
        create : function(){
            var index = this._b[this._b.length];
            this._b[index] = new CWindow(300, 300, "#fff", "2px", "10", true, true, true, true, "#ccc", false , false, false, ("window "+ Math.floor(Math.random() * 10)));
            this._b[index].create();
            this._b[index].setPosition(80,60);
        }
    };
    document.querySelector("#bt").addEventListener("click",function(){
        a.create();
        listWindows();
    },false);
});


document.addEventListener("changeWindowFocus",listWindows,false);

function listWindows(){
    var windowsOpeneds = global.list();
    var bottomBar = document.querySelector(".bottombar");
    bottomBar.innerHTML = "";
    for(var i = 0; i < windowsOpeneds.length; i+=1){
        var p = document.createElement("p");
        if(windowsOpeneds[i].active){
            p.style.color = "#f00";
            p.textContent = windowsOpeneds[i].title;
            p.setAttribute("wid",windowsOpeneds[i].id);
        }
        else{
            p.style.color = "#000";
            p.textContent = windowsOpeneds[i].title;
            p.setAttribute("wid",windowsOpeneds[i].id);
        }
        p.addEventListener("click",function(){
            var wid = this.getAttribute("wid");
            global.changeZindex(wid);
        },false);
        bottomBar.appendChild(p);
    }
}
