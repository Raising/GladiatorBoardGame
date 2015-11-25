IBERO = {Author : 'Ignacio Medina Castillo'};
IBERO.ClassList = {};
IBERO.ControllerClassList = {};
IBERO.InterfaceClassList = {};
IBERO.ViewClassList = {};
IBERO.ModelClassList = {};

IBERO.ID_COUNTER = 0;
IBERO.CREATED_OBJECTS = {};

IBERO.DOM_TO_OBJECT_MAP = {};

IBERO.prototipeRepository = {};

IBERO.getNewId = function(){
  IBERO.ID_COUNTER += 1;
  var str = "" + IBERO.ID_COUNTER;
  var pad = "000000000";
  str = pad.substring(0, pad.length - str.length) + str;
  return str;
};

IBERO.buildDomElement = function( scope ,definingString){ // toda linea que llame a este metodo al generarse el elemento es necesario añadirlo al metodo INIT
  var newDomElement = $(definingString);
  newDomElement.attr("id",scope.getId());
  if (scope.getModel){
    IBERO.DOM_TO_OBJECT_MAP[scope.getId()] = scope.getModel();
  }
  else{
    IBERO.DOM_TO_OBJECT_MAP[scope.getId()] = scope;
  }
  
  return newDomElement;
};


IBERO.getObjectFromDomElement = function(DOMElement){
  return IBERO.DOM_TO_OBJECT_MAP[DOMElement.id];
};


IBERO.Describe = function(className,classObject){
	if (typeof IBERO.ClassList[className] !== 'undefined'){
		console.error('you are trying to describe two time the same class');
		return false;
	}

	IBERO.ClassList[className] = function(params){
		params = params ? params : {};
		var me = this;
		// variable privadas generales
		this.objectId = this.ΦId() + '_' + className ;
		this.objectType = className;
  		//

  	this.publ  = classObject.publ(this,params); 
  		//metodos generales
		this.publ.getId = function(){
			return me.objectId;
		};
		
		this.publ.getObjectType = function(){
			return me.objectType;
		};
  		//
		classObject.privateInit(this,params);

		return this.publ;
	};
};

IBERO.create = function(className,params){
	var newObject = new IBERO.ClassList[className](params);
	newObject.objectType = className;
	newObject.objectId = newObject.ΦId() + '_' + className ;
	  
	  if (newObject.init){
	    newObject.init();
	  }
	  IBERO.CREATED_OBJECTS[newObject.objectId] = newObject;
	  return newObject;
};






IBERO.Describe.Interface = function(className,classObject){
  if (typeof IBERO.InterfaceClassList[className] !== 'undefined'){
		console.error('you are trying to describe two time the same class');
		return false;
	}
	
	IBERO.InterfaceClassList[className] = function(){
	  return classObject;
	};
};


IBERO.Describe.Controller = function(className,classObject){
	var proxyPubl = classObject.publ({},{}); 
	    
  if (typeof IBERO.ControllerClassList[className] !== 'undefined'){
		console.error('you are trying to describe two time the same class');
		return false;
	}
	
	if (classObject.Extends !== undefined){
      classObject.Extends.forEach(function(extendedClass){
  	    var method,
  	        extendedObject = IBERO.InterfaceClassList[extendedClass]();
  	    
  	    for (method in extendedObject){
  	      if (extendedObject.hasOwnProperty(method) && typeof extendedObject[method] === 'function'){
  	        if (proxyPubl[method] === undefined){
  	          console.error('class "'+className+
  	          '" is missing the implementation of method "'+method+
  	          '" from interface "'+extendedClass+'"'); 
  	          
  	          return false;
  	        }
  	      }
  	    }
      });
	}
	

	IBERO.ControllerClassList[className] = function(params){
		params = params ? params : {};
		var me = this;
		// variable privadas generales
		this.objectId = this.ΦId() + '_' + className ;
		this.objectType = className;
  		//

  	this.publ  = classObject.publ(this,params); 
  		//metodos generales
		this.publ.getId = function(){
			return me.objectId;
		};
		
		this.publ.getObjectType = function(){
			return me.objectType;
		};
  		//
		classObject.privateInit(this,params);

		return this.publ;
	};
};

IBERO.Describe.View = function(className,classObject){};
IBERO.Describe.Model = function(className,classObject){};






ò_ó = IBERO;

ò_ó.Describe.Interface('dummyInterface',{
  getEquipment:function(){},
  dummyMethod:function(){}
});



ò_ó.Describe.Controller('dummyController',{
  Extends:['dummyInterface'],

  privateInit: function(priv,params){
      priv.equipment     = (params.equipment      ? params.equipment     :  []                          );
      priv.movements     = (params.movements      ? params.movements     :  []                          );
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






