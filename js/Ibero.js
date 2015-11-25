IBERO = {Author : 'Ignacio Medina Castillo'};
IBERO.ClassList = {};

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
  newDomElement.attr("id",scope.objectId);
  if (scope.getModel){
    IBERO.DOM_TO_OBJECT_MAP[scope.objectId] = scope.getModel();
  }
  else{
    IBERO.DOM_TO_OBJECT_MAP[scope.objectId] = scope;
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
		this.publ.objectId = me.objectId;
		
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
	  //IBERO.CREATED_OBJECTS[newObject.objectId] = newObject;
	  return newObject;
};

ò_ó = IBERO;