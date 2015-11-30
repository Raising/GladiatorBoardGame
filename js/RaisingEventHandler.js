REH = {
  author:'Ignacio Medina Castillo',
  contact:'ignacio.medina.castillo@gmail.com',
  description: 'this piece of code implement a event handler functionality in the' +
               'object prototype to enable objects to suscribe to other object events'
};


//AuxiliarFunctions

Object.ΦID_COUNTER = 0;

Object.defineProperty(Object.prototype, 'ΦId',{
  value :function(){
    if (this.numericId === undefined){
      Object.ΦID_COUNTER ++;
      var str = "" + Object.ΦID_COUNTER;
      var pad = "0000000000";
      this.numericId = pad.substring(0, pad.length - str.length) + str;
    }
    return this.numericId;
  }
});

Object.defineProperty(Object.prototype, 'ΦreadyEventHandler',{
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
    return this.eventListeners;
  }
});

Object.defineProperty(Object.prototype, 'ΦlistenEvent',{
  value :function(listenedObject,eventName,functionName,scope){
    var listenerSpot;
    scope = scope ? scope : this;
    
    listenerSpot = listenedObject.ΦreadyEventHandler(eventName,functionName)[eventName][functionName];
    
    if (listenerSpot[scope.ΦId()] !== undefined){
       console.warn('the trigger in the object "'+ listenedObject.ΦId() +
       '" for the event "'+eventName+
       '" to trigger the function "'+ functionName+
       '" of the object "'+ scope.ΦId() +
       '" is already setted, consider remove the redundance');
    }
    
    listenerSpot[scope.ΦId()] = scope;
  }
});

Object.defineProperty(Object.prototype, 'ΦunListenEvent',{
  value :function(listenedObject,eventName,functionName,scope){
    var listenerSpot;
    scope = scope ? scope : this;
    
    listenerSpot = listenedObject.ΦreadyEventHandler(eventName,functionName)[eventName][functionName];
    if (listenerSpot[scope.ΦId()] === undefined){
       console.warn('the trigger in the object "'+ listenedObject.ΦId() +
       '" for the event "'+eventName+
       '" to trigger the function "'+ functionName+
       '" of the object "'+ scope.ΦId() +
       '" wasen`t setted you may be missing something');
    }
    
    delete listenerSpot[scope.ΦId()];
  }
});

Object.defineProperty(Object.prototype, 'ΦfireEvent',{
  value :function(eventName,params){
    var listOfObjectsListening,
        listOfFunctionsListening,
        objectId,
        functionName;
  
    listOfFunctionsListening = this.ΦreadyEventHandler(eventName)[eventName];
    
    for (functionName in listOfFunctionsListening){
      listOfObjectsListening = listOfFunctionsListening[functionName];
      
      for (objectId in listOfObjectsListening) {
        listOfObjectsListening[objectId][functionName](params);
      }
    }
  }
});


//////HTML enchantment

Object.defineProperty(HTMLElement.prototype, 'getAbsolutePosition',{
 value: function getPosition() {
    var xPosition = 0,
        yPosition = 0,
        element = this;
  
    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
  }
});
