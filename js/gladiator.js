var GBG = {autor:'Ignacio Medina Castillo, Raising Spirit', github:'https://github.com/Raising', version:0.1, projectName:'Gladiator Board Game'};

GBG.FieldEntityModel = function( params ){
  var params = params ? params : {};
  var me = this;
  this.statusHandler = (params.statusHandler  ? params.statusHandler :  GBG.StatusHandler());
  this.localization  = (params.localization   ? params.localization  :  GBG.Localization());
  this.displacement  = (params.displacement   ? params.displacement  :  GBG.Displacement());
  this.view          = (params.view           ? params.view          :  GBG.FieldEntityView());
  
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    insertViewInto : function(element){
      return $(element).append(me.view.getView());
    },  
  };
  
  return newObject; 
};




GBG.FieldEntityView = function( params ){
  var params = params ? params : {};
  var me = this;
  this.mainContainer = $('<div class="glaciatorMainContainer"></div>');
  this.arcHandler =   (params.arcHandler    ? params.arcHandler :  GBG.ArcHandler());

  this.mainContainer.append(me.arcHandler.getArcGraphics());
  this.arcHandler.addActionArc(GBG.ActionArc());
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos
      getView: function(){
          Draggable.create(me.mainContainer, {
      			bounds:$("#Characters"),
      			edgeResistance:1,
      			type:"x,y",
	      	});
        return me.mainContainer;
      },
      
      addActionArc : function(actionArc){
        me.arcHandler.addActionArc(actionArc);
      },
      
      
  };
  
  return newObject; 
};

GBG.ArcHandler = function( params ){
  var params = params ? params : {};
  var me = this;
  this.actionArcs = [];
  this.id = 'archandler';
 //= document.createElement('svg');
  this.graphic = $('<svg width="100px" height="100px" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve"></svg>');

  $(this.graphic).addClass('gladiadorSVG'); 
 /* this.graphic.setAttribute("y","10px");
  this.graphic.setAttribute('width','100px');
  this.graphic.setAttribute('height','100px');
  this.graphic.setAttribute('viewBox','0 0 100 100');
  this.graphic.setAttribute('style','enable-background:new 0 0 100 100;');
this.graphic.setAttribute('xml:space','preserve');*/


 
 
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    addActionArc : function(actionArc){
    
       me.graphic[0].appendChild(actionArc.getGraphic());
       me.actionArcs.push(actionArc);
    },
    getArcGraphics: function(){
      return me.graphic;
    },
  };
  
  return newObject; 
};



GBG.ActionArc = function( params ){
  var params = params ? params : {};
  var me = this;
  this.deepLevel = params.deepLevel ? params.deepLevel : 1; //deepLevel es la distancia desde el borde al centro pongamos un maximo de 6 niveles ppor ejemplo la idea es que no se superpongan dibujos.
  this.widthLevels = params.widthLevels ? params.widthLevels : {main:30,left1:20,left2:20,right1:10,rigth2:15};
  this.orientation = params.orientation ? params.orientation : 180;
 // me.graphic = $('<rect x="150" y="100" class="box" width="50" height="50"/>');

   me.graphicArc = document.createElementNS("http://www.w3.org/2000/svg", 'circle'); //Create a path in SVG's namespace
   me.graphicArc.setAttribute("x","0"); 
   me.graphicArc.setAttribute("y","0");
   me.graphicArc.setAttribute("fill","none") ;
   me.graphicArc.setAttribute("r","45"); 
   me.graphicArc.setAttribute("cx","50"); 
   me.graphicArc.setAttribute("cy","50");
    //Set path's data
   me.graphicArc.style.stroke = "#990"; //Set stroke colour
   me.graphicArc.style.strokeWidth = "5px"; //Set stroke width

  
  
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    getGraphic: function(){
      return me.graphicArc;
    },
  };
  
  return newObject; 
};






GBG.Localization = function( params ){
  var params = params ? params : {};
  
  
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    
  };
  
  return newObject; 
};


GBG.Wound = function( params ){
  
  
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    
  };
  
  return newObject; 
};

GBG.StatusHandler = function( params ){
  var params = params ? params : {};
  var me = this;
  //metodos y variables prvadas
  this.stamina = params.stamina ? params.stamina : 6;
  this.health = params.health ? params.health : 6;
  this.wounds = [];
  
  
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    
  };
  
  return newObject; 
};


GBG.Movement = function( params ){
  var params = params ? params : {};
  var me = this;
  this.template = params.template ? params.template : {};
  
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    
  };
  
  return newObject; 
};

GBG.Displacement = function( params ){
  var params = params ? params : {};
  var me = this;
  this.movementPositbilities = params.movementPositbilities ? params.movementPositbilities : [];
  
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    
  };
  
  return newObject; 
};

GBG.Wound = function( params ){
  
};

/*
 var svg = document.getElementsByTagName('svg')[0]; //Get svg element
var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
newElement.setAttribute("d","M 0 0 L 10 10"); //Set path's data
newElement.style.stroke = "#000"; //Set stroke colour
newElement.style.strokeWidth = "5px"; //Set stroke width
svg.appendChild(newElement);
*/