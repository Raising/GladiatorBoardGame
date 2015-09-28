

     
        var bbMap = new BB.Grill(15,15);
        bbMap.createTileMatrix();

        var act1 = new BB.ActorsHandler(14,bbMap);

        new TimelineMax()
        .staggerFrom($(".tileDiv"), 1, { rotationY:-90,autoAlpha:0,  transformOrigin:"50% 50% ", ease:Sine.easeOut},0.02)
        .staggerFrom($(".charDiv"), 2, { scale:0,  transformOrigin:"50% 50% ", ease:Elastic.easeOut},0.030)
   
     
        //.to($("#grillHorizontal"), 1.6, { rotationZ:-40,  transformOrigin:"50% 50%", ease:Sine.easeOut})
        //.to($("#grillVertical"), 1.6, { rotationX:50,  transformOrigin:"50% 70% ", ease:Bounce.easeOut})
        ;


        
        