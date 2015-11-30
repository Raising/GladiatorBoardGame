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

IBERO.buildDomElement = function( scope ,definingString){ // toda linea que llame a este metodo al generarse el elemento es necesario añadirlo al metodo INIT
  var newDomElement = $(definingString);
  newDomElement.attr("id",scope.getId());
  
  if (scope.getController){
    IBERO.DOM_TO_OBJECT_MAP[scope.getId()] = scope.getController();
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

IBERO.Create = function(className,params){
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
  if(!IBERO.Validate.Controller(className,classObject))return false;

	IBERO.ControllerClassList[className] = function(params,forcedPrivate){
		params = params ? params : {};
		var priv = forcedPrivate ? forcedPrivate : this,
		    heritage;
		
	 
    if (classObject.Extends !== undefined){
      heritage = IBERO.InjectControllerHeritage(priv,classObject.Extends,params);
      IBERO.InjectIdentifiers(priv,className);
      priv.publ  = classObject.publ(priv,params);
     Object.setPrototypeOf(priv.publ, heritage);
    }
    else{
      IBERO.InjectIdentifiers(priv,className);
  	  priv.publ  = classObject.publ(priv,params);
    }
  
		IBERO.InjectGenericMethods(priv);
		
		IBERO.InjectView(priv,classObject.view);
		
		classObject.builder(priv,params);

		return priv.publ;
	};
};


IBERO.Describe.View = function(className,classObject){
   if(!IBERO.Validate.View(className,classObject))return false;
  
  IBERO.ViewClassList[className] = function(params){
		params = params ? params : {};
		var priv = this;
		// variable privadas generales
	  IBERO.InjectIdentifiers(priv,className);

  	priv.publ  = classObject.publ(priv,params); 

  	priv.controller  = params.controller; 
  		//metodos generales
		IBERO.InjectGenericMethods(priv);
		
		IBERO.InjectMainDomElement(priv,classObject);
	
  		//
		classObject.builder(priv,params);

		return priv.publ;
	};
};

IBERO.Describe.Model = function(className,classObject){
   if(!IBERO.Validate.Model(className,classObject))return false;
   
   IBERO.ModelClassList[className] = function(params){
		params = params ? params : {};
		var priv = this;
		// variable privadas generales
	  IBERO.InjectIdentifiers(priv,className);

  	priv.publ  = classObject.publ(priv,params); 
  		//metodos generales
		IBERO.InjectGenericMethods(priv);
  		//
		classObject.builder(priv,params);

		return priv.publ;
	};
};



IBERO.Create.Controller = function(className,params){
	var newObject = new IBERO.ControllerClassList[className](params);

	  if (newObject.init){
	    newObject.init();
	  }
	  
	  IBERO.CREATED_OBJECTS[newObject.getId()] = newObject;
	  return newObject;
};

IBERO.Create.View = function(className,params){
	var newObject = new IBERO.ViewClassList[className](params);

	  if (newObject.init){
	    newObject.init();
	  }
	  
	  IBERO.CREATED_OBJECTS[newObject.getId()] = newObject;
	  return newObject;
};

IBERO.Create.Model = function(className,params){
	var newObject = new IBERO.ModelClassList[className](params);

	  if (newObject.init){
	    newObject.init();
	  }
	  
	  IBERO.CREATED_OBJECTS[newObject.getId()] = newObject;
	  return newObject;
};





IBERO.InjectIdentifiers = function(priv,className){
  priv.objectId = priv.ΦId() + '_' + className ;
	priv.objectType = className;
};

IBERO.InjectGenericMethods = function(priv){
  	priv.publ.getId = function(){
			return priv.objectId;
		};
		priv.publ.getObjectType = function(){
			return priv.objectType;
		};
		
		if (priv.controller !== undefined){
		  priv.publ.getController = function(){
		    return priv.controller;
		  };
		}
};
IBERO.InjectControllerHeritage = function(priv,extendedClass,params){
    return new IBERO.ControllerClassList[extendedClass](params,priv);
};

IBERO.InjectView = function(priv,params){
  if (params){
    params.controller = priv.publ;
    priv.view = ò_ó.Create.View(params.name,params);
  }
};

IBERO.InjectMainDomElement = function(priv,params){
  if (params.mainDomElement !== undefined){
  	  priv.mainDomElement = ò_ó.buildDomElement(priv.publ,params.mainDomElement.template);
  	
    	priv.publ.getDomElement = function(){
          return priv.mainDomElement;
      };
      priv.publ.addToDomElement = function(addedDomElement){
          priv.mainDomElement.append(addedDomElement.getView().getDomElement());
      };
      priv.publ.cleanDomElement = function(){
          priv.mainDomElement.empty();
      };
  	} 
};



IBERO.Validate = {
  Controller : function(className,classObject){
    if (typeof IBERO.ControllerClassList[className] !== 'undefined'){
  		console.error('you are trying to describe twice the same class');
  		return false;
	  }
	  
    return IBERO.hasAllRequiredMethods(className,classObject);
  },
  
  View : function(className,classObject){
    if (typeof IBERO.ViewClassList[className] !== 'undefined'){
  		console.error('you are trying to describe twice the same class');
  		return false;
	  }
	  
    return IBERO.hasAllRequiredMethods(className,classObject);
  },
  
  Model : function(className,classObject){
    if (typeof IBERO.ModelClassList[className] !== 'undefined'){
  		console.error('you are trying to describe twice the same class');
  		return false;
	  }
	  
    return IBERO.hasAllRequiredMethods(className,classObject);
  },
  
  Interface : function(className,classObject){
     if (typeof IBERO.InterfaceClassList[className] !== 'undefined'){
  		console.error('you are trying to describe twice the same class');
  		return false;
	  }
    
    return IBERO.hasOnlyFunctions(className,classObject);
  }
};




IBERO.hasAllRequiredMethods = function(className,classObject){
  var proxyPubl = classObject.publ({},{}); // necesita comprobar herencia
  
  
  
  if (classObject.Implements !== undefined){
      classObject.Implements.forEach(function(extendedClass){
  	    var method,
  	        extendedObject = IBERO.InterfaceClassList[extendedClass]();
  	    
  	    for (method in extendedObject){
  	      if (extendedObject.hasOwnProperty(method) && typeof extendedObject[method] === 'function'){
  	        if (proxyPubl[method] === undefined){
  	          console.error('class "'+className+'" is missing the implementation of method "'+method+'" from interface "'+extendedClass+'"'); 
  	          
  	          return false;
  	        }
  	      }
  	    }
      });
  	}
  	
  	return true;
};

IBERO.hasOnlyFunctions = function(className,classObject){
    var method;
    
    for (method in classObject){
      if (classObject.hasOwnProperty(method) && typeof extendedObject[method] !== 'function'){
          console.error('Interface "'+className+'" have a non function member -> "'+method+'"'); 
          
          return false;
      }
    }
  	return true;
};





















ò_ó = IBERO;



ò_ó.Describe.Interface('dummyInterface',{
  sayNon:function(){},
  sayHi:function(){}
});


ò_ó.Describe.Controller('inheritMe',{

  builder : function(priv,params){
      priv.fruit     = (params.fruit      ? params.fruit     :  []                          );
  },
  
  publ: function(priv,params){
    return {
      sayHi : function(){
        console.log('hellow inherited World');
      }
    };
  }
});


ò_ó.Describe.Controller('dummyController',{
  Implements:['dummyInterface'],
  Extends:'inheritMe',

  builder : function(priv,params){
      priv.equipment     = (params.equipment      ? params.equipment     :  []                          );
      priv.movements     = (params.movements      ? params.movements     :  []                          );
  
  },
  
  publ: function(priv,params){
    return {
      sayNon : function(){
        console.log('NO  NO NO NO ');
      }
    };
  }
});


nacho = ò_ó.Create.Controller('dummyController');
console.log(nacho);




