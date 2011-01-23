var Photos, Pages;

$(document).ready(function() {
  
  Photos = {
    
    urls: [],
    element: $("#photos"),
    preload_element: $("#preload"),
    frame: 0,
    img: null,
    animating: false,
    
    setup: function(data) {
      this.urls = data;
      this.element.css("text-align","center")
      this.img = $("<img />").css("opacity",0).css("margin","auto").css("display","block");
      this.element.append(this.img);
      this.preload_element.css("display", "none");
      
      $(".pager").bind('mousewheel', function(event, delta) {
        Photos.scroll(delta);
      });
      
      $("#left").bind('click', function(event) {
          Photos.prev();
          parent.location.hash = '!/home';
      });
      
      $("#left").bind('mousemove', function(event) {
          Photos.leftIndicator();
      });
      
      $("#right").bind('mousemove', function(event) {
          Photos.rightIndicator();
      });
      
      $("#right").bind('click', function(event) {
          Photos.next();
          parent.location.hash = '!/home';
      });
      
      $("nav").bind('mouseenter', function(event) { 
        $(this).stop().animate({opacity: 0.9});
      });
      
      $("nav").bind('mouseleave', function(event) { 
        $(this).stop().animate({opacity: 0.5});
      });
      
      $(document).bind('keyup',function(event) {
        console.log(event.keyCode);
        switch(event.which) {
          case 8: // backspace
          case 33: // page up
          case 37: // left
          case 38: // up
            Photos.prev();
            parent.location.hash = '!/home';
            event.stopPropagation();
            break;
          case 32: // space
          case 34: // page down
          case 39: // right
          case 40: // down
            Photos.next();
            parent.location.hash = '!/home';
            event.stopPropagation();
            break;
        }
      });
      
      this.element.disableTextSelect();
      this.animate();
    },
    
    next: function() {
      if(this.frame < this.urls.length-1) {
        this.preload(1);
        this.frame = this.frame + 1;
        this.animate();
      }
      else
      {
        this.first();
      }
    },
    
    prev: function() {
      if(this.frame > 0) {
        this.preload(-1);
        this.frame = this.frame - 1;
        this.animate();
      }
      else {
        this.last();
      }
    },
    last: function() {
      this.frame = this.urls.length-1;
      this.animate();
    },
    first: function() {
      this.frame = 0;
      this.animate();
    },
    preload: function(offset) {
      i = $("<img />").attr("src", this.urls[this.frame+offset]);
      this.preload_element.append(i);
    },
    scroll: function(delta) {
      if(!this.animating) {
        if(delta < 0) {
          Photos.next();
        }
        if(delta > 0) {
          Photos.prev();
        }
      }
    },
    leftIndicator: function() {
      
    },
    rightIndicator: function() {
      
    },
    resize: function() {
			var imagewidth = this.img.naturalWidth;
			var imageheight = this.img.naturalHeight;
			var browserwidth = $(window).width();
			var browserheight = $(window).height();
			console.log("resize");
			this.img.aeImageResize({ height: $(window).height(), width: $(window).width() });
    },
    animate: function() {
      this.animating = true;
      this.img.stop(true).animate({opacity: 0}, 250, function() { $(this).attr("src", Photos.urls[Photos.frame]).aeImageResize({ height: $(window).height(), width: $(window).width() }).load(function() { console.log("end animate"); $(this).animate({opacity: 1},250, function() { Photos.animating = false; }) })});
    }
  };
  
  $(window).resize(function() {
    Photos.resize();
  });
  
  Pages = Backbone.Controller.extend({

    routes: {
      "!/home": "home",
      "!/about": "about",
      "!/pricing": "pricing",
      "!/where": "where", 
      "!/contact": "contact"
    },

    hide: function(callback) {
      $(".page").animate({opacity: 0},250, callback);
    },
    swap: function(page_id) {
      var p = page_id;
      this.hide( function() { 
        console.log("none");
        $(this).css({display: "none"});
        $(p).css({display: "block"}).animate({opacity: 1}, 250);
      });
    },
    home: function() {
      $(".page").animate({opacity: 0},250);
    },
    about: function() {
      this.swap("#about");
    },
    pricing: function() {
      this.swap("#pricing");
    },
    contact: function() {
      this.swap("#contact");
    },
    where: function() {
      this.swap("#where");
    },
  });
  
  $.getJSON("/photos",
    function(data) {
      Photos.setup(data);
    });
  
  new Pages();
  Backbone.history.start();
});