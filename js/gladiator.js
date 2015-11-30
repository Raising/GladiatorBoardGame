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

ò_ó.Describe.Controller('FieldEntityController',{

  builder: function(priv,params){
      priv.equipment     = (params.equipment      ? params.equipment     :  []                          );
      priv.movements     = (params.movements      ? params.movements     :  []                          );
      priv.statusHandler = (params.statusHandler  ? params.statusHandler :  ò_ó.Create.Controller('StatusHandler') );
      priv.localization  = (params.localization   ? params.localization  :  ò_ó.Create.Controller('Localization')  );
      priv.displacement  = (params.displacement   ? params.displacement  :  ò_ó.Create.Controller('Displacement', {positionsArray:params.movements})); 
   
      priv.ΦlistenEvent(priv.view,'click','onClick',priv.publ);
      priv.view.addToDomElement(priv.displacement);
  },
  
  view: { name: 'FieldEntityView',
          params: {}
  },

  publ: function(priv,params){
    return {
      insertViewInto : function(element){
        $(element).append(priv.view.getDomElement());
      },
      relativeMovement : function(params){
        priv.localization.modifyPositionRelatedToOrientation(params.coordinates);
        priv.localization.modifyRotation(params.rotation);
        priv.view.moveTo({coordinates:priv.localization.getPosition(),rotation:priv.localization.getRotation()});
      },
      forcePosition : function(params){
         priv.localization.setPosition(params.coordinates);
         priv.localization.setRotation(params.rotation);
         priv.view.moveTo({coordinates:priv.localization.getPosition(),rotation:priv.localization.getRotation()});
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
      onClick : function(event) {
        var objectClicked = ò_ó.getObjectFromDomElement(event.target);
        
        if (objectClicked.getObjectType() === 'FieldEntityController'){ // the object is itself
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
      },
      setDisplacementVisibility: function(visibility){
        priv.displacement.setVisibility(visibility);
      }
    };
  }
});



ò_ó.Describe.Controller('Localization', {
  
  builder: function(priv,params){
    priv.coordinates = params.coordinates ? params.coordinates : {x: 200, y : 300};
    priv.rotation = params.rotation ? params.rotation : 0;
    
    priv.calculateStraightMovementCoeficient = function(){
      return {coefX:Math.sin(Math.radians(priv.rotation)),coefY:(-1) * Math.cos(Math.radians(priv.rotation))};
    };
    priv.calculateSideMovementCoeficient = function(){
      return {coefX:Math.cos(Math.radians(priv.rotation)),coefY:(1) * Math.sin(Math.radians(priv.rotation))};
    };
    priv.modifyPosition = function(params){
        priv.coordinates.x += params.x;
        priv.coordinates.y += params.y;
    };
  },
  
  publ : function(priv,params){// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
    return {
      setPosition: function(params){
          priv.coordinates.x = params.x;
          priv.coordinates.y = params.y;
      },
      setX : function(x){
          priv.coordinates.x = x;
      },
      setY : function(y){
          priv.coordinates.y = y;
      },
      setRotation : function(rotation){
          priv.rotation = rotation;
      },
      modifyX : function(x){
          priv.coordinates.x += x;
      },
      modifyY : function(y){
          priv.coordinates.y += y;
      },
      modifyRotation : function(rotation){
          priv.rotation += rotation;
      },
      getPosition: function(){
        return priv.coordinates;
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




ò_ó.Describe.Controller('Displacement' ,{
  builder: function(priv,params){
    priv.positionOptions = params.positionsArray ? params.positionsArray : [];
    priv.movementOptions = [];
    priv.visible = true;
    
    priv.publ.loadMovementOptions();
     
       
  },
  
  view:{
    name:'DisplacementView'
  },
  
  publ : function(priv,params){// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
    return {
      loadMovementOptions : function(){
        var numberOfMovements = priv.positionOptions.length;
        priv.view.cleanDomElement();
        priv.movementOptions = [];
        
        for (var i = 0;i <numberOfMovements; i++){
          var newMovement = ò_ó.Create.Controller('MovementController',priv.positionOptions[i]);
          priv.movementOptions.push(newMovement);
          priv.view.addToDomElement(newMovement);
          newMovement.setViewPosition();
        }
      },
      setPositionOptions : function(positionsArray){
         priv.positionOptions = positionsArray;
      },
      attachTo : function(element){
        $(element).append(priv.container);
      },
      setVisibility: function(visibility){
          priv.view.setVisibility(visibility);
          
          priv.visible = visibility;
      },
      getView: function(){
        return priv.view;
      },
      toggleVisibility: function(){
          if (!priv.visible){
            priv.view.setVisibility(true);
          }else{
            priv.view.setVisibility(false);
          }
          priv.visible = !priv.visible;
      }
    };
  }
});


ò_ó.Describe.Controller('MovementController' ,{
  builder: function(priv,params){
     priv.situation =  ò_ó.Create.Model('Position2DModel',params);
  },
  
  view:{
    name: 'MovementView'
  },
  
  publ : function(priv,params){// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
    return {
      getView: function(){
        return priv.view;
      },
      setViewPosition : function(){
        priv.view.setLocation(priv.situation.getPosition());
      },
      onClick : function(parentEntity){
        parentEntity.relativeMovement(priv.publ.getLocation());
        parentEntity.setDisplacementVisibility(false);
      },
      getLocation :function(){
        return priv.situation.getPositionDisplacementFormat();
      },
    };
  }
});


ò_ó.Describe.Model('Position2DModel',{
  builder: function(priv,params){
    priv.coordinates = params.coordinates ? params.coordinates : {x:0,y:100};
    priv.rotation = params.rotation ? params.rotation : 0;
    priv.template = params.template ? params.template : {};
  },
  
  publ : function(priv,params){
    return {
      getPositionDisplacementFormat: function(){
        return {coordinates: {straight:(-1) * priv.coordinates.y,side:priv.coordinates.x}, rotation:priv.rotation};
      },
      getPosition: function(){
        return {coordinates:priv.coordinates, rotation:priv.rotation};
      }
    };
  }
});


ò_ó.Describe.View('FieldEntityView',{
  
  builder: function(priv,params){
    priv.controller = params.controller;
    priv.arcHandler =  ò_ó.Create.Controller('ArcHandler',params);
    priv.mainDomElement.append(priv.arcHandler.getArcGraphics());
    
    $(priv.mainDomElement).click(function(event) {
       priv.publ.ΦfireEvent('click',event);
    });
  },
  
  mainDomElement:{
    template: '<div class="XwingMainContainer"></div>'
  },
  
  publ : function(priv,params){
    return {
      moveTo:function(position){
        var tl = new TimelineMax();
        tl.to(priv.mainDomElement,  0.5, { x:position.coordinates.x,y:position.coordinates.y,rotation:position.rotation,transformOrigin:"50% 50%", ease:Sine.easeOut});
      },
      addActionArc : function(params){
        priv.arcHandler.addActionArc(params);
      }
    };
  }
});

ò_ó.Describe.View('DisplacementView',{
  
  builder: function(priv,params){
  },
  
  mainDomElement:{
    template: '<div class="displacementContainer"></div>'
  },
  
  publ : function(priv,params){
    return {
      setVisibility: function(visibility){
          if (visibility){
            $(priv.mainDomElement).css({display:"initial"});
          }else{
            $(priv.mainDomElement).css({display:"none"});
          }
          priv.visible = visibility;
      },
    };
  }
});

ò_ó.Describe.View('MovementView' ,{
  builder: function(priv,params){
    priv.controller = params.controller;
  },
  
  mainDomElement:{
    template: '<div class="movementView"></div>'
  },
  
  publ : function(priv,params){
    return {
      setLocation : function(params){
        TweenMax.to(priv.mainDomElement,0.3,{ x:       params.coordinates.x,
                                              y:       params.coordinates.y,
                                              rotation:params.rotation,transformOrigin:"50% 50%", ease:Sine.easeOut});
      },
      hide : function(){
        TweenMax.to(priv.mainDomElement,0.3,{ opacity:0,transformOrigin:"50% 50%", ease:Sine.easeOut});
      },
      show : function(){
        TweenMax.to(priv.mainDomElement,0.3,{ opacity:0.4,transformOrigin:"50% 50%", ease:Sine.easeOut});
      }
    };
  }
});


ò_ó.Describe.Model('Position2DArrayModel',{
  builder: function(priv,params){
     priv.movementOptions = params ? params : [];
  },
  
  publ: function(priv,params){
    return {
      forEach: function(callBack){
        var index;
        for (index in priv.movementOptions){
          callBack(priv.movementOptions[index]);
        }
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