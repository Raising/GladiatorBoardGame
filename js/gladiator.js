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
  GBG.ID_COUNTER += 1;
  var str = "" + GBG.ID_COUNTER;
  var pad = "000000";
  str = pad.substring(0, pad.length - str.length) + str;
  return str;
};

GBG.create = function(objectName, params){
  var newObject = new GBG[objectName](params);
      
  newObject.objectType = objectName;
  newObject.objectId = newObject.ΦId() + '_' + objectName ;
  
  if (newObject.init){
    newObject.init();
  }
  //GBG.CREATED_OBJECTS[newObject.objectId] = newObject;
  return newObject;
};

GBG.buildDomElement = function( scope ,definingString){ // toda linea que llame a este metodo al generarse el elemento es necesario añadirlo al metodo INIT
  var newDomElement = $(definingString);
  newDomElement.attr("id",scope.objectId);
  if (scope.getModel){
    GBG.DOM_TO_OBJECT_MAP[scope.objectId] = scope.getModel();
  }
  else{
    GBG.DOM_TO_OBJECT_MAP[scope.objectId] = scope;
  }
  
  return newDomElement;
};

GBG.getObjectFromDomElement = function(DOMElement){
  return GBG.DOM_TO_OBJECT_MAP[DOMElement.id];
};


ò_ó.Describe('FieldEntityModel',{

  privateInit: function(scope,params){
      scope.equipment     = (params.equipment      ? params.equipment     :  []                          );
      scope.movements     = (params.movements      ? params.movements     :  []                          );
      scope.statusHandler = (params.statusHandler  ? params.statusHandler :  ò_ó.create('StatusHandler') );
      scope.localization  = (params.localization   ? params.localization  :  ò_ó.create('Localization')  );
      scope.displacement  = (params.displacement   ? params.displacement  :  ò_ó.create('Displacement')  );
      //scope.eventHandler  = (params.eventHandler   ? params.eventHandler  :  GBG.create('FieldEntityEventHandler')  );
      //View, should be declared after the public interface.
      scope.view = ò_ó.create('FieldEntityView',{model: scope.publicInterface});
  },
  
  publicInterface: function(scope,params){
    return {
       insertViewInto : function(element){
        $(element).append(scope.view.getView());
      },
      relativeMovement : function(params){
        scope.localization.modifyPositionRelatedToOrientation(params.position);
        scope.localization.modifyRotation(params.rotation);
        scope.view.moveTo({position:scope.localization.getPosition(),rotation:scope.localization.getRotation()});
      },
      forcePosition : function(params){
         scope.localization.setPosition(params.position);
         scope.localization.setRotation(params.rotation);
         scope.view.moveTo({position:scope.localization.getPosition(),rotation:scope.localization.getRotation()});
      },
      absoluteMovement : function(params){},
      getEquipment : function(){
        return scope.equipment;
      },
      refreshEquipment : function(){
        var numEquipment = scope.equipment.length;
        for (var i = 0 ; i<numEquipment; i++ ){
          scope.view.addActionArc(scope.equipment[i]);
        }
      },
      loadDisplacement : function() {
        scope.displacement.loadMovements(scope.movements);
        scope.displacement.attachTo(scope.view.getView());
      },
      onClick : function(event) {
        var objectClicked = GBG.getObjectFromDomElement(event.target);
        
        if (objectClicked.objectType === 'FieldEntityModel'){ // the object is itself
          scope.displacement.toggleVisibility(); // shall we open a menu instead of only togle movements optiones visibilitiy
        }
        else{
          objectClicked.onClick(scope.publicInterface);  
        }
      },
      onHoverIn : function(){
        console.log('hoverin');
      },
      onHoverOut : function(){
       console.log('hoverout');
      }
    };
  }
});

ò_ó.Describe('FieldEntityView',{
  
  privateInit: function(scope,params){
    scope.model = params.model;
    scope.arcHandler =  ò_ó.create('ArcHandler',params);
    scope.mainContainer =  GBG.buildDomElement(scope.publicInterface,'<div class="XwingMainContainer"></div>');
    scope.mainContainer.append(scope.arcHandler.getArcGraphics());
    
    $(scope.mainContainer).click(function(event) {
       scope.model.onClick(event);
    });
  },
  
  publicInterface : function(scope,params){// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos
    return {
      getView: function(){
        return scope.mainContainer;
      },
      moveTo:function(localization){
        var tl = new TimelineMax();
        tl.to(scope.mainContainer,  0.5, { x:localization.position.x,y:localization.position.y,rotation:localization.rotation,transformOrigin:"50% 50%", ease:Sine.easeOut});
      //  tl.to(scope.mainContainer,  0.3, { ,transformOrigin:"50% 50%"});
      },
      addActionArc : function(params){
        scope.arcHandler.addActionArc(params);
      },
      getModel: function(){
        return scope.model;
      }
    };
  }
});

