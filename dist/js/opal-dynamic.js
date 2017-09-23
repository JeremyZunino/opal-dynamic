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

    this.isVisible      = true;
    this.firstDisplayed = false;

    this.update();
};


OpalDynamicElement.prototype.update = function() {
    var self = this;
    var visible = this.isOnScreen();

    if( !visible && this.isVisible ) {
        var hideAction = false;
        if( !this.loop ) {
            if( !this.firstDisplayed ) {
                hideAction = true;
            }
        }
        else {
            hideAction = true;
        }

        if( hideAction ) {
            console.log( "hide" );
            this.isVisible = false;
            this.timeOut = setTimeout(function() {
                self.hide();
            }, self.hideDelay);
        }
    }
    else if( visible && !this.isVisible ) {
        console.log( "show" );
        this.isVisible = true;
        this.timeOut = setTimeout(function() {
            self.show();
        }, self.showDelay);
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