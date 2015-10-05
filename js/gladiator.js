if (typeof Object.create !== 'function'){
  Object.create = function (o){
    var F = function () {};
    F.prototype = o;
    return new F();
  };
}



Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

/*
Event structure

name

*/

Object.defineProperty(Object.prototype, 'getId',{
  value :function(){
    if (this.objectId === undefined){
    return 'ID_NOT_SETTED';
  }
  return this.objectId;
  }
});


Object.defineProperty(Object.prototype, 'initEventHandler',{
  value :function(scope,eventName){
    if (scope.eventListeners === undefined){
      scope.eventListeners = {};
      scope.eventListeners[eventName] = {};
    }
    else if ( scope.eventListeners[eventName] === undefined ){
      scope.eventListeners[eventName] = {};
    }
  }
});

Object.defineProperty(Object.prototype, 'fire',{
  value :function(scope,eventName,params){
     scope.initEventHandler(scope,eventName);
  
    for (var trigger in scope.eventListeners[eventName]) {
      scope[trigger](params);
    }
  }
});

Object.defineProperty(Object.prototype, 'setTrigger',{
  value :function(scope,eventName,functionName){
      scope.initEventHandler(scope,eventName);
    if (scope.eventListeners[eventName][functionName] !== undefined){
      console.warn('the trigger in the object "'+ scope.getId() +'" for the event "'+eventName+'" to trigger the function "'+ functionName+'" is already setted, consider remove the redundance');
    }
    scope.eventListeners[eventName][functionName] = {functionName:functionName};
  }
});

Object.defineProperty(Object.prototype, 'removeTrigger',{
  value :function(scope,eventName,functionName){
    scope.initEventHandler(scope,eventName);
  
    scope.eventListeners[eventName][functionName] = undefined;
  }
});

var GBG = {autor:'Ignacio Medina Castillo, Raising Spirit', github:'https://github.com/Raising', version:0.1, projectName:'Gladiator Board Game'};

//Constants
GBG.GLADIATOR_RAIDUS = 50;
GBG.GLADIATOR_ARC_params = 3;
GBG.ARC_DEEP_DISTANCE = 5;

//Static members
GBG.ID_COUNTER = 0;
GBG.CREATED_OBJECTS = {};
GBG.DOM_TO_OBJECT_MAP = {};
//AuxiliarFunctions
GBG.getNewId = function(){
  GBG.ID_COUNTER ++;
  var str = "" + GBG.ID_COUNTER;
  var pad = "000000";
  str = pad.substring(0, pad.length - str.length) + str;
  return str;
};
GBG.create = function(objectName, params){
  var id = GBG.getNewId();
  var newObject = new GBG[objectName](params);
  newObject.objectType = objectName;
  newObject.objectId = id + '_' + objectName ;
  //GBG.CREATED_OBJECTS[newObject.objectId] = newObject;
  return newObject;
};

GBG.buildDomElement = function( scope ,definingString){
  var newDomElement = $(definingString);
  newDomElement.attr("id",scope.objectId);
  GBG.DOM_TO_OBJECT_MAP[scope.objectId] = scope;
 
  return newDomElement;
};





