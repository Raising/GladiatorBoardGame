if (typeof Object.create !== 'function'){
  Object.create = function (o){
    var F = function () {};
    F.prototype = o;
    return new F();
  };
}


var GBG = {autor:'Ignacio Medina Castillo, Raising Spirit', github:'https://github.com/Raising', version:0.1, projectName:'Gladiator Board Game'};

GBG.GLADIATOR_RAIDUS = 50;
GBG.GLADIATOR_ARC_OFFSET = 3;
GBG.ARC_DEEP_DISTANCE = 5;

GBG.EquipmentArcs = {
  shields:{buclet:{
            orientation:130,
            deepLevel:1,
            type:['block'],
            widthLevels:[{from:40,to:60, color: '#3a3', cost:0},
                          {from:35,to:40, color: '#8a3', cost:1},
                          {from:30,to:35, color: '#777', cost:2},
                          {from:60,to:70, color: '#8a3', cost:1},
                          {from:70,to:75, color: '#777', cost:3}]
          }
        },
  weapons:{
          shortSword:{
            orientation:220,
            deepLevel:2,
            type:['slash','parry'],
            widthLevels:[{from:30,to:60, color: '#a33', cost:0},
                          {from:25,to:30, color: '#a83', cost:1},
                          {from:20,to:25, color: '#777', cost:2},
                          {from:60,to:77, color: '#a83', cost:1},
                          {from:77,to:85, color: '#777', cost:3}]
          }
        },
};




GBG.FieldEntityModel = function( params ){
  var params = params ? params : {};
  var me = this;
  this.equipment     = (params.equipment      ? params.equipment     :  []                        );
  this.statusHandler = (params.statusHandler  ? params.statusHandler :  new GBG.StatusHandler()   );
  this.localization  = (params.localization   ? params.localization  :  new GBG.Localization()    );
  this.displacement  = (params.displacement   ? params.displacement  :  new GBG.Displacement()    );
  this.view          = (params.view           ? params.view          :  new GBG.FieldEntityView(params) );
 
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    insertViewInto : function(element){
      return $(element).append(me.view.getView());
    },  
    getEquipment : function(){
      return me.equipment;
    },
    refreshEquipment : function(){
      var numEquipment = me.equipment.length;
      for (var i = 0 ; i<numEquipment; i++ ){
        me.view.addActionArc(me.equipment[i]);
      }
    }
  };
  
  return newObject; 
};




GBG.FieldEntityView = function( params ){
  var params = params ? params : {};
  var me = this;
  this.mainContainer = $('<div class="glaciatorMainContainer"></div>');
  this.arcHandler = new GBG.ArcHandler(params);
  

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
      
      addActionArc : function(params){
        me.arcHandler.addActionArc(params);
      },
      
      
  };
  
  return newObject; 
};

GBG.ArcHandler = function( params ){
  var params = params ? params : {};
  var me = this;
  this.actionArcs = [];
  this.id = 'archandler';
  this.graphic = $('<svg width="100px" height="100px" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve"></svg>');

  $(this.graphic).addClass('gladiadorSVG'); 
 
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    addActionArc : function(params){
       var newActionArc = new GBG.ActionArc(params);
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



GBG.ActionArc = function( params ){
  var params = params ? params : {};
  var me = this;
  this.deepLevel = params.deepLevel ? params.deepLevel : 1; //deepLevel es la distancia desde el borde al centro pongamos un maximo de 6 niveles ppor ejemplo la idea es que no se superpongan dibujos.
  this.widthLevels = params.widthLevels ? params.widthLevels : GBG.EquipmentArcs.shields.buclet;
  this.orientation = params.orientation ? params.orientation : 90;
  // me.graphic = $('<rect x="150" y="100" class="box" width="50" height="50"/>');
  this.arcSteps = [];
  this.graphic = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a SVG container
  var numOfArcSteps;
  
  this.addArcStep = function(params){
    var newArcStep =  new GBG.ActionArcView(params);
    me.arcSteps.push(newArcStep);
    me.graphic.appendChild(newArcStep.getArcStep());
  };
  
  
  
  
  
  
	tl = new TimelineMax({});
    

  tl.to(me.graphic, 1, {rotation:me.orientation,transformOrigin:"50% 50%"}, "Start");
  /*.fromTo(shapes, 0.1, {drawSVG:"0%"}, {drawSVG:"10%", immediateRender:false}, "+=0.1")
  .staggerTo(shapes, 1, {drawSVG:"90% 100%"}, 0.5)
  .to(shapes, 1, {rotation:360, scale:0.5, drawSVG:"100%", stroke:"white", strokeWidth:6, transformOrigin:"50% 50%"})
  .staggerTo(shapes, 0.5, {stroke:"red", scale:1.5, opacity:0}, 0.2)*/
  
  
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    getGraphic: function(){
      return me.graphic;
    },
    setActionArc: function(){
      var i;
      for (i = me.widthLevels.length-1; i>=0 ; i--){
        me.widthLevels[i].deepLevel = me.deepLevel;
        me.addArcStep(me.widthLevels[i]);      
      }
    },
  };
  
  return newObject; 
};


GBG.ActionArcView = function(params){
  var params = params ? params : {};
  var me = this;
  this.radius = params.deepLevel ? (GBG.GLADIATOR_RAIDUS - (params.deepLevel * GBG.ARC_DEEP_DISTANCE)-GBG.GLADIATOR_ARC_OFFSET).toString() :  GBG.GLADIATOR_RAIDUS.toString()-GBG.GLADIATOR_ARC_OFFSET;
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
    //Set path's data
  this.graphic.style.stroke = me.color; //Set stroke colour
  this.graphic.style.strokeWidth = "5px"; //Set stroke width
  
  tl = new TimelineMax({ repeat:0});
  tl.to(me.graphic, 3, {drawSVG:me.widthFrom+' '+me.widthTo});
 
  var newObject = {// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
  //Metodos Publicos  
    getArcStep: function(){
      return me.graphic;
    },
  };
  
  return newObject; 
}




GBG.Localization = function( params ){
  var params = params ? params : {};
  var me = this;
  this.position = params.position ? params.position : {x: 200, y : 300};
  this.rotation = params.rotation ? params.rotation : 0;
  
  this.calculateSideMovementCoeficient = function(){
    return Math.aTan2();
  };
  this.calculateStraightMovementCoeficient = function(){
    
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
      modifyPosition: function(params){
        if(params.x !== undefined && params.y !== undefined){
          me.position.x += params.x;
          me.position.y += params.y;
        }
        else{
          console.error('GBG.Localization.setPosition called with the wrong parameters, expested object with x and y values',params);
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
          console.error('GBG.Localization.setX called with the wrong parameters',y);
        }
      },
      getPosition: function(){
        return me.position;
      },
      getRotation: function(){
        return me.rotation;
      },
      modifyPositionRelatedToOrientation(params){
        
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