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


OpalDynamicElement.prototype.dataOrDefault = function(data, defaultValue) {
    return $(this.element).data(data) != null ? $(this.element).data(data) : defaultValue;
};


OpalDynamicElement.prototype.init = function() {
    this.hiddenClass  = this.dataOrDefault("dynamic-hidden", "opal-dynamic-hidden");
    this.visibleClass = this.dataOrDefault("dynamic-visible", "opal-dynamic-visible");
    this.showDelay    = this.dataOrDefault("dynamic-show-delay", 0);
    this.hideDelay    = this.dataOrDefault("dynamic-hide-delay", 0);
    this.loop         = this.dataOrDefault("dynamic-loop", false);
    this.timeOut      = null;

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
    
    // console.log( visible, this.isVisible, this.firstDisplayed );

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
        console.log( "cacher" );
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