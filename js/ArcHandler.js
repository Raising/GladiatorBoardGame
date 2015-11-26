
ò_ó.Describe.Controller('ArcHandler',{
  
  builder: function(priv,params){
    priv.actionArcs = [];
    priv.graphic =  ò_ó.buildDomElement(priv.publ,'<svg class="arcHandlerContainer" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve"></svg>');
  },
  
  publ : function(priv,params){
    return {
      addActionArc : function(params){
         var newActionArc =  ò_ó.Create.Controller('ActionArcModel',params);
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


ò_ó.Describe.Controller('ActionArcModel',{
  
  builder: function(priv,params){
    priv.deepLevel = params.deepLevel ? params.deepLevel : 1; //deepLevel es la distancia desde el borde al centro pongamos un maximo de 6 niveles ppor ejemplo la idea es que no se superpongan dibujos.
    priv.widthLevels = params.widthLevels ? params.widthLevels : GBG.EquipmentArcs.shields.buclet;
    priv.orientation = params.orientation ? 90 + params.orientation : 90;
    // priv.graphic = $('<rect x="150" y="100" class="box" width="50" height="50"/>');
    priv.arcSteps = [];
    priv.graphic = document.createElementNS("http://www.w3.org/2000/svg", 'g'); //Create a SVG container
  
    priv.addArcStep = function(params){
      var newArcStep =   ò_ó.Create.View('ActionArcView',params);
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
          priv.widthLevels[i].controller = priv.publ;
          priv.addArcStep(priv.widthLevels[i]);      
        }
      },
    };
  }
});

ò_ó.Describe.View('ActionArcView' ,{
  
  builder: function(priv,params){
    priv.controller = params.controller;
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

ò_ó.Describe.Model('Wound' ,{
  builder: function(priv,params){
    
  },
  publ : function(priv,params){// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
    return {
      
    };
  }
});

ò_ó.Describe.Controller('StatusHandler' ,{
  builder: function(priv,params){
    priv.stamina = params.stamina ? params.stamina : 6;
    priv.health = params.health ? params.health : 6;
    priv.wounds = [];
  },
  publ : function(priv,params){// si se quiere hacer herencia prototipada poner prototype: objetoPrototipo
    return {
      
    };
  }
});