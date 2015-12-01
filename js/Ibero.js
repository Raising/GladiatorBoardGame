IBERO = {Author : 'Ignacio Medina Castillo'};
IBERO.classList = {};
IBERO.classList.controller = {};
IBERO.classList.interface = {};
IBERO.classList.view = {};
IBERO.classList.model = {};

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
	if (typeof IBERO.classList[className] !== 'undefined'){
		console.error('you are trying to describe two time the same class');
		return false;
	}

	IBERO.classList[className] = function(params){
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
	var newObject = new IBERO.classList[className](params);
	newObject.objectType = className;
	newObject.objectId = newObject.ΦId() + '_' + className ;
	  
	  if (newObject.init){
	    newObject.init();
	  }
	  IBERO.CREATED_OBJECTS[newObject.objectId] = newObject;
	  return newObject;
};



IBERO.Describe.Interface = function(className,classObject){
  var classType = 'interface';
  
  if(!IBERO.validateClass(className,classObject,classType))return false;
	
	IBERO.classList.interface[className] = function(){
	  return classObject;
	};
	
	IBERO.classList[classType][className].DOC = classObject;
};


IBERO.Describe.Controller = function(className,classObject){
  var classType = 'controller';
  
  if(!IBERO.validateClass(className,classObject,classType))return false;

	IBERO.classList[classType][className] = function(params,forcedPrivate){
		params = params ? params : {};
		var priv = forcedPrivate ? forcedPrivate : this;
		
	  IBERO.createPublic(priv,className,classObject,params,classType);
  
		IBERO.InjectGenericMethods(priv);
		
		IBERO.InjectView(priv,classObject.view);
		
		classObject.builder(priv,params);

		return priv.publ;
	};
	
	IBERO.classList[classType][className].DOC = classObject;
};


IBERO.Describe.View = function(className,classObject){
  var classType = 'view';
  
  if(!IBERO.validateClass(className,classObject,classType))return false;
  
  IBERO.classList[classType][className] = function(params){
		params = params ? params : {};
		var priv = this;
		// variable privadas generales
	  IBERO.createPublic(priv,className,classObject,params,classType);

  	priv.controller  = params.controller; 
  		//metodos generales
		IBERO.InjectGenericMethods(priv);
		
		IBERO.InjectMainDomElement(priv,classObject);
	
  		//
		classObject.builder(priv,params);

		return priv.publ;
	};
	
	IBERO.classList[classType][className].DOC = classObject;
};

IBERO.Describe.Model = function(className,classObject){
   var classType = 'model';
  
  if(!IBERO.validateClass(className,classObject,classType))return false;
   
   IBERO.classList[classType][className] = function(params){
		params = params ? params : {};
		var priv = this;
		// variable privadas generales
	  IBERO.createPublic(priv,className,classObject,params,classType);
  		//metodos generales
		IBERO.InjectGenericMethods(priv);
  		//
		classObject.builder(priv,params);

		return priv.publ;
	};
	
	IBERO.classList[classType][className].DOC = classObject;
};



IBERO.Create.Controller = function(className,params){
	var newObject = new IBERO.classList.controller[className](params);

	  if (newObject.init){
	    newObject.init();
	  }
	  
	  IBERO.CREATED_OBJECTS[newObject.getId()] = newObject;
	  return newObject;
};

IBERO.Create.View = function(className,params){
	var newObject = new IBERO.classList.view[className](params);

	  if (newObject.init){
	    newObject.init();
	  }
	  
	  IBERO.CREATED_OBJECTS[newObject.getId()] = newObject;
	  return newObject;
};

IBERO.Create.Model = function(className,params){
	var newObject = new IBERO.classList.model[className](params);

	  if (newObject.init){
	    newObject.init();
	  }
	  
	  IBERO.CREATED_OBJECTS[newObject.getId()] = newObject;
	  return newObject;
};



IBERO.createPublic = function(priv,className,classObject,params,classType){
	  var heritage;
	  
    if (classObject.Extends !== undefined){
      heritage = new IBERO.classList[classType][classObject.Extends](params,priv);
      IBERO.InjectIdentifiers(priv,className);
      priv.publ = classObject.publ(priv,params);
      Object.setPrototypeOf(priv.publ, heritage);
    }
    else{
      IBERO.InjectIdentifiers(priv,className);
  	  priv.publ = classObject.publ(priv,params);
    }
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



IBERO.validateClass = function (className,classObject,classType){
   if (typeof IBERO.classList[classType][className] !== 'undefined'){
  		console.error('you are trying to describe twice the same class');
  		return false;
	  }
	  
    return IBERO.hasAllRequiredMethods(className,classObject,classType);
};

IBERO.hasAllRequiredMethods = function(className,classObject,classType){
  var proxyPubl,
      inheritedMethods,
      method; 
  
  if (classObject.Extends !== undefined){
    proxyPubl = classObject.publ({},{});
    inheritedMethods = IBERO.classList[classType][classObject.Extends].DOC.publ({},{});
    for (method in inheritedMethods){
       if (inheritedMethods.hasOwnProperty(method) && typeof inheritedMethods[method] === 'function'){
  	        proxyPubl[method] = inheritedMethods[method];
       }
    }
  }
  
  
  if (classObject.Implements !== undefined){
      classObject.Implements.forEach(function(extendedClass){
  	    var method,
  	        extendedObject = IBERO.classList.interface[extendedClass]();
  	    
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