GBG.FieldEntityModel = function( params ){
  params = params ? params : {};
  var me = this;
  this.equipment     = (params.equipment      ? params.equipment     :  []                          );
  this.movements     = (params.movements      ? params.movements     :  []                          );
  this.statusHandler = (params.statusHandler  ? params.statusHandler :  GBG.create('StatusHandler') );
  this.localization  = (params.localization   ? params.localization  :  GBG.create('Localization')  );
  this.displacement  = (params.displacement   ? params.displacement  :  GBG.create('Displacement')  );
  this.view          = (params.view           ? params.view          :  GBG.create('FieldEntityView',{model:me}));
  this.eventHandler  = (params.eventHandler   ? params.eventHandler  :  GBG.create('EventHandler')  );
  
 
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    insertViewInto : function(element){
      $(element).append(me.view.getView());
    },  
    relativeMovement : function(params){
      me.localization.modifyPositionRelatedToOrientation(params.position);
      me.localization.modifyRotation(params.rotation);
      me.view.moveTo({position:me.localization.getPosition(),rotation:me.localization.getRotation()});
    },
    forcePosition : function(params){
       me.localization.setPosition(params.position);
       me.localization.setRotation(params.rotation);
       me.view.moveTo({position:me.localization.getPosition(),rotation:me.localization.getRotation()});
    },
    absoluteMovement : function(params){},
    getEquipment : function(){
      return me.equipment;
    },
    refreshEquipment : function(){
      var numEquipment = me.equipment.length;
      for (var i = 0 ; i<numEquipment; i++ ){
        me.view.addActionArc(me.equipment[i]);
      }
    },
    loadDisplacement : function() {
      me.displacement.loadMovements(me.movements);
      me.displacement.attachTo(me.view.getView());
    },
    eventCatch : function(eventName, eventTarget) {
      me.eventHandler.propagateEvent(me,eventName,eventTarget);
    }
  };
  
  return newObject; 
};




GBG.FieldEntityView = function( params ){
  params = params ? params : {};
  var me = this;
  this.model = params.model;
  this.mainContainer =  GBG.buildDomElement(me,'<div class="XwingMainContainer"></div>');
  this.arcHandler =  GBG.create('ArcHandler',params);
    
  $(this.mainContainer).click(function(event) {
    me.model.eventCatch('click',event.target);
  });
  this.mainContainer.append(me.arcHandler.getArcGraphics());
  
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
      moveTo:function(localization){
        var tl = new TimelineMax();
        tl.to(me.mainContainer,  0.5, { x:localization.position.x,y:localization.position.y,transformOrigin:"50% 50%", ease:Sine.easeOut});
        tl.to(me.mainContainer,  0.3, { rotation:localization.rotation,transformOrigin:"50% 50%"});
      },
      addActionArc : function(params){
        me.arcHandler.addActionArc(params);
      },
      
      
      
      
  };
  
  return newObject; 
};


GBG.EventHandler = function(params){
  params = params ? params : {};
  var me = this;
  
  
  
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos
     
      propagateEvent : function(scope,eventName,eventTarget){
        console.log(eventTarget);
        console.log(eventTarget.id);
      }
      
      
      
  };
  
  return newObject; 
};



GBG.ArcHandler = function( params ){
  params = params ? params : {};
  var me = this;
  this.actionArcs = [];
  this.id = 'archandler';
  this.graphic =  GBG.buildDomElement(me,'<svg width="100px" height="100px" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve"></svg>');

  $(this.graphic).addClass('gladiadorSVG'); 
 
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    addActionArc : function(params){
       var newActionArc =  GBG.create('ActionArcModel',params);
       me.graphic[0].appendChild(newActionArc.getGraphic());
       me.actionArcs.push(newActionArc);
       newActionArc.setActionArc();
    },
    getArcGraphics: function(){
      return me.graphic;
    },
  };
  
  return newObject; 
};



GBG.ActionArcModel = function( params ){
  params = params ? params : {};
  var me = this;
  this.deepLevel = params.deepLevel ? params.deepLevel : 1; //deepLevel es la distancia desde el borde al centro pongamos un maximo de 6 niveles ppor ejemplo la idea es que no se superpongan dibujos.
  this.widthLevels = params.widthLevels ? params.widthLevels : GBG.EquipmentArcs.shields.buclet;
  this.orientation = params.orientation ? 90 + params.orientation : 90;
  // me.graphic = $('<rect x="150" y="100" class="box" width="50" height="50"/>');
  this.arcSteps = [];
  this.graphic = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a SVG container
  var numOfArcSteps;
  
  this.addArcStep = function(params){
    var newArcStep =   GBG.create('ActionArcView',params);
    me.arcSteps.push(newArcStep);
    me.graphic.appendChild(newArcStep.getArcStep());
  };
  

  TweenMax.to(me.graphic, 1, {rotation:me.orientation,transformOrigin:"50% 50%"});
  
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    getGraphic: function(){
      return me.graphic;
    },
    setActionArc: function(){
      var i;
      for (i = me.widthLevels.length-1; i>=0 ; i--){
        me.widthLevels[i].deepLevel = me.deepLevel;
        me.widthLevels[i].model = me;
        me.addArcStep(me.widthLevels[i]);      
      }
    },
  };
  
  return newObject; 
};