ò_ó.Describe('ArcHandler',{
  
  privateInit: function(scope,params){
    scope.actionArcs = [];
    scope.graphic =  GBG.buildDomElement(scope.publicInterface,'<svg class="arcHandlerContainer" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve"></svg>');
  },
  
  publicInterface : function(scope,params){// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos
    return {
      addActionArc : function(params){
         var newActionArc =  ò_ó.create('ActionArcModel',params);
         scope.graphic[0].appendChild(newActionArc.getGraphic());
         scope.actionArcs.push(newActionArc);
         newActionArc.setActionArc();
      },
      getArcGraphics: function(){
        return scope.graphic;
      }
    };
  } 
});


ò_ó.Describe('ActionArcModel',{
  
  privateInit: function(scope,params){
    scope.deepLevel = params.deepLevel ? params.deepLevel : 1; //deepLevel es la distancia desde el borde al centro pongamos un maximo de 6 niveles ppor ejemplo la idea es que no se superpongan dibujos.
    scope.widthLevels = params.widthLevels ? params.widthLevels : GBG.EquipmentArcs.shields.buclet;
    scope.orientation = params.orientation ? 90 + params.orientation : 90;
    // scope.graphic = $('<rect x="150" y="100" class="box" width="50" height="50"/>');
    scope.arcSteps = [];
    scope.graphic = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a SVG container
  
    scope.addArcStep = function(params){
      var newArcStep =   ò_ó.create('ActionArcView',params);
      scope.arcSteps.push(newArcStep);
      scope.graphic.appendChild(newArcStep.getArcStep());
    };
    
    TweenMax.to(scope.graphic, 1, {rotation:scope.orientation,transformOrigin:"50% 50%"}); 
  },
  
  publicInterface : function(scope,params) {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    return {
      getGraphic: function(){
        return scope.graphic;
      },
      setActionArc: function(){
        var i;
        for (i = scope.widthLevels.length-1; i>=0 ; i--){
          scope.widthLevels[i].deepLevel = scope.deepLevel;
          scope.widthLevels[i].model = scope.publicInterface;
          scope.addArcStep(scope.widthLevels[i]);      
        }
      },
    };
  }
});

ò_ó.Describe('ActionArcView' ,{
  
  privateInit: function(scope,params){
    scope.model = params.model;
    scope.radius = params.deepLevel ? (GBG.GLADIATOR_RAIDUS - ((params.deepLevel-1) * GBG.ARC_DEEP_DISTANCE)-GBG.GLADIATOR_ARC_params).toString() :  GBG.GLADIATOR_RAIDUS.toString()-GBG.GLADIATOR_ARC_params;
    scope.widthFrom = params.from ?  params.from + '%' :  '50%';
    scope.widthTo = params.to ?  params.to + '%' :  '50%';
    scope.color = params.color ?  params.color : '#49a';
    scope.graphic = document.createElementNS("http://www.w3.org/2000/svg", 'circle'); //Create a path in SVG's nascopespace
    scope.graphic.setAttribute("x","0"); 
    scope.graphic.setAttribute("y","0");
    scope.graphic.setAttribute("fill","none") ;
    scope.graphic.setAttribute("r",scope.radius); 
    scope.graphic.setAttribute("cx","50"); 
    scope.graphic.setAttribute("cy","50");
    
    scope.graphic.style.stroke = scope.color; //Set stroke colour
    scope.graphic.style.strokeWidth = "5px"; //Set stroke width
    TweenMax.to(scope.graphic, 4, {drawSVG:scope.widthFrom+' '+scope.widthTo,delay:4,ease:Elastic.easeOut});
  },
  
  publicInterface : function(scope,params) {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
    return {
      getArcStep: function(){
        return scope.graphic;
      }
    };
  }
});


ò_ó.Describe('Localization', {
  
  privateInit: function(scope,params){
    scope.position = params.position ? params.position : {x: 200, y : 300};
    scope.rotation = params.rotation ? params.rotation : 0;
    
    scope.calculateStraightMovementCoeficient = function(){
      return {coefX:Math.sin(Math.radians(scope.rotation)),coefY:(-1) * Math.cos(Math.radians(scope.rotation))};
    };
    scope.calculateSideMovementCoeficient = function(){
      return {coefX:Math.cos(Math.radians(scope.rotation)),coefY:(1) * Math.sin(Math.radians(scope.rotation))};
    };
    scope.modifyPosition = function(params){
      if(params.x !== undefined && params.y !== undefined){
        scope.position.x += params.x;
        scope.position.y += params.y;
      }
      else{
        console.error('GBG.Localization.setPosition called with the wrong parameters, expested object with x and y values',params);
      }
    };
  },
  
  publicInterface : function(scope,params){// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
    return {
      setPosition: function(params){
          scope.position.x = params.x;
          scope.position.y = params.y;
      },
      setX : function(x){
          scope.position.x = x;
      },
      setY : function(y){
          scope.position.y = y;
      },
      setRotation : function(rotation){
          scope.rotation = rotation;
      },
      modifyX : function(x){
          scope.position.x += x;
      },
      modifyY : function(y){
          scope.position.y += y;
      },
      modifyRotation : function(rotation){
          scope.rotation += rotation;
      },
      getPosition: function(){
        return scope.position;
      },
      getRotation: function(){
        return scope.rotation;
      },
      modifyPositionRelatedToOrientation: function(params){ //Straight, side
        var straightCoeficients = scope.calculateStraightMovementCoeficient();
        var sideCoeficients = scope.calculateSideMovementCoeficient();
        
        scope.modifyPosition({x:straightCoeficients.coefX * params.straight + sideCoeficients.coefX * params.side,
                        y:straightCoeficients.coefY * params.straight + sideCoeficients.coefY * params.side});
      },
      getPositionRelatedToOrientation: function(params){ //Straight, side
        var straightCoeficients = scope.calculateStraightMovementCoeficient();
        var sideCoeficients = scope.calculateSideMovementCoeficient();
        
        return({x:straightCoeficients.coefX * params.straight + sideCoeficients.coefX * params.side,
                        y:straightCoeficients.coefY * params.straight + sideCoeficients.coefY * params.side});
      },
    };
  }
});


