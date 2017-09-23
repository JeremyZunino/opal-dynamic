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
    this.loop         = this.dataOrDefault("dynamic-loop", false);

    this.firstDisplayed = false;

    this.update();
};


OpalDynamicElement.prototype.update = function() {
    var visible = this.isOnScreen();

    if( !visible ) {
        if( !this.loop ) {
            if( !this.firstDisplayed ) {
                this.hide();
            }
        }
        else this.hide();
    }
    else {
        console.log( this.element );
        this.show();
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
    this.removeClassAll( this.hiddenClass );
    this.addClassOnce( this.visibleClass );
    this.firstDisplayed = true;
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