GBG.ActionArcView = function(params){
  params = params ? params : {};
  var me = this;
  this.model = params.model;
  this.radius = params.deepLevel ? (GBG.GLADIATOR_RAIDUS - ((params.deepLevel-1) * GBG.ARC_DEEP_DISTANCE)-GBG.GLADIATOR_ARC_params).toString() :  GBG.GLADIATOR_RAIDUS.toString()-GBG.GLADIATOR_ARC_params;
  this.widthFrom = params.from ?  params.from + '%' :  '50%';
  this.widthTo = params.to ?  params.to + '%' :  '50%';
  this.color = params.color ?  params.color : '#49a';
  this.graphic = document.createElementNS("http://www.w3.org/2000/svg", 'circle'); //Create a path in SVG's namespace
  this.graphic.setAttribute("x","0"); 
  this.graphic.setAttribute("y","0");
  this.graphic.setAttribute("fill","none") ;
  this.graphic.setAttribute("r",this.radius); 
  this.graphic.setAttribute("cx","50"); 
  this.graphic.setAttribute("cy","50");
  
  this.graphic.style.stroke = me.color; //Set stroke colour
  this.graphic.style.strokeWidth = "5px"; //Set stroke width
  TweenMax.to(me.graphic, 4, {drawSVG:me.widthFrom+' '+me.widthTo,delay:4,ease:Elastic.easeOut});
 
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    getArcStep: function(){
      return me.graphic;
    },
  };
  
  return newObject; 
};




GBG.Localization = function( params ){
  params = params ? params : {};
  var me = this;
  this.position = params.position ? params.position : {x: 200, y : 300};
  this.rotation = params.rotation ? params.rotation : 0;
  
  this.calculateStraightMovementCoeficient = function(){
    return {coefX:Math.sin(Math.radians(me.rotation)),coefY:(-1) * Math.cos(Math.radians(me.rotation))};
  };
  this.calculateSideMovementCoeficient = function(){
    return {coefX:Math.cos(Math.radians(me.rotation)),coefY:(1) * Math.sin(Math.radians(me.rotation))};
  };
  this.modifyPosition = function(params){
        if(params.x !== undefined && params.y !== undefined){
          me.position.x += params.x;
          me.position.y += params.y;
        }
        else{
          console.error('GBG.Localization.setPosition called with the wrong parameters, expested object with x and y values',params);
        }
      };
  
  
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos
      setPosition: function(params){
        if(params.x !== undefined && params.y !== undefined){
          me.position.x = params.x;
          me.position.y = params.y;
        }
        else{
          console.error('GBG.Localization.setPosition called with the wrong parameters, expested object with x and y values',params);
        }
      },
      setX : function(x){
        if(x !== undefined ){
          me.position.x = x;
        }
        else{
          console.error('GBG.Localization.setX called with the wrong parameters',x);
        }
      },
      setY : function(y){
        if(y !== undefined ){
          me.position.y = y;
        }
        else{
          console.error('GBG.Localization.setX called with the wrong parameters',y);
        }
      },
      setRotation : function(rotation){
         if(rotation !== undefined ){
          me.rotation = rotation;
        }
        else{
          console.error('GBG.Localization.setrotation called with the wrong parameters',rotation);
        }
      },
      modifyX : function(x){
        if(x !== undefined ){
          me.position.x += x;
        }
        else{
          console.error('GBG.Localization.setX called with the wrong parameters',x);
        }
      },
      modifyY : function(y){
        if(y !== undefined ){
          me.position.y += y;
        }
        else{
          console.error('GBG.Localization.modifyY called with the wrong parameters',y);
        }
      },
      modifyRotation : function(rotation){
        if(rotation !== undefined ){
          me.rotation += rotation;
        }
        else{
          console.error('GBG.Localization.modifyRotation called with the wrong parameters',rotation);
        }
      },
      getPosition: function(){
        return me.position;
      },
      getRotation: function(){
        return me.rotation;
      },
      modifyPositionRelatedToOrientation: function(params){ //Straight, side
        var straightCoeficients = me.calculateStraightMovementCoeficient();
        var sideCoeficients = me.calculateSideMovementCoeficient();
        me.modifyPosition({x:straightCoeficients.coefX * params.straight + sideCoeficients.coefX * params.side,
                        y:straightCoeficients.coefY * params.straight + sideCoeficients.coefY * params.side});
      },
      getPositionRelatedToOrientation: function(params){ //Straight, side
        var straightCoeficients = me.calculateStraightMovementCoeficient();
        var sideCoeficients = me.calculateSideMovementCoeficient();
        return({x:straightCoeficients.coefX * params.straight + sideCoeficients.coefX * params.side,
                        y:straightCoeficients.coefY * params.straight + sideCoeficients.coefY * params.side});
      },
    
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
  this.stamina = params.stamina ? params.stamina : 6;
  this.health = params.health ? params.health : 6;
  this.wounds = [];
  
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    
  };
  
  return newObject;
};



