RFW = {Author : 'Ignacio Medina Castillo'};
RFW.ClassList = {};

RFW.ID_COUNTER = 0;
RFW.CREATED_OBJECTS = {};
RFW.DOM_TO_OBJECT_MAP = {};

RFW.getNewId = function(){
  RFW.ID_COUNTER += 1;
  var str = "" + RFW.ID_COUNTER;
  var pad = "0000000";
  str = pad.substring(0, pad.length - str.length) + str;
  return str;
};


RFW.Describe = function(className,classObject){
	if (typeof RFW.ClassList[className] !== 'undefined'){
		console.error('you are trying to describe two time the same class');
		return false;
	}
	RFW.ClassList[className] = function(params){
		params = params ? params : {};
		var me = this;
		// variable privadas generales
		this.objectId = RFW.getNewId() + '_' + className ;
		this.objectType = className;
  		//

  		this.publicInterface  = classObject.publicInterface(this,params); 
  		//metodos generales
		this.publicInterface.getId = function(){
			return me.objectId;
		};
		this.publicInterface.getObjectType = function(){
			return me.objectType;
		};
  		//
		classObject.privateInit(this,params);

		return this.publicInterface;
	};
};

RFW.create = function(className,params){

	var id = RFW.getNewId();
	var newObject = new RFW.ClassList[className](params);
	newObject.objectType = className;
	newObject.objectId = id + '_' + className ;
	  
	  if (newObject.init){
	    newObject.init();
	  }
	  //RFW.CREATED_OBJECTS[newObject.objectId] = newObject;
	  return newObject;
};