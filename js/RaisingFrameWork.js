RFW = {Author : 'Ignacio Medina Castillo'};
RFW.ClassList = {};
RFW.Describe = function(className,classObject){
	if (typeof RFW.ClassList[className] !== 'undefined'){
		console.error('you are trying to describe two time the same class');
		return false;
	}
	RFW.ClassList[className] = function(params){
		params = params ? params : {};
  		this.publicInterface  = classObject.publicInterface(this,params); 
		classObject.privateInit(this,params);
		return this.publicInterface;
	};
};

RFW.create = function(className,params){

	var id = GBG.getNewId();
	var newObject = new RFW.ClassList[className](params);
	newObject.objectType = className;
	newObject.objectId = id + '_' + className ;
	  
	  if (newObject.init){
	    newObject.init();
	  }
	  //GBG.CREATED_OBJECTS[newObject.objectId] = newObject;
	  return newObject;
};