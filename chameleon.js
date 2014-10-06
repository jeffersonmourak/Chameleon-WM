//---------------------------init--------------------------------------------

window.addEventListener("load", function(){
   
/*----------------------objeto cWindow-----------------------------------*/   
   function CWindow(height, width, color, radius, drag, hStretch, vStretch, 
      barAlign, barColor, parent, content, title){

      this.height = height || 200; //altura da janela
      this.width = width || 300; //largura da janela
      this.color = color || "#aaa";//cor da janela
      this.radius = radius || 10;//raio da borda da janela
      this.drag = drag || true;//arraste desativado/ativado
      
      this.hStretch = hStretch || true;//ajuste horizontal da janela
      this.vStretch = vStretch || true;//ajuste vertical da janela
      
      this.barAlign = barAlign || false//false - icones a esquerda, true - direita
      this.barColor = barColor || "#00f"//false - icones a esquerda, true - direita
      
      
      this.parent = parent || document.body;// null - body, else - elemento pai

      this.content = content || "";
      
      this.title = title || "Janela bolada";     
      

   } 
   

   CWindow.prototype.create = function(){

      var winObj = document.createElement("DIV");

      winObj.style.height = this.height + "px";
      winObj.style.width = this.width + "px";
      winObj.style.backgroundColor = this.color;
      winObj.style.borderRadius = this.radius + "px";
      winObj.style.borderStyle = "groove";

      winObj.style.position = "absolute";//"absolute";

      var lmb = false; //sensor do botão esquerdo do mouse
      var resize = false; //resize ativo
      var pResize = 0.8;//proporção de resize em %
      
      var obj = this;

      
      
      CWindow.prototype.destroy = function(){
  
         this.parent.removeChild(winObj); 
  
      }



      winObj.addEventListener("mousedown", function(e){
         
         lmb = true;   
         
         if(winObj.style.cursor != "default"){
            
            resize = true;
         }
         
         else{
         
            resize = false;         
         }         
              
      });

      window.addEventListener("mouseup", function(){
         
         lmb = false;
      }); 

       winObj.addEventListener("mousemove", function(e){
         
         var x = e.clientX;//x global
         var y = e.clientY;//y global
         
         var rX = x - this.offsetLeft;//x relativo da janela
         var rY = y - this.offsetTop;//y relativo da janela
         
         var mX = x - obj.width / 2; //x médio da janela
         var mY = y - obj.height / 2;//y médio da janela
           
         
         if(lmb && obj.drag && !resize){
                                                          
            winObj.style.left = mX + "px";
            winObj.style.top = mY + "px";
         }                
         
//se o x e y relativos forem maior que pResize% do tamanho horizontal
// e vertical da janela          
         if(rX > (parseInt(winObj.style.width) * pResize) &&
            rY > (parseInt(winObj.style.height) * pResize)) {
                                        
                          
             if(obj.vStretch && obj.hStretch){           
               winObj.style.cursor = "se-resize";
               
               if(lmb){
               
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
         
      });      
      
      winObj.style.overflow = "hidden";
      
      obj.parent.appendChild(winObj);    
      
      
 //-----------------------barra de ícones -------------------------------*/     
      
      var iconBar = document.createElement("DIV");
      
      
      iconBar.style.height = "50px";
      iconBar.style.backgroundColor = this.barColor;
      //iconBar.style.marginLeft = "2px";
      
            
      winObj.addEventListener("mousemove", function(){
         
         iconBar.style.width = (parseInt(winObj.style.width)) + "px";
      
      });
      
                  
      winObj.appendChild(iconBar);
      
      
//--------------------------title-------------------------------------------        
     
     var pTitle = document.createElement("P");
     
     pTitle.textContent = obj.title;
     pTitle.style.color = "#fff";
     pTitle.style.fontWeight = "bold";
     
     pTitle.style.margin = "10px";
     
     pTitle.style.position = "absolute";
     
     iconBar.appendChild(pTitle);
     
     
     
//---------------------botão fechar------------------------------------------*/     
     
     
   var closeButton = document.createElement("BUTTON");
      
      
      closeButton.style.height = "40px";
      closeButton.style.width = "40px";
      closeButton.style.margin = "5px";
      
      closeButton.style.backgroundColor = "#f00";
      closeButton.textContent = "X";

    
     
      if(this.barAlign){
      
         closeButton.style.cssFloat = "right";
         
      }
      else{
         
        // pTitle.style.cssFloat = "right"; parei aqui sfsdfdsfsdfsf3$@$@#$S
      }
      
      
      closeButton.addEventListener("click", function(){
      
         //obj.parent.removeChild(winObj);
         obj.destroy();
      
      });
      
                 
      iconBar.appendChild(closeButton);    
  
  }

/*---------------------------instancias-----------------------------------*/
   
   var win = new CWindow();
   
   win.barAlign = true;
   win.barColor = "#0f0";
   
   
   win.create();    
   
  
   
   var win2 = new CWindow();
  
   win2.barAlign = true;
  
   win2.create();
      
   

});
