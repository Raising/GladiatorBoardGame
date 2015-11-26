

GBG.EquipmentArcs = {
  shields:{buclet:{
            orientation:-45,
            deepLevel:1,
            type:['block'],
            widthLevels:[{from:40,to:60, color: '#3a3', cost:0},
                          {from:35,to:40, color: '#8a3', cost:1},
                          {from:30,to:35, color: '#777', cost:2},
                          {from:60,to:70, color: '#8a3', cost:1},
                          {from:70,to:75, color: '#777', cost:3}]
          }
        },
  weapons:{
          shortSword:{
            orientation:45,
            deepLevel:2,
            type:['slash','parry'],
            widthLevels:[{from:30,to:60, color: '#a33', cost:0},
                          {from:25,to:30, color: '#a83', cost:1},
                          {from:20,to:25, color: '#777', cost:2},
                          {from:60,to:77, color: '#a83', cost:1},
                          {from:77,to:85, color: '#777', cost:3}]
          }
        },
};


GBG.Movements = {
  front:{
     body05:  { coordinates : {y:-50,x:0},rotation:0},
     body1:   { coordinates : {y:-100,x:0},rotation:0},
     body15:  { coordinates : {y:-150,x:0},rotation:0},
     body2:   { coordinates : {y:-200,x:0},rotation:0},
     run3:    { coordinates : {y:-300,x:0},rotation:0},
     run4:    { coordinates : {y:-400,x:0},rotation:0},
     run5:    { coordinates : {y:-500,x:0},rotation:0},
     run6:    { coordinates : {y:-600,x:0},rotation:0}
  },
  left:{},
  right:{},
  back:{},
  turn:{}
};


/*
XWing template distances:

straight : 
  width 200mm
  length => 1: 40mm, 2: 80mm, 3: 120mm, 4: 160mm, 5: 200mm

90 Turn , defined by arc radius. 90 degrees
  Inner => 1: 25mm, 1: 53mm, 1: 80mm 
  outer => 1: 45mm, 1: 73mm, 1: 100mm


banc Turn , defined by arc radius. 45 degrees
  Inner => 1: 70mm, 1: 120mm, 1: 170mm 
  outer => 1: 90mm, 1: 140mm, 1: 190mm


*/
GBG.XwingMovements = {
  front:{
     green1:  { coordinates : {y:-200,x:0},rotation:0},
     green2:  { coordinates : {y:-300,x:0},rotation:0},
     green3:  { coordinates : {y:-400,x:0},rotation:0},
     green4:  { coordinates : {y:-500,x:0},rotation:0},
     green5:  { coordinates : {y:-600,x:0},rotation:0},
      },
  left:{ 
     green1:  { coordinates : {y:-137.5,x:-137.5},rotation:-90},
     green2:  { coordinates : {y:-207.5,x:-207.5},rotation:-90},
     green3:  { coordinates : {y:-275,x:-275},rotation:-90},
  },
  right:{
     green1:  { coordinates : {y:-137.5,x:137.5},rotation:90},
     green2:  { coordinates : {y:-207.5,x:207.5},rotation:90},
     green3:  { coordinates : {y:-275,x:275},rotation:90},
  },
   bancoLeft:{
     green1:  { coordinates : {y:-225.5  ,x:-45    },rotation:-45},
     green2:  { coordinates : {y:-313    ,x:-82.5  },rotation:-45},
     green3:  { coordinates : {y:-400.5  ,x:-120   },rotation:-45},
  },
   bancoRight:{
     green1:  { coordinates : {y:-225.5  ,x:45     },rotation:45},
     green2:  { coordinates : {y:-313    ,x:82.5   },rotation:45},
     green3:  { coordinates : {y:-400.5  ,x:120    },rotation:45},
  },
  back:{},
  turn:{}
};