var OpalDynamic = function() {
    var self = this;
    this.elements = [];

    $("[data-dynamic]").each(function(i, el) {
        self.elements.push( self.setupElement(el) );
    });

    $(window, "body").scroll(function () {
        self.scroll();
    });
    $(window, "body").resize(function () {
        self.scroll();
    });
    
};

OpalDynamic.prototype.setupElement = function(el) {
    var odElement = new OpalDynamicElement(el);
    return odElement;
};


OpalDynamic.prototype.scroll = function() {
    for(var i=0; i<this.elements.length; i++) {
        this.elements[i].update();
    }
};






var OpalDynamicElement = function(element) {
    this.element = element;

    this.init();
};


OpalDynamicElement.prototype.hasData = function(data) {
    return $(this.element).data("dynamic-"+data) != null;
};


OpalDynamicElement.prototype.dataOrDefault = function(data, defaultValue) {
    return this.hasData(data) ? $(this.element).data("dynamic-"+data) : defaultValue;
};


OpalDynamicElement.prototype.init = function() {
    var self = this;

    this.hiddenClass  = this.dataOrDefault("hidden", "opal-dynamic-hidden");
    this.visibleClass = this.dataOrDefault("visible", "opal-dynamic-visible");
    this.showDelay    = this.dataOrDefault("show-delay", 0);
    this.hideDelay    = this.dataOrDefault("hide-delay", 0);
    this.loop         = this.dataOrDefault("loop", false);
    this.timeOut      = null;
    this.margin       = {
        top    : self.dataOrDefault("margin-top",    0),
        // right  : self.dataOrDefault("margin-right",  0),
        // bottom : self.dataOrDefault("margin-bottom", 0),
        // left   : self.dataOrDefault("margin-left",   0)
    };

    if(this.hasData("from-left"))   { this.hiddenClass = "opal-dynamic-from-left";                             }
    if(this.hasData("from-right"))  { this.hiddenClass = "opal-dynamic-from-right";                            }
    if(this.hasData("from-top"))    { this.hiddenClass = "opal-dynamic-from-top";    this.margin.top = "50%";  }
    if(this.hasData("from-bottom")) { this.hiddenClass = "opal-dynamic-from-bottom"; this.margin.top = "-50%"; }

    this.isVisible      = false;
    this.firstDisplayed = false;

    if( this.isOnScreen() ) {
        this.show()
    }
    else {
        this.hide();
    }
};


OpalDynamicElement.prototype.update = function() {
    var self = this;

    // Watch if element is on screen
    var visible = this.isOnScreen();

    // If element is on screen and not already visible
    if( visible && !this.isVisible ) {
        // Set visibility for true
        this.isVisible = true;
        // Reset element timer and prepare timer to show
        this.timeOut = setTimeout(function() {
            // Run show action
            self.show();
        }, self.showDelay);
    }

    // If element effect can be loop, and element not in screen and element is already displayed
    else if( this.loop && !visible && this.isVisible ) {
        // Set visibility for false
        this.isVisible = false;
        // Reste element timer and prepare timer to hide
        this.timeOut = setTimeout(function() {
            // Run hide action
            self.hide();
        }, self.hideDelay);
    }
};


OpalDynamicElement.prototype.isOnScreen = function() {
    var middlePosition = $(this.element).offset().top + $(this.element).height() / 2;

    if( this.margin.top != null || this.margin.top != "" || Number(this.margin.top) != 0 ) {
        if( String(this.margin.top).indexOf("%") > -1 ) {
            middlePosition += $(this.element).height() * Number(this.margin.top.replace("%","")) / 100;
        }
        else {
            middlePosition += this.margin.top;
        }
    }
    
    var topScreen = $(window).scrollTop();
    var bottomScreen = $(window).scrollTop() + $(window).height();

    return middlePosition > topScreen && middlePosition < bottomScreen;
};


OpalDynamicElement.prototype.addClassOnce = function(className) {
    if( !$(this.element).hasClass(className) ) {
        $(this.element).addClass(className);
    }
};


OpalDynamicElement.prototype.removeClassAll = function(className) {
    while( $(this.element).hasClass(className) ) {
        $(this.element).removeClass(className);
    }
};


OpalDynamicElement.prototype.show = function() {
    var self = this;

    // self.timeOut = setTimeout(function() {
    //     console.log( self );
        self.removeClassAll( this.hiddenClass );
        self.addClassOnce( this.visibleClass );
        self.firstDisplayed = true;
    // }, self.showDelay);
};


OpalDynamicElement.prototype.hide = function() {
    this.removeClassAll( this.visibleClass );
    this.addClassOnce( this.hiddenClass );
};


OpalDynamicElement.prototype.display = function(state) {
    if( state == null ) return $(this.element).hasClass("display");
    else {
        if(state && !$(this.element).hasClass("display") ) $(this.element).addClass("display");
        else                                               $(this.element).removeClass("display");
    }
};