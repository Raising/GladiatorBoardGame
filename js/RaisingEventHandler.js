REH = {
  author:'Ignacio Medina Castillo',
  contact:'ignacio.medina.castillo@gmail.com',
  description: 'this piece of code implement a event handler functionality in the' +
               'object prototype to enable objects to suscribe to other object events'
};


//AuxiliarFunctions

Object.ID_COUNTER = 0;

Object.defineProperty(Object.prototype, 'getId',{
  value :function(){
    if (this.id === undefined){
      Object.ID_COUNTER++;
      var str = "" + Object.ID_COUNTER;
      var pad = "000000";
      this.id = pad.substring(0, pad.length - str.length) + str;
    }
    return this.id;
  }
});


Object.defineProperty(Object.prototype, 'initEventHandler',{
  value :function(scope,eventName){
    if (scope.eventListeners === undefined){
      scope.eventListeners = {};
      scope.eventListeners[eventName] = {};
    }
    else if ( scope.eventListeners[eventName] === undefined ){
      scope.eventListeners[eventName] = {};
    }
  }
});

Object.defineProperty(Object.prototype, 'fire',{
  value :function(scope,eventName,params){
     scope.initEventHandler(scope,eventName);
  
    for (var trigger in scope.eventListeners[eventName]) {
      scope[trigger](params);
    }
  }
});

Object.defineProperty(Object.prototype, 'setTrigger',{
  value :function(scope,eventName,functionName){
      scope.initEventHandler(scope,eventName);
    if (scope.eventListeners[eventName][functionName] !== undefined){
      console.warn('the trigger in the object "'+ scope.getId() +'" for the event "'+eventName+'" to trigger the function "'+ functionName+'" is already setted, consider remove the redundance');
    }
    scope.eventListeners[eventName][functionName] = {functionName:functionName};
  }
});

Object.defineProperty(Object.prototype, 'removeTrigger',{
  value :function(scope,eventName,functionName){
    scope.initEventHandler(scope,eventName);
  
    scope.eventListeners[eventName][functionName] = undefined;
  }
});



////////////////////////////////


Object.defineProperty(Object.prototype, 'readyEventHandler',{
  value :function(eventName, functionName){
    if (this.eventListeners === undefined){
      this.eventListeners = {};
    }
    if ( this.eventListeners[eventName] === undefined ){
      this.eventListeners[eventName] = {};
    }
    if (functionName && this.eventListeners[eventName][functionName] === undefined ){
      this.eventListeners[eventName][functionName] = {};
    }
  }
});

Object.defineProperty(Object.prototype, 'listenEvent',{
  value :function(listenedObject,eventName,functionName,scope){
    var listenerSpot;
    scope = scope ? scope : this;
    
    listenedObject.readyEventHandler(eventName,functionName);
    
    listenerSpot = listenedObject.eventListeners[eventName][functionName];
    if (listenerSpot[scope.getId()] !== undefined){
       console.warn('the trigger in the object "'+ listenedObject.getId() +
       '" for the event "'+eventName+
       '" to trigger the function "'+ functionName+
       '" of the object "'+ scope.getId() +
       '" is already setted, consider remove the redundance');
    }
    listenerSpot[scope.getId()] = scope;
  }
});

Object.defineProperty(Object.prototype, 'unListenEvent',{
  value :function(listenedObject,eventName,functionName,scope){
    var listenerSpot;
    scope = scope ? scope : this;
    
    listenedObject.readyEventHandler(eventName,functionName);
    
    listenerSpot = listenedObject.eventListeners[eventName][functionName];
    if (listenerSpot[scope.getId()] === undefined){
       console.warn('the trigger in the object "'+ listenedObject.getId() +
       '" for the event "'+eventName+
       '" to trigger the function "'+ functionName+
       '" of the object "'+ scope.getId() +
       '" wasen`t setted you may be missing something');
    }
    listenerSpot[scope.getId()] = undefined;
  }
});

Object.defineProperty(Object.prototype, 'fireEvent',{
  value :function(eventName,params){
    var listOfObjectsListening,
        listOfFunctionsListening,
        objectId,
        functionName;
        
    this.readyEventHandler(eventName);
  
    listOfFunctionsListening = this.eventListeners[eventName];
    
    for (functionName in listOfFunctionsListening){
      listOfObjectsListening = listOfFunctionsListening[functionName];
      
      for (objectId in listOfObjectsListening) {
        listOfObjectsListening[objectId][functionName](params);
      }
    }
  }
});