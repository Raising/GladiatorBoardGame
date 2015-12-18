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
    priv.equipment     = (params.equipment      ? params.equipment     :  []      );
    priv.statusHandler = (params.statusHandler  ? params.statusHandler :  ò_ó.Create.Controller('StatusHandler') );
    priv.situationTool   =     ò_ó.Create('SituationTool', {}          ,params.situationTool); 
    priv.optionSelector  = ò_ó.Create('OptionSelector', {optionsArray:params.options},params.optionSelector); 
    //
    
    priv.ΦlistenEvent(priv.view,'click','onClick',priv.publ);
    priv.optionSelector.renderTo(priv.view.getDomElement());
  },
  
  view: { name: 'FieldEntityView',
          params: {}
  },
  
  publ: function(publ,priv,params){
    
    publ.renderTo = function(element){
      priv.view.renderTo($(element));
    };
    publ.relativeMovement = function(params){
      priv.situationTool.modifyPositionRelatedToOrientation(params.coordinates);
      priv.situationTool.modifyRotation(params.rotation);
      priv.view.moveTo({coordinates:priv.situationTool.getPosition(),rotation:priv.situationTool.getRotation()});
    };
    publ.forcePosition = function(params){
       priv.situationTool.setPosition(params.coordinates);
       priv.situationTool.setRotation(params.rotation);
       priv.view.moveTo({coordinates:priv.situationTool.getPosition(),rotation:priv.situationTool.getRotation()});
    };
    publ.absoluteMovement = function(params){};
    
    publ.getEquipment = function(){
      return priv.equipment;
    };
    
    publ.refreshEquipment = function(){
      var numEquipment = priv.equipment.length;
      for (var i = 0 ; i<numEquipment; i++ ){
        priv.view.addActionArc(priv.equipment[i]);
      }
    };
    
    publ.onClick = function(event) {
      var objectClicked = ò_ó.getObjectFromDomElement(event.target);
      
      if (objectClicked.getObjectType() === 'FieldEntityController'){ // the object is itself
        priv.optionSelector.toggleVisibility(); // shall we open a menu instead of only togle movements optiones visibilitiy
      }
      else{
        objectClicked.onClick(priv.publ);  
      }
    };
    
    publ.onHoverIn = function(){
      console.log('hoverin');
    };
    
    publ.onHoverOut = function(){
     console.log('hoverout');
    };
    
    publ.setDisplacementVisibility= function(visibility){
      priv.optionSelector.toggleVisibility(visibility);
    };
  }
});

ò_ó.Describe.Interface('SituationTool',{
  classType: 'controller',
  defaultClass:'xWing2DSituationManipulator',
  setPosition:function(){},
  getPosition:function(){},
  
});

ò_ó.Describe.Controller('xWing2DSituationManipulator', {
  Implements:['SituationTool'],
  
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
  
  publ : function(publ,priv,params){

      publ.setPosition= function(params){
          priv.coordinates.x = params.x;
          priv.coordinates.y = params.y;
      };
      publ.setX = function(x){
          priv.coordinates.x = x;
      };
      publ.setY = function(y){
          priv.coordinates.y = y;
      };
      publ.setRotation = function(rotation){
          priv.rotation = rotation;
      };
      publ.modifyX = function(x){
          priv.coordinates.x += x;
      };
      publ.modifyY = function(y){
          priv.coordinates.y += y;
      };
      publ.modifyRotation = function(rotation){
          priv.rotation += rotation;
      };
      publ.getPosition= function(){
        return priv.coordinates;
      };
      publ.getRotation= function(){
        return priv.rotation;
      };
      publ.modifyPositionRelatedToOrientation= function(params){ //Straight, side
        var straightCoeficients = priv.calculateStraightMovementCoeficient();
        var sideCoeficients = priv.calculateSideMovementCoeficient();
        
        priv.modifyPosition({x:straightCoeficients.coefX * params.straight + sideCoeficients.coefX * params.side,
                        y:straightCoeficients.coefY * params.straight + sideCoeficients.coefY * params.side});
      };
      publ.getPositionRelatedToOrientation= function(params){ //Straight, side
        var straightCoeficients = priv.calculateStraightMovementCoeficient();
        var sideCoeficients = priv.calculateSideMovementCoeficient();
        
        return({x:straightCoeficients.coefX * params.straight + sideCoeficients.coefX * params.side,
                        y:straightCoeficients.coefY * params.straight + sideCoeficients.coefY * params.side});
      };

  }
});


ò_ó.Describe.Interface('OptionSelector',{
  classType: 'controller',
  defaultClass:'Movement2DSelector',
  toggleVisibility:function(){},
  renderTo:function(){},
  
});