ò_ó.Describe('Wound' ,{
  privateInit: function(scope,params){
    
  },
  publicInterface : function(scope,params){// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
    return {
      
    };
  }
});

ò_ó.Describe('StatusHandler' ,{
  privateInit: function(scope,params){
    scope.stamina = params.stamina ? params.stamina : 6;
    scope.health = params.health ? params.health : 6;
    scope.wounds = [];
  },
  publicInterface : function(scope,params){// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
    return {
      
    };
  }
});

ò_ó.Describe('Displacement' ,{
  privateInit: function(scope,params){
     scope.parent = params.parent;
     scope.movementOptions = [];
     scope.visible = true;
     scope.container =  GBG.buildDomElement(scope.publicInterface,'<div class="displacementContainer"></div>');
  },
  publicInterface : function(scope,params){// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
    return {
      loadMovements : function(movements){
        var numberOfMovements = movements.length;
        scope.container.empty();
        scope.movementOptions = [];
        
        for (var i = 0;i <numberOfMovements; i++){
          var newMovement = ò_ó.create('Movement',movements[i]);
          scope.movementOptions.push(newMovement);
          newMovement.attachViewTo(scope.container);
          newMovement.setViewPosition();
        }
      },
      attachTo : function(element){
        $(element).append(scope.container);
      },
      setVisibility: function(visibility){
          if (visibility){
            $(scope.container).css({display:"initial"});
          }else{
            $(scope.container).css({display:"none"});
          }
          scope.visible = visibility;
      },
      toggleVisibility: function(){
          if (!scope.visible){
            $(scope.container).css({display:"initial"});
          }else{
            $(scope.container).css({display:"none"});
          }
          scope.visible = !scope.visible;
      }
    };
  }
});

ò_ó.Describe('Movement' ,{
  privateInit: function(scope,params){
    scope.relativeRotation = params.rotation ? params.rotation : 0;
    scope.relativePosition = params.position ? params.position : {x:0,y:100};
    scope.template = params.template ? params.template : {};
    scope.view = ò_ó.create('MovementView',{model:scope.publicInterface});
  },
  publicInterface : function(scope,params){// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
    return {
      attachViewTo : function(element){
        scope.view.attachViewTo(element);
      }, 
      setViewPosition : function(){
        scope.view.setLocation({rotation:scope.relativeRotation,position:scope.relativePosition});
      },
      onClick : function(params){
        params.relativeMovement(scope.publicInterface.getLocation());
      },
      getLocation :function(){
        return {position: {straight:(-1) * scope.relativePosition.y,side:scope.relativePosition.x}, rotation:scope.relativeRotation};
      },
    };
  }
});

ò_ó.Describe('MovementView' ,{
  privateInit: function(scope,params){
    scope.model = params.model;
    scope.container =  GBG.buildDomElement(scope.publicInterface,'<div class="movementView"></div>');
    
  },
  publicInterface : function(scope,params){// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
    return {
      attachViewTo : function (element){
      $(element).append(scope.container);
      },
      setLocation : function(params){
        TweenMax.to(scope.container,0.3,{ x:       params.position.x,
                                       y:       params.position.y,
                                       rotation:params.rotation,transformOrigin:"50% 50%", ease:Sine.easeOut});
      },
      hide : function(){
        TweenMax.to(scope.container,0.3,{ opacity:0,transformOrigin:"50% 50%", ease:Sine.easeOut});
      },
      show : function(){
        TweenMax.to(scope.container,0.3,{ opacity:0.4,transformOrigin:"50% 50%", ease:Sine.easeOut});
      },
      getModel : function(){
        return scope.model;
      }
    };
  }
});


/*
 var svg = document.getElementsByTagName('svg')[0]; //Get svg element
var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
newElement.setAttribute("d","M 0 0 L 10 10"); //Set path's data
newElement.style.stroke = "#000"; //Set stroke colour
newElement.style.strokeWidth = "5px"; //Set stroke width
svg.appendChild(newElement);
*/