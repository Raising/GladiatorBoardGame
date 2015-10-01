

if (typeof Object.create !== 'function'){
  Object.create = function (o){
    var F = function () {};
    F.prototype = o;
    return new F();
  };
}


Function.method('new', function(){
  var that = Object.create(this.prototype);
  var other = this.apply(that,arguments);
  
  return (typeof other === 'object' && other) || that;
});