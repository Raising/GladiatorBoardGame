var GBG = {autor:'Ignacio Medina Castillo, Raising Spirit', github:'https://github.com/Raising', version:0.1, projectName:'Gladiator Board Game'};

GBG.FieldEntityModel = function( params ){
  params = params ? params : {};
  var me = this;
  me.statusHandler = (params.statusHandler  ? params.statusHandler :  GBG.StatusHandler());
  me.localization  = (params.localization   ? params.localization  :  GBG.Localization());
  me.displacement  = (params.displacement   ? params.displacement  :  GBG.Displacement());
  me.view          = (params.view           ? params.view          :  GBG.FieldEntityView());
  
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    insertViewInto : function(element){
      return $(element).append(me.view.getView());
    },  
  };
  
  return newObject; 
};




GBG.FieldEntityView = function( params ){
  params = params ? params : {};
  var me = this;
  me.mainContainer = $('<div class="glaciatorMainContainer"></div>');
  me.actionArcs = [];
  
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
        me.actionArcs.push(actionArc);
      },
      
      
  };
  
  return newObject; 
};


GBG.ActionArc = function( params ){
  params = params ? params : {};
  var me = this;
  me.deepLevel = params.deepLevel ? params.deepLevel : 1; //deepLevel es la distancia desde el borde al centro pongamos un maximo de 6 niveles ppor ejemplo la idea es que no se superpongan dibujos.
  me.widthLevels = params.widthLevels ? params.widthLevels : {main:30,left1:20,left2:20,right1:10,rigth2:15};
 // me.svgLine = GBG
  
  
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    
  };
  
  return newObject; 
};






GBG.Localization = function( params ){
  params = params ? params : {};
  
  
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
  params = params ? params : {};
  var me = this;
  //metodos y variables prvadas
  me.stamina = params.stamina ? params.stamina : 6;
  me.health = params.health ? params.health : 6;
  me.wounds = [];
  
  
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    
  };
  
  return newObject; 
};


GBG.Movement = function( params ){
  params = params ? params : {};
  var me = this;
  this.template = params.template ? params.template : {};
  
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    
  };
  
  return newObject; 
};

GBG.Displacement = function( params ){
  params = params ? params : {};
  var me = this;
  this.movementPositbilities = params.movementPositbilities ? params.movementPositbilities : [];
  
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    
  };
  
  return newObject; 
};

GBG.Wound = function( params ){
  
};