ò_ó.Describe.Controller('Movement2DSelector' ,{
  Implements:['OptionSelector'],
  
  builder: function(priv,params){
    priv.positionOptions = params.optionsArray ? params.optionsArray : [];
    priv.movementOptions = [];
    priv.visible = true;
    
    priv.publ.loadMovementOptions();
  },
  
  view:{
    name:'Movement2DSelectorView'
  },
  
  publ : function(publ,priv,params){// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo

      publ.loadMovementOptions = function(){
        var numberOfMovements = priv.positionOptions.length;
        priv.view.cleanDomElement();
        priv.movementOptions = [];
        
        for (var i = 0;i <numberOfMovements; i++){
          var newMovement = ò_ó.Create.Controller('MovementController',priv.positionOptions[i]);
          priv.movementOptions.push(newMovement);
          newMovement.renderTo(priv.view.getDomElement());
          newMovement.setViewPosition();
        }
      };
      
      publ.setPositionOptions = function(positionsArray){
         priv.positionOptions = positionsArray;
      };
      
      publ.renderTo = function(element){
        priv.view.renderTo(element);
      };
      
      publ.getView = function(){
        return priv.view;
      };
      
      publ.toggleVisibility = function(visibility){
        if (visibility !== undefined){
          priv.view.setVisibility(visibility);
          priv.visible = visibility;
        }
        else{
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
  
  publ : function(publ,priv,params){// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
 
      publ.renderTo = function(element){
         priv.view.renderTo(element);
      };
      publ.setViewPosition = function(){
        priv.view.setLocation(priv.situation.getPosition());
      };
      publ.onClick = function(parentEntity){
        parentEntity.relativeMovement(priv.publ.getLocation());
        parentEntity.setDisplacementVisibility(false);
      };
      publ.getLocation =function(){
        return priv.situation.getPositionDisplacementFormat();
      };
 
  }
});


ò_ó.Describe.Model('Position2DModel',{
  builder: function(priv,params){
    priv.coordinates = params.coordinates ? params.coordinates : {x:0,y:100};
    priv.rotation = params.rotation ? params.rotation : 0;
    priv.template = params.template ? params.template : {};
  },
  
  publ : function(publ,priv,params){
 
      publ.getPositionDisplacementFormat= function(){
        return {coordinates: {straight:(-1) * priv.coordinates.y,side:priv.coordinates.x}, rotation:priv.rotation};
      };
      publ.getPosition= function(){
        return {coordinates:priv.coordinates, rotation:priv.rotation};
      };

  }
});


ò_ó.Describe.View('FieldEntityView',{
  
  builder: function(priv,params){
    priv.controller = params.controller;
    //priv.arcHandler =  ò_ó.Create.Controller('ArcHandler',params);
    //priv.mainDomElement.append(priv.arcHandler.getArcGraphics());
    
    $(priv.mainDomElement).click(function(event) {
       priv.publ.ΦfireEvent('click',event);
    });
  },
  
  mainDomElement:{
    template: '<div class="XwingMainContainer"></div>'
  },
  
  publ : function(publ,priv,params){
   
      publ.moveTo=function(position){
        var tl = new TimelineMax();
        tl.to(priv.mainDomElement,  0.5, { x:position.coordinates.x,y:position.coordinates.y,rotation:position.rotation,transformOrigin:"50% 50%", ease:Sine.easeOut});
      };
      publ.addActionArc = function(params){
       // priv.arcHandler.addActionArc(params);
      };

  }
});

ò_ó.Describe.View('Movement2DSelectorView',{
  
  builder: function(priv,params){
  },
  
  mainDomElement:{
    template: '<div class="displacementContainer"></div>'
  },
  
  publ : function(publ,priv,params){

      publ.setVisibility= function(visibility){
          if (visibility){
            $(priv.mainDomElement).css({display:"initial"});
          }else{
            $(priv.mainDomElement).css({display:"none"});
          }
          priv.visible = visibility;
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
  
  publ : function(publ,priv,params){

      publ.setLocation = function(params){
        TweenMax.to(priv.mainDomElement,0.3,{ x:       params.coordinates.x,
                                              y:       params.coordinates.y,
                                              rotation:params.rotation,transformOrigin:"50% 50%", ease:Sine.easeOut});
      };
      publ.hide = function(){
        TweenMax.to(priv.mainDomElement,0.3,{ opacity:0,transformOrigin:"50% 50%", ease:Sine.easeOut});
      };
      publ.show = function(){
        TweenMax.to(priv.mainDomElement,0.3,{ opacity:0.4,transformOrigin:"50% 50%", ease:Sine.easeOut});
      };

  }
});


ò_ó.Describe.Model('Position2DArrayModel',{
  builder: function(priv,params){
     priv.movementOptions = params ? params : [];
  },
  
  publ: function(publ,priv,params){

      publ.forEach= function(callBack){
        var index;
        for (index in priv.movementOptions){
          callBack(priv.movementOptions[index]);
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