//---------------------------init--------------------------------------------
/*
   Developed by EasyJS
   Last modifier: Lucas Vendramini & Jefferson Moura - 2014
*/

//---------------------------init--------------------------------------------

window.addEventListener("load", function(){

//-------------------Disable Text selection ---------------------------------

    var head = document.querySelector("head");
    var style = document.createElement('style');
    style.innerHTML = ".noselect{-webkit-touch-callout: none;\n-webkit-user-select: none;\n-khtml-user-select: none;\n-moz-user-select: none;\n-ms-user-select: none;\nuser-select: none;}";
    head.appendChild(style);

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
      
      button.style.height = this.height + "px";
      button.style.width = this.width + "px";
      button.style.backgroundColor = this.color;
      button.style.borderRadius = this.radius + "px";
      button.style.borderWidth = this.bSize + "px";
      button.style.borderStyle = "groove";
      button.textContent = this.content;
      button.style.margin = "5px";
      button.style.color = "#fff";   
      button.style.fontSize = this.fSize + "px";   
      button.style.fontWeight = "bold";
      
      if (this.barGradient){
            
         button.style.backgroundImage = this.barGradient;
      }            
      
      var actObj =  this.actionObj;
            
      if(this.clickEvent == "close"){      
                 
         button.addEventListener("click",function(){
                  
            actObj.destroy();                  
         });            
      }
      
      if(actObj.barAlign == true){//bar align caso ativado
      
         button.style.cssFloat = "right";         
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
      barAlign, barColor, barGradient , parent, content, title, divMargin, 
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
      
      this.title = title || "Janela bolada"; //título da janela    
      
      this.barGradient = barGradient || 
         "linear-gradient("+ this.barColor+ ", black)";    
      
      this.divMargin = divMargin || 5;   //margin
      
      this.posX = posX || 0;//posição da janela, eixo x
      this.posY = posY || 0;//posição da janela, eixo y     
      
   }    

//------------------------create method of CWindow---------------------------*/
   CWindow.prototype.create = function(){

      var winObj = document.createElement("DIV");

      winObj.style.height = this.height + "px";
      winObj.style.width = this.width + "px";
      winObj.style.backgroundColor = this.color;
      winObj.style.borderRadius = this.radius + "px";
      winObj.className = "noselect";
      winObj.style.borderWidth = this.bSize + "px";
      winObj.style.borderStyle = "groove";
          
/*---------------------------div de conteudo---------------------------------*/           
      var divContent = document.createElement("DIV");
            
      divContent.textContent = this.content;
                   
      divContent.style.position = "relative";     
      divContent.style.margin = this.divMargin + "px";
                    
      winObj.style.position = "absolute";//"absolute";

      var lmb = false; //sensor do botão esquerdo do mouse
      var resize = false; //resize ativo
      var pResize = 0.8;//proporção de resize em %
      
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
         var mY = y - obj.height / 2;//y médio da janela
         var bY = (parseInt(winObj.style.height.replace("px",""))/2) - 40;
         
         if(lmb && obj.drag && !resize){                                              
            winObj.style.left = mX + "px";
            winObj.style.top = (mY + bY) + "px";
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
            
      iconBar.style.height = "45px";
      iconBar.style.backgroundColor = this.barColor;
            
      iconBar.style.position = "relative";    
      
      if(obj.barGradient){
         iconBar.style.backgroundImage = obj.barGradient;    
      }      
      winObj.addEventListener("mousemove", function(){
         iconBar.style.width = (parseInt(winObj.style.width)) + "px";
      });
      
      iconBar.style.overflow = "hidden";            
      
      winObj.appendChild(divContent);
      winObj.insertBefore(iconBar, divContent);
      
      this.bar = iconBar;  
      
      
//--------------------------title-------------------------------------------        
     
     var pTitle = document.createElement("P");
     
     pTitle.textContent = obj.title;
     pTitle.style.color = "#fff";
     pTitle.style.fontWeight = "bold";
     pTitle.style.margin = "10px";
     pTitle.style.position = "absolute";
     
     iconBar.appendChild(pTitle);   
     
     
      if(!this.barAlign){
      
         pTitle.style.left = (parseInt(winObj.style.width) - 13 * obj.title.length) + "px";
      
         winObj.addEventListener("mousemove", function(){
         
            pTitle.style.left = (parseInt(winObj.style.width) - 13 * obj.title.length) + "px";
      
         });
      }      
     
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
  
         this.parent.removeChild(this.obj);
      }
      
/*-----------------------method setPosition of CWindow--------------------*/

      CWindow.prototype.setPosition = function(x, y){
      
         var winObj = this.obj;
         
         winObj.style.left = x + "px";
         winObj.style.top = y + "px";
           
      }         

/*---------------------------instancias-----------------------------------*/
        
  
  var wn = new CWindow();
       
   wn.create();
   
   wn.setPosition(50, 100);
   
});
