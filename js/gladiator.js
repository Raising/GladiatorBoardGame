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

ò_ó.Describe('FieldEntityModel',{

  privateInit: function(priv,params){
      priv.equipment     = (params.equipment      ? params.equipment     :  []                          );
      priv.movements     = (params.movements      ? params.movements     :  []                          );
      priv.statusHandler = (params.statusHandler  ? params.statusHandler :  ò_ó.create('StatusHandler') );
      priv.localization  = (params.localization   ? params.localization  :  ò_ó.create('Localization')  );
      priv.displacement  = (params.displacement   ? params.displacement  :  ò_ó.create('Displacement')  );
      //priv.eventHandler  = (params.eventHandler   ? params.eventHandler  :  ò_ó.create('FieldEntityEventHandler')  );
      //View, should be declared after the public interface.
      priv.view = ò_ó.create('FieldEntityView',{controller: priv.publ});
      priv.ΦlistenEvent(priv.view,'click','onClick',priv.publ);
  },
  
  publ: function(priv,params){
    return {
      insertViewInto : function(element){
        $(element).append(priv.view.getView());
      },
      relativeMovement : function(params){
        priv.localization.modifyPositionRelatedToOrientation(params.position);
        priv.localization.modifyRotation(params.rotation);
        priv.view.moveTo({position:priv.localization.getPosition(),rotation:priv.localization.getRotation()});
      },
      forcePosition : function(params){
         priv.localization.setPosition(params.position);
         priv.localization.setRotation(params.rotation);
         priv.view.moveTo({position:priv.localization.getPosition(),rotation:priv.localization.getRotation()});
      },
      absoluteMovement : function(params){},
      getEquipment : function(){
        return priv.equipment;
      },
      refreshEquipment : function(){
        var numEquipment = priv.equipment.length;
        for (var i = 0 ; i<numEquipment; i++ ){
          priv.view.addActionArc(priv.equipment[i]);
        }
      },
      loadDisplacement : function() {
        priv.displacement.loadMovements(priv.movements);
        priv.displacement.attachTo(priv.view.getView());
      },
      onClick : function(event) {
        var objectClicked = ò_ó.getObjectFromDomElement(event.target);
        
        if (objectClicked.objectType === 'FieldEntityModel'){ // the object is itself
          priv.displacement.toggleVisibility(); // shall we open a menu instead of only togle movements optiones visibilitiy
        }
        else{
          objectClicked.onClick(priv.publ);  
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
  
  privateInit: function(priv,params){
    priv.controller = params.controller;
    priv.arcHandler =  ò_ó.create('ArcHandler',params);
    priv.mainContainer =  ò_ó.buildDomElement(priv.publ,'<div class="XwingMainContainer"></div>');
    priv.mainContainer.append(priv.arcHandler.getArcGraphics());
    
    $(priv.mainContainer).click(function(event) {
       priv.publ.ΦfireEvent('click',event);
    });
  },
  
  publ : function(priv,params){// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos
    return {
      getView: function(){
        return priv.mainContainer;
      },
      moveTo:function(localization){
        var tl = new TimelineMax();
        tl.to(priv.mainContainer,  0.5, { x:localization.position.x,y:localization.position.y,rotation:localization.rotation,transformOrigin:"50% 50%", ease:Sine.easeOut});
      },
      addActionArc : function(params){
        priv.arcHandler.addActionArc(params);
      },
      getModel: function(){
        return priv.controller;
      }
    };
  }
});

ò_ó.Describe('ArcHandler',{
  
  privateInit: function(priv,params){
    priv.actionArcs = [];
    priv.graphic =  ò_ó.buildDomElement(priv.publ,'<svg class="arcHandlerContainer" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve"></svg>');
  },
  
  publ : function(priv,params){// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos
    return {
      addActionArc : function(params){
         var newActionArc =  ò_ó.create('ActionArcModel',params);
         priv.graphic[0].appendChild(newActionArc.getGraphic());
         priv.actionArcs.push(newActionArc);
         newActionArc.setActionArc();
      },
      getArcGraphics: function(){
        return priv.graphic;
      }
    };
  } 
});


ò_ó.Describe('ActionArcModel',{
  
  privateInit: function(priv,params){
    priv.deepLevel = params.deepLevel ? params.deepLevel : 1; //deepLevel es la distancia desde el borde al centro pongamos un maximo de 6 niveles ppor ejemplo la idea es que no se superpongan dibujos.
    priv.widthLevels = params.widthLevels ? params.widthLevels : GBG.EquipmentArcs.shields.buclet;
    priv.orientation = params.orientation ? 90 + params.orientation : 90;
    // priv.graphic = $('<rect x="150" y="100" class="box" width="50" height="50"/>');
    priv.arcSteps = [];
    priv.graphic = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a SVG container
  
    priv.addArcStep = function(params){
      var newArcStep =   ò_ó.create('ActionArcView',params);
      priv.arcSteps.push(newArcStep);
      priv.graphic.appendChild(newArcStep.getArcStep());
    };
    
    TweenMax.to(priv.graphic, 1, {rotation:priv.orientation,transformOrigin:"50% 50%"}); 
  },
  
  publ : function(priv,params) {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    return {
      getGraphic: function(){
        return priv.graphic;
      },
      setActionArc: function(){
        var i;
        for (i = priv.widthLevels.length-1; i>=0 ; i--){
          priv.widthLevels[i].deepLevel = priv.deepLevel;
          priv.widthLevels[i].model = priv.publ;
          priv.addArcStep(priv.widthLevels[i]);      
        }
      },
    };
  }
});

ò_ó.Describe('ActionArcView' ,{
  
  privateInit: function(priv,params){
    priv.model = params.model;
    priv.radius = params.deepLevel ? (GBG.GLADIATOR_RAIDUS - ((params.deepLevel-1) * GBG.ARC_DEEP_DISTANCE)-GBG.GLADIATOR_ARC_params).toString() :  GBG.GLADIATOR_RAIDUS.toString()-GBG.GLADIATOR_ARC_params;
    priv.widthFrom = params.from ?  params.from + '%' :  '50%';
    priv.widthTo = params.to ?  params.to + '%' :  '50%';
    priv.color = params.color ?  params.color : '#49a';
    priv.graphic = document.createElementNS("http://www.w3.org/2000/svg", 'circle'); //Create a path in SVG's naprivspace
    priv.graphic.setAttribute("x","0"); 
    priv.graphic.setAttribute("y","0");
    priv.graphic.setAttribute("fill","none") ;
    priv.graphic.setAttribute("r",priv.radius); 
    priv.graphic.setAttribute("cx","50"); 
    priv.graphic.setAttribute("cy","50");
    
    priv.graphic.style.stroke = priv.color; //Set stroke colour
    priv.graphic.style.strokeWidth = "5px"; //Set stroke width
    TweenMax.to(priv.graphic, 4, {drawSVG:priv.widthFrom+' '+priv.widthTo,delay:1,ease:Elastic.easeOut});
  },
  
  publ : function(priv,params) {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
    return {
      getArcStep: function(){
        return priv.graphic;
      }
    };
  }
});


ò_ó.Describe('Localization', {
  
  privateInit: function(priv,params){
    priv.position = params.position ? params.position : {x: 200, y : 300};
    priv.rotation = params.rotation ? params.rotation : 0;
    
    priv.calculateStraightMovementCoeficient = function(){
      return {coefX:Math.sin(Math.radians(priv.rotation)),coefY:(-1) * Math.cos(Math.radians(priv.rotation))};
    };
    priv.calculateSideMovementCoeficient = function(){
      return {coefX:Math.cos(Math.radians(priv.rotation)),coefY:(1) * Math.sin(Math.radians(priv.rotation))};
    };
    priv.modifyPosition = function(params){
      if(params.x !== undefined && params.y !== undefined){
        priv.position.x += params.x;
        priv.position.y += params.y;
      }
      else{
        console.error('ò_ó.Localization.setPosition called with the wrong parameters, expested object with x and y values',params);
      }
    };
  },
  
  publ : function(priv,params){// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
    return {
      setPosition: function(params){
          priv.position.x = params.x;
          priv.position.y = params.y;
      },
      setX : function(x){
          priv.position.x = x;
      },
      setY : function(y){
          priv.position.y = y;
      },
      setRotation : function(rotation){
          priv.rotation = rotation;
      },
      modifyX : function(x){
          priv.position.x += x;
      },
      modifyY : function(y){
          priv.position.y += y;
      },
      modifyRotation : function(rotation){
          priv.rotation += rotation;
      },
      getPosition: function(){
        return priv.position;
      },
      getRotation: function(){
        return priv.rotation;
      },
      modifyPositionRelatedToOrientation: function(params){ //Straight, side
        var straightCoeficients = priv.calculateStraightMovementCoeficient();
        var sideCoeficients = priv.calculateSideMovementCoeficient();
        
        priv.modifyPosition({x:straightCoeficients.coefX * params.straight + sideCoeficients.coefX * params.side,
                        y:straightCoeficients.coefY * params.straight + sideCoeficients.coefY * params.side});
      },
      getPositionRelatedToOrientation: function(params){ //Straight, side
        var straightCoeficients = priv.calculateStraightMovementCoeficient();
        var sideCoeficients = priv.calculateSideMovementCoeficient();
        
        return({x:straightCoeficients.coefX * params.straight + sideCoeficients.coefX * params.side,
                        y:straightCoeficients.coefY * params.straight + sideCoeficients.coefY * params.side});
      },
    };
  }
});


ò_ó.Describe('Wound' ,{
  privateInit: function(priv,params){
    
  },
  publ : function(priv,params){// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
    return {
      
    };
  }
});

ò_ó.Describe('StatusHandler' ,{
  privateInit: function(priv,params){
    priv.stamina = params.stamina ? params.stamina : 6;
    priv.health = params.health ? params.health : 6;
    priv.wounds = [];
  },
  publ : function(priv,params){// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
    return {
      
    };
  }
});

ò_ó.Describe('Displacement' ,{
  privateInit: function(priv,params){
     priv.parent = params.parent;
     priv.movementOptions = [];
     priv.visible = true;
     priv.container =  ò_ó.buildDomElement(priv.publ,'<div class="displacementContainer"></div>');
  },
  publ : function(priv,params){// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
    return {
      loadMovements : function(movements){
        var numberOfMovements = movements.length;
        priv.container.empty();
        priv.movementOptions = [];
        
        for (var i = 0;i <numberOfMovements; i++){
          var newMovement = ò_ó.create('Movement',movements[i]);
          priv.movementOptions.push(newMovement);
          newMovement.attachViewTo(priv.container);
          newMovement.setViewPosition();
        }
      },
      attachTo : function(element){
        $(element).append(priv.container);
      },
      setVisibility: function(visibility){
          if (visibility){
            $(priv.container).css({display:"initial"});
          }else{
            $(priv.container).css({display:"none"});
          }
          priv.visible = visibility;
      },
      toggleVisibility: function(){
          if (!priv.visible){
            $(priv.container).css({display:"initial"});
          }else{
            $(priv.container).css({display:"none"});
          }
          priv.visible = !priv.visible;
      }
    };
  }
});

ò_ó.Describe('Movement' ,{
  privateInit: function(priv,params){
    priv.relativeRotation = params.rotation ? params.rotation : 0;
    priv.relativePosition = params.position ? params.position : {x:0,y:100};
    priv.template = params.template ? params.template : {};
    priv.view = ò_ó.create('MovementView',{model:priv.publ});
  },
  publ : function(priv,params){// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
    return {
      attachViewTo : function(element){
        priv.view.attachViewTo(element);
      }, 
      setViewPosition : function(){
        priv.view.setLocation({rotation:priv.relativeRotation,position:priv.relativePosition});
      },
      onClick : function(params){
        params.relativeMovement(priv.publ.getLocation());
      },
      getLocation :function(){
        return {position: {straight:(-1) * priv.relativePosition.y,side:priv.relativePosition.x}, rotation:priv.relativeRotation};
      },
    };
  }
});

ò_ó.Describe('MovementView' ,{
  privateInit: function(priv,params){
    priv.model = params.model;
    priv.container =  ò_ó.buildDomElement(priv.publ,'<div class="movementView"></div>');
    
  },
  publ : function(priv,params){// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
    return {
      attachViewTo : function (element){
      $(element).append(priv.container);
      },
      setLocation : function(params){
        TweenMax.to(priv.container,0.3,{ x:       params.position.x,
                                       y:       params.position.y,
                                       rotation:params.rotation,transformOrigin:"50% 50%", ease:Sine.easeOut});
      },
      hide : function(){
        TweenMax.to(priv.container,0.3,{ opacity:0,transformOrigin:"50% 50%", ease:Sine.easeOut});
      },
      show : function(){
        TweenMax.to(priv.container,0.3,{ opacity:0.4,transformOrigin:"50% 50%", ease:Sine.easeOut});
      },
      getModel : function(){
        return priv.model;
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