if (Function.prototype.$inherits || Function.prototype.$extend) {
    if (typeof(console) !== 'undefined' && typeof(console.warn) === 'function') {
        console.warn('The functions $inherits and $extend are already defined in Function.prototype. The library is going to overwrite them.');
    }
}
//These functions augment Function.prototype to provide a framework for implementing inheritance.

//Utility function for implementing inheritance along with an "uber" function
//This is modified version of the original authored by Douglas Crockford
//http://www.crockford.com/javascript/inheritance.html
Function.prototype.$inherits = function (parent) {
    this.prototype = new parent();
    var d = {},
        p = this.prototype;
    this.prototype.constructor = parent;
    this.prototype.uber = function uber(name) {
        if (!(name in d)) {
            d[name] = 0;
        }
        var f, r, t = d[name], v = parent.prototype;
        if (t) {
            while (t) {
                v = v.constructor.prototype;
                t -= 1;
            }
            f = v[name];
        } else {
            f = p[name];
            if (f == this[name]) {
                f = v[name];
            }
        }
        d[name] += 1;
        r = f.apply(this, Array.prototype.slice.apply(arguments, [1]));
        d[name] -= 1;
        return r;
    };
    return this;
};

//Builds on Crockford's inheritance method to provide a simple "extends" functionality to all our constructors.
//Author: Mehdi Maujood
Function.prototype.$extend = function (properties) {
    var Constructor = function () {
        //Convention borrowed from Alex Arnell's inheritance plugin (used in Prototype.js)
        //code.google.com/p/inheritance/
        this.initialize.apply(this, arguments);
    };
    Constructor.$inherits(this);
    for (var prop in properties) {
        Constructor.prototype[prop] = properties[prop];
    }
    return Constructor;
};