GBG.Displacement = function( params ){
  params = params ? params : {};
  var me = this;
  this.parent = params.parent;
  //this.movementPositbilities = params ? params : [];
  this.container =  GBG.buildDomElement(me,'<div class="displacementContainer"></div>');
  this.movementOptions = [];
  
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    refreshEquipment : function(){
      var numEquipment = me.equipment.length;
      for (var i = 0 ; i<numEquipment; i++ ){
        me.view.addActionArc(me.equipment[i]);
      }
    },
    
    addMovement : function(params){
      var newMovement = GBG.create('Movement',params);
      
    },
    loadMovements : function(movements){
      me.container.empty();
      me.movementOptions = [];
      var numberOfMovements = movements.length;
      for (var i = 0;i <numberOfMovements; i++){
        var newMovement = GBG.create('Movement',movements[i]);
        me.movementOptions.push(newMovement);
        newMovement.attachViewTo(me.container);
        newMovement.setViewPosition();
        newMovement.setViewEventHandlers();
      }
    },
    attachTo : function(element){
      $(element).append(me.container);
    }
  };
  
  return newObject; 
};


GBG.Movement = function( params ){
  params = params ? params : {};
  var me = this;
  this.relativeRotation = params.rotation ? params.rotation : 0;
  this.relativePosition = params.position ? params.position : {x:0,y:100};
  this.template = params.template ? params.template : {};
  this.view = GBG.create('MovementView',{model:me});
  
  
  this.onClick = function(){
    console.log('elementclicked');
  };
  
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
     attachViewTo : function(element){
       me.view.attachViewTo(element);
     }, 
     setViewPosition : function(){
       me.view.setLocation({rotation:me.relativeRotation,position:me.relativePosition});
     },
     setViewEventHandlers : function(){
       me.view.setOnClick(me, 'onClick');
     }
  };
  
  return newObject; 
};

GBG.MovementView = function( params ){
  
  params = params ? params : {};
  
  var me = this;
 
  this.model = params.model;
  this.container =  GBG.buildDomElement(me,'<div class="movementView"></div>');
  
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    attachViewTo : function (element){
      $(element).append(me.container);
    },
    setLocation : function(params){
      TweenMax.to(me.container,0.3,{ x:       params.position.x,
                                     y:       params.position.y,
                                     rotation:params.rotation,transformOrigin:"50% 50%", ease:Sine.easeOut});
    },
    hide : function(){
      TweenMax.to(me.container,0.3,{ opacity:0,transformOrigin:"50% 50%", ease:Sine.easeOut});
    },
    show : function(){
      TweenMax.to(me.container,0.3,{ opacity:0.4,transformOrigin:"50% 50%", ease:Sine.easeOut});
    },
    setOnClick : function(scope,functionName){
      me.setTrigger(scope,'click', functionName);
      me.container.click(function(){
        me.fire(scope,'click');
      });
    }
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