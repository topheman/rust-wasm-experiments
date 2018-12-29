/** Ball source code from https://github.com/topheman/Ball.js */

/*!
 *
 * Copyright 2012, Christophe Rosset (Topheman)
 * http://blog.topheman.com/
 * http://twitter.com/topheman
 *
 * You are free to use, modify and distribute this software under the conditions of the MIT license
 * https://github.com/topheman/Ball.js/blob/master/LICENSE
 *
 * Ball.js
 * Manages Ball physics and display on a flat area (collisions, gravity, bounces ...)
 *
 * More explanations on http://labs.topheman.com/Ball/
 *
 * @version 1.0
 * @dependency Vector2D.js
 */

/**
 * Ball public constructor
 *
 * @param {Int} x
 * @param {Int} y
 * @param {Int} radius
 * @param {Number} mass
 * @param {Number} gravity
 * @param {Number} elasticity
 * @param {Number} friction
 * @param {String} color (hexa code)
 * @param {Number} lifeTime
 * @param options {Object} @optional
 *      .aging {Boolean} (true will activate aging mode - growing and shrinking balls at their construct and destruct)
 *      .borningRate {Int} number of frames to grow to radius (if aging = true, at the construct of the ball)
 *      .dyingRate {Int} number of frames to shrink from radius (when the  ball is dying or .toDeath() is triggered)
 *      .bouncingAlpha {Boolean} (true will activate alpha mode when the ball bounces against something)
 *      .bouncingColor {String}|{Boolean} (string color hexa code will activate the bounce color mode : the ball chnages color when bouncing against something)
 *      .bouncingRate {Int} number of frames the bounce effects will last
 *      .glowingColor {String}|{Boolean} (string color hexa code will allow to use glow() ant stopGlow() functions)
 *      .glowingRate {Int} (fps) number of frames the glowing effects will last
 *      .blinkingColor {String}|{Boolean} (string color hexa code will allow to use blink() ant stopBlink() functions)
 *      .blinkingRate {Int} (fps) number of frames the blinking effects will last
 *      .explodingAlpha {Boolean} (true will fade the ball when .explode() is triggered)
 *      .explodingColor {String} (string color hexa code)
 *      .explodingRadius {Int}
 *      .explodingRate {Int}
 *
 */
function Ball(
  x,
  y,
  radius,
  mass,
  gravity,
  elasticity,
  friction,
  color,
  lifeTime,
  options
) {
  this.init(
    x,
    y,
    radius,
    mass,
    gravity,
    elasticity,
    friction,
    color,
    lifeTime,
    options
  );
}

Ball.prototype.init = function(
  x,
  y,
  radius,
  mass,
  gravity,
  elasticity,
  friction,
  color,
  lifeTime,
  options
) {
  //const (needed here because of closure vs prototype)
  this.MIN_BOUNCING_ALPHA = 0.2;

  //default comportement
  this.x = x;
  this.y = y;
  this.velocityX = 0;
  this.velocityY = 0;
  this.radius = radius; //realtime radius
  this._radius = radius; //@private radius base for .age() .toDeath() methods
  this.mass = mass || 1;
  this.gravity = gravity || 1;
  this.elasticity = elasticity || 0.98;
  this.friction = friction || 0.8;
  this.color = color.toLowerCase() || "#0000ff"; //blue
  this._color = color.toLowerCase() || "#0000ff"; //@private
  this.alpha = options
    ? options.alpha
      ? this.validateAlpha(options.alpha) == true
        ? options.alpha
        : 1
      : 1
    : 1;
  this._alpha = this.alpha; //@private
  this._iterator = 0; //internal iterator
  this.lifeTime = lifeTime || Infinity;
  this.dead = false;
  this.temporaryOutOfBounds = false;

  //aging comportement
  this.aging = options ? (options.aging ? options.aging : false) : false;
  this.borningRate = options
    ? options.borningRate
      ? options.borningRate
      : 80
    : 80;
  this.dyingRate = options ? (options.dyingRate ? options.dyingRate : 60) : 60;
  this.dying = false;

  //bounce comportement - can't be changed by getters after the construct
  this.bouncingColor = (options
    ? options.bouncingColor
      ? options.bouncingColor
      : this.color
    : this.color
  ).toLowerCase();
  this.bouncingAlpha = options
    ? options.bouncingAlpha
      ? options.bouncingAlpha
      : false
    : false;
  this.bouncingRate = options
    ? options.bouncingRate
      ? options.bouncingRate
      : 60
    : 60;
  this.bouncingInfos = null;
  this.minBouncingAlpha = this.alpha > 0.2 ? 0.2 : 0;

  //glow comportement
  this.glowingColor = (options
    ? options.glowingColor
      ? options.glowingColor
      : this.color
    : this.color
  ).toLowerCase();
  this.glowingRate = options
    ? options.glowingRate
      ? options.glowingRate
      : 40
    : 40;
  this.glowingColorInfos = null;

  //blink comportement
  this.blinkingColor = (options
    ? options.blinkingColor
      ? options.blinkingColor
      : this.color
    : this.color
  ).toLowerCase();
  this.blinkingRate = options
    ? options.blinkingRate
      ? options.blinkingRate
      : 40
    : 40;
  this.blinking = false;

  //explode comportement - can be changed by setter only if not exploding
  this.explodingAlpha = options
    ? options.explodingAlpha
      ? options.explodingAlpha
      : false
    : false;
  this.explodingRadius = options
    ? options.explodingRadius
      ? options.explodingRadius
      : 2 * this.radius
    : 2 * this.radius;
  this.explodingColor = (options
    ? options.explodingColor
      ? options.explodingColor
      : this.color
    : this.color
  ).toLowerCase();
  this.explodingRate = options
    ? options.explodingRate
      ? options.explodingRate
      : 60
    : 60;
  this.explodingInfos = null;

  if (
    this.bouncingColor != this.color &&
    this.validateColorCode(this.bouncingColor) == false
  )
    console.warn(
      "[WARN]Hexa code expected for bouncingColor. You gave : " +
        this.bouncingColor
    );
  if (
    this.glowingColor != this.color &&
    this.validateColorCode(this.glowingColor) == false
  )
    console.warn(
      "[WARN]Hexa code expected for glowingColor. You gave : " +
        this.glowingColor
    );
  if (
    this.explodingColor != this.color &&
    this.validateColorCode(this.explodingColor) == false
  )
    console.warn(
      "[WARN]Hexa code expected for explodingColor. You gave : " +
        this.explodingColor
    );
  if (this.explodingRadius < this.radius)
    console.warn(
      "[WARN]explodingRadius < radius, expect error with .explode()"
    );

  //html renderer
  this.htmlClassAttribute = options
    ? options.htmlClassName
      ? ' class="' + options.htmlClassName + '"'
      : ""
    : "";

  //at the end of the construct, if aging is on, the ball borns
  if (this.aging == true) this.born();
};

/********** Public setters and getters (use these functions rather than direct access to properties)  ***********/

/**
 * @return {Int}
 */
Ball.prototype.getX = function() {
  return this.x;
};

/**
 * @param {Int} x
 * @return {Ball}
 */
Ball.prototype.setX = function(x) {
  this.x = x;
  return this;
};

/**
 * @return {Int}
 */
Ball.prototype.getY = function() {
  return this.y;
};

/**
 * @param {Int} y
 * @return {Ball}
 */
Ball.prototype.setY = function(y) {
  this.y = y;
  return this;
};

/**
 * @return {Number}
 */
Ball.prototype.getVelocityX = function() {
  return this.velocityX;
};

/**
 * @param {Number} velocityX
 * @return {Ball}
 */
Ball.prototype.setVelocityX = function(velocityX) {
  this.velocityX = velocityX;
  return this;
};

/**
 * @return {Number}
 */
Ball.prototype.getVelocityY = function() {
  return this.velocityY;
};

/**
 * @param {Number} velocityY
 * @return {Ball}
 */
Ball.prototype.setVelocityY = function(velocityY) {
  this.velocityY = velocityY;
  return this;
};

/**
 * @return {Int}
 */
Ball.prototype.getRadius = function() {
  return this.radius;
};

/**
 * @warn won't be effective if .explode() has already been triggered;
 * @param {Int} radius
 * @return {Ball}
 */
Ball.prototype.setRadius = function(radius) {
  //if allready exploding no effect
  if (this.isExploding()) return this;
  //this public method update both the public and private radius
  this.radius = radius;
  this._radius = radius;
  return this;
};

/**
 * @return {Number}
 */
Ball.prototype.getMass = function() {
  return this.mass;
};

/**
 * @param {Number} mass
 * @return {Ball}
 */
Ball.prototype.setMass = function(mass) {
  this.mass = mass;
  return this;
};

/**
 * @return {Number}
 */
Ball.prototype.getGravity = function() {
  return this.gravity;
};

/**
 * @param {Number} gravity
 * @return {Ball}
 */
Ball.prototype.setGravity = function(gravity) {
  this.gravity = gravity;
  return this;
};

/**
 * @return {Number}
 */
Ball.prototype.getElasticity = function() {
  return this.elasticity;
};

/**
 * @param {Number} elasticity
 * @return {Ball}
 */
Ball.prototype.setElasticity = function(elasticity) {
  this.elasticity = elasticity;
  return this;
};

/**
 * @return {Number}
 */
Ball.prototype.getFriction = function() {
  return this.friction;
};

/**
 * @param {Number} friction
 * @return {Ball}
 */
Ball.prototype.setFriction = function(friction) {
  this.friction = friction;
  return this;
};

/**
 * @return {String}
 */
Ball.prototype.getColor = function() {
  return this.color;
};

/**
 * @warn won't be effective if .explode() has already been triggered;
 * @param {String} color
 * @return {Ball}
 */
Ball.prototype.setColor = function(color) {
  //if allready exploding no effect
  if (this.isExploding()) return this;
  if (this.validateColorCode(color)) {
    this.color = color.toLowerCase();
    this._color = color.toLowerCase();
  }
  //if ball is glowing, restart glowing to have the correct base color
  if (this.isGlowing()) {
    this.startGlowing();
  }
  return this;
};

/**
 * @return {Number}
 */
Ball.prototype.getAlpha = function() {
  return this.alpha;
};

/**
 * @warn won't be effective if .explode() has already been triggered;
 * @param {Number} alpha
 * @return {Ball}
 */
Ball.prototype.setAlpha = function(alpha) {
  //if allready exploding no effect
  if (this.isExploding()) return this;
  if (this.validateAlpha(alpha)) {
    this.alpha = alpha;
    this._alpha = alpha;
  }
  return this;
};

/**
 * @return {Int}
 */
Ball.prototype.getLifeTime = function() {
  return this.lifeTime;
};

/**
 * @param {Number} lifeTime
 * @return {Ball}
 */
Ball.prototype.setLifeTime = function(lifeTime) {
  this.lifeTime = lifeTime;
  return this;
};

/**
 * @return {Boolean}
 */
Ball.prototype.isDead = function() {
  return this.dead;
};

/**
 * @return {Boolean}
 */
Ball.prototype.isDying = function() {
  return this.dying;
};

/**
 * @return {String}
 */
Ball.prototype.getBouncingColor = function() {
  return this.bouncingColor;
};

/**
 * @return {String}
 */
Ball.prototype.getGlowingColor = function() {
  return this.glowingColor;
};

/**
 * @param {String} glowingColor
 * @return {Ball}
 */
Ball.prototype.setGlowingColor = function(glowingColor) {
  if (this.validateColorCode(glowingColor))
    this.glowingColor = glowingColor.toLowerCase();
  //if ball is glowing, restart glowing to have the correct glowing color
  if (this.isGlowing()) {
    this.startGlowing();
  }
  return this;
};

/**
 * @return {Int}
 */
Ball.prototype.getGlowingRate = function() {
  return this.glowingRate;
};

/**
 * @param {Int} glowingRate
 * @return {Ball}
 */
Ball.prototype.setGlowingRate = function(glowingRate) {
  this.glowingRate = glowingRate;
  //if ball is glowing, restart glowing to have the correct glowing rate
  if (this.isGlowing()) {
    this.startGlowing();
  }
  return this;
};

/**
 * @return {String}
 */
Ball.prototype.getBlinkingColor = function() {
  return this.blinkingColor;
};

/**
 * @param {String} blinkingColor
 * @return {Ball}
 */
Ball.prototype.setBlinkingColor = function(blinkingColor) {
  this.blinkingColor = blinkingColor.toLowerCase();
  //if ball is blinking, restart blinking to have the correct blinking color
  if (this.isBlinking()) {
    this.startBlinking();
  }
  return this;
};

/**
 * @return {Int}
 */
Ball.prototype.getDyingRate = function() {
  return this.dyingRate;
};

/**
 * @warn won't be effective if ball already dying
 * @param {Int} dyingRate
 * @return {Ball}
 */
Ball.prototype.setDyingRate = function(dyingRate) {
  //doesn't change if already dying
  if (this.isDying() == false) {
    this.dyingRate = dyingRate;
  }
  return this;
};

/**
 * @return {Int}
 */
Ball.prototype.getBlinkingRate = function() {
  return this.blinkingRate;
};

/**
 * @param {Int} blinkingRate
 * @return {Ball}
 */
Ball.prototype.setBlinkingRate = function(blinkingRate) {
  this.blinkingRate = blinkingRate;
  //if ball is bling, restart glowing to have the correct blinking rate
  if (this.isBlinking()) {
    this.startBlinking();
  }
  return this;
};

/**
 * @return {Boolean}
 */
Ball.prototype.getExplodingAlpha = function() {
  return this.explodingAlpha;
};

/**
 * @warn won't be effective if .explode() has already been triggered;
 * @param {Boolean} explodingAlpha
 * @return {Ball}
 */
Ball.prototype.setExplodingAlpha = function(explodingAlpha) {
  if (this.isExploding() == false && this.validateAlpha(explodingAlpha))
    this.explodingAlpha = explodingAlpha;
  return this;
};

/**
 * @return {Int}
 */
Ball.prototype.getExplodingRadius = function() {
  return this.explodingRadius;
};

/**
 * @warn won't be effective if .explode() has already been triggered;
 * @param {Int} explodingRadius
 * @return {Ball}
 */
Ball.prototype.setExplodingRadius = function(explodingRadius) {
  if (this.isExploding() == false) this.explodingRadius = explodingRadius;
  return this;
};

/**
 * @return {Int}
 */
Ball.prototype.getExplodingRate = function() {
  return this.explodingRate;
};

/**
 * @warn won't be effective if .explode() has already been triggered;
 * @param {Int} explodingRate
 * @return {Ball}
 */
Ball.prototype.setExplodingRate = function(explodingRate) {
  if (this.isExploding() == false) this.explodingRate = explodingRate;
  return this;
};

/**
 * @return {String}
 */
Ball.prototype.getExplodingColor = function() {
  return this.explodingColor;
};

/**
 * @warn won't be effective if .explode() has already been triggered;
 * @param {String} explodingColor
 * @return {Ball}
 */
Ball.prototype.setExplodingColor = function(explodingColor) {
  if (this.isExploding() == false && this.validateColorCode(explodingColor))
    this.explodingRate = explodingColor;
  return this;
};

/**
 * Returns true if glowing
 * @return {Boolean}
 */
Ball.prototype.isGlowing = function() {
  return this.glowingColorInfos != null ? true : false;
};

/**
 * Returns true if is changing color on bounce
 * @return {Boolean}
 */
Ball.prototype.isBouncing = function() {
  return this.bouncingInfos != null
    ? this._iterator <= this.bouncingInfos.iteratorEnd
      ? true
      : false
    : false;
};

/**
 * Returns true if blinking
 * @return {Boolean}
 */
Ball.prototype.isBlinking = function() {
  return this.blinking;
};

/**
 * Returns true if exploding
 * @return {Boolean}
 */
Ball.prototype.isExploding = function() {
  return this.explodingInfos != null
    ? this._iterator <= this.explodingInfos.iteratorEnd
      ? true
      : false
    : false;
};

/********** End of public setters and getters **********/

/**
 * @private
 * Inits bouncingInfos (prepares the bouncing duration, used for the modulation of the color and the alpha on move)
 */
Ball.prototype.initBouncingInfos = function() {
  this.bouncingInfos = {
    iteratorStart: this._iterator,
    iteratorEnd: this._iterator + this.bouncingRate
  };
};

/**
 * Updates the alpha (used for globalAlpha in canvas rendering)
 * This function is automatically called on ball vs ball collisions, you can also call it from outside if you want.
 */
Ball.prototype.updateAlphaOnCollision = function() {
  if (this.bouncingAlpha == true) {
    this.initBouncingInfos();
    this.alpha = this.minBouncingAlpha;
  }
};

/**
 * Updates the alpha (used for globalAlpha in canvas rendering)
 * This function is automatically called on ball move, you can also call it from outside if you want.
 */
Ball.prototype.updateAlphaOnMove = function() {
  if (this.isExploding() && this.explodingAlpha == true) {
    this.alpha = this.alpha - this._alpha / this.bouncingRate;
    if (this.alpha < 0) this.alpha = 0;
  } else if (this.isBouncing()) {
    if (this.bouncingAlpha == true && this.alpha <= this._alpha) {
      this.alpha =
        this.alpha + (this._alpha - this.minBouncingAlpha) / this.bouncingRate;
    }
  }
  //fallback to return the original _alpha
  else if (this.alpha != this._alpha) {
    this.alpha = this._alpha;
  }
};

/**
 * Updates the color (used in canvas rendering)
 * This function is automatically called on ball vs ball collisions, you can also call it from outside if you want.
 */
Ball.prototype.updateColorOnCollision = function() {
  if (this.bouncingColor != this._color) {
    this.initBouncingInfos();
    this.color = this.bouncingColor;
  }
};

/**
 * Updates the color
 * This function is automatically called on ball move, you can also call it from outside if you want.
 */
Ball.prototype.updateColorOnMove = function() {
  if (this.isExploding() && this._color != this.explodingColor) {
    this.color = this.computeColor(
      this._iterator,
      this._color,
      this.explodingColor,
      this.explodingInfos.iteratorStart,
      this.explodingInfos.iteratorEnd
    );
  } else if (this.isBouncing() && this._color != this.bouncingColor) {
    this.color = this.computeColor(
      this._iterator,
      this.bouncingColor,
      this._color,
      this.bouncingInfos.iteratorStart,
      this.bouncingInfos.iteratorEnd
    );
  } else if (this.isGlowing()) {
    this.computeAndSetGlowingColor();
  } else if (this.isBlinking()) {
    this.computeAndSetBlinkingColor();
  }
};

Ball.prototype.updateRadiusOnMove = function() {
  if (this.isExploding() && this.explodingRadius > this._radius) {
    this.radius =
      this.radius +
      (this.radius < this.explodingRadius
        ? (this.explodingRadius - this._radius) / this.explodingRate
        : 0);
    //fallback if this.radius grows up to original radius
    if (this.radius > this.explodingRadius) this.radius = this.explodingRadius;
  } else {
    //if aging mode On and still growing up (and not grown up), continue to grow up
    if (
      this.aging == true &&
      this.dead == false &&
      this.dying == false &&
      this.radius < this._radius &&
      this.dying == false
    ) {
      this.radius =
        this.radius +
        (this.radius < this._radius ? this._radius / this.borningRate : 0);
      //fallback if this.radius grows up to original radius
      if (this.radius > this._radius) this.radius = this._radius;
    }
    //if dying shrink down
    if (
      this.dead == false &&
      this.dying == true &&
      this.lifeTime <= this.dyingRate
    ) {
      this.radius =
        this.radius - (this.radius > 0 ? this._radius / this.dyingRate : 0);
      //fallback if this.radius shrinks down to 0
      if (this.radius < 0) this.radius = 0;
    }
  }
};

/**
 * If glowingColor enabled in options, starts glowing the ball
 * If the ball is glowing will do nothing
 * @warn does nothing if already exploding
 *
 * @return {Ball}
 */
Ball.prototype.glow = function() {
  if (this.isGlowing()) return this;
  else return this.startGlowing();
};

/**
 * Stops glowing the ball
 *
 * @return {Ball}
 */
Ball.prototype.stopGlow = function() {
  if (this.isGlowing()) {
    return this.stopGlowing();
  } else return this;
};

/**
 * @private use glow() (don't bother with initating glowing)
 * If glowingColor enabled in options, will start glowing the ball
 * @warn does nothing if already exploding
 *
 * @return {Ball}
 */
Ball.prototype.startGlowing = function() {
  //does nothing if already exploding
  if (this.isExploding()) return this;
  //stop blinking before start glowing
  if (this.isBlinking()) this.stopBlinking();
  //if the original color and the glowingColor are the same -> no glowing
  if (this.glowingColor == this._color) return this;
  //reset the color to origninal color (in case we are glowing and the color is changing)
  this.color = this._color;
  this.computeAndSetGlowingColor();
  return this;
};

/**
 * @private use stopGlow()
 * Stops glowing the ball
 *
 * @return {Ball}
 */
Ball.prototype.stopGlowing = function() {
  //if the original color and the glowingColor are the same -> no glowing
  if (this.glowingColor == this._color) return this;
  this.glowingColorInfos = null;
  this.color = this._color; //reset default color
  return this;
};

/**
 * If blinkingColor enabled in options, starts blinking the ball
 * If the ball is blinking will do nothing
 * @warn does nothing if already exploding
 *
 * @return {Ball}
 */
Ball.prototype.blink = function() {
  if (this.isBlinking()) return this;
  else return this.startBlinking();
};

/**
 * Stops blinking the ball
 *
 * @return {Ball}
 */
Ball.prototype.stopBlink = function() {
  if (this.isBlinking()) {
    return this.stopBlinking();
  } else return this;
};

/**
 * @private use blink() (don't bother with initating blinking)
 * If blinkingColor enabled in options, will start blinking the ball
 * @warn does nothing if already exploding
 *
 * @return {Ball}
 */
Ball.prototype.startBlinking = function() {
  //does nothing if already exploding
  if (this.isExploding()) return this;
  //stop glowing before start blinking
  if (this.isGlowing()) this.stopGlowing();
  //if the original color and the glowingColor are the same -> no glowing
  if (this.blinkingColor == this._color) return this;
  //reset the color to origninal color (in case we are glowing and the color is changing)
  this.blinking = true;
  this.color = this._color;
  return this;
};

/**
 * @private use stopBlink()
 * Stops blinking the ball
 *
 * @return {Ball}
 */
Ball.prototype.stopBlinking = function() {
  //if the original color and the glowingColor are the same -> no glowing
  if (this.blinkingColor == this._color) return this;
  this.blinking = false;
  this.color = this._color; //reset default color
  return this;
};

Ball.prototype.explode = function() {
  //override dying
  this.dying = false;
  //default radius / color / alpha
  this.radius = this._radius;
  this.color = this._color;
  this.alpha = this._alpha;

  this.lifeTime = this.explodingRate;

  this.explodingInfos = {
    iteratorStart: this._iterator,
    iteratorEnd: this._iterator + this.explodingRate
  };
};

/**
 * @private
 *
 * Compute the color if glowing is enabled (switches iterators)
 */
Ball.prototype.computeAndSetGlowingColor = function() {
  //new iteration each time this._color or this.glowingColor is reached by this.color
  if (this.color == this._color) {
    this.glowingColorInfos = {
      iteratorStart: this._iterator,
      iteratorEnd: this._iterator + this.glowingRate,
      state: "up"
    };
  } else if (this.color == this.glowingColor) {
    this.glowingColorInfos = {
      iteratorStart: this._iterator,
      iteratorEnd: this._iterator + this.glowingRate,
      state: "down"
    };
  }

  var colorFrom, colorTo;
  if (this.glowingColorInfos.state == "up") {
    colorFrom = this._color;
    colorTo = this.glowingColor;
  } else {
    colorFrom = this.glowingColor;
    colorTo = this._color;
  }

  this.color = this.computeColor(
    this._iterator + 1,
    colorFrom,
    colorTo,
    this.glowingColorInfos.iteratorStart,
    this.glowingColorInfos.iteratorEnd
  );
};

/**
 * @private
 *
 * Prepares the ball for blinking
 */
Ball.prototype.computeAndSetBlinkingColor = function() {
  if (this._iterator % this.blinkingRate == 0 && this.color == this._color) {
    this.color = this.blinkingColor;
  } else if (
    this._iterator % this.blinkingRate == 0 &&
    this.color == this.blinkingColor
  ) {
    this.color = this._color;
  }
};

/**
 * @param {Number} dx
 * @param {Number} dy
 * @return {Ball}
 *
 * Moves the ball according to the gravity / friction initialized at its construct and its velocity at the moment
 *
 * Warning : if you call move() twice or more inside an iteration (setTimeout, setInterval, requestAnimationFrame ...) your ball
 * will age quicker because this._iterator is incremented here
 */
Ball.prototype.move = function(dx, dy) {
  this._iterator++;
  dx = dx || 0;
  dy = dy || 0;
  this.x = this.x + this.gravity * this.velocityX;
  this.y = this.y + this.gravity * this.velocityY;
  this.velocityX = this.friction * (this.velocityX + dx);
  this.velocityY = this.friction * (this.velocityY + dy);
  this.updateRadiusOnMove();
  this.updateAlphaOnMove();
  this.updateColorOnMove();
  this.age();
  return this;
};

/**
 * @private
 *
 * Initialize the ball in case this.aging == true
 */
Ball.prototype.born = function() {
  this.radius = 1;
  this.dying = false;
  this.dead = false;
};

/**
 * Flags the ball as dead
 * @note May do other things in the future
 *
 * @return {Ball}
 */
Ball.prototype.die = function() {
  this.dead = true;
  return this;
};

/**
 * Flags the ball as dying, will activate the aging process then die
 *
 * @return {Ball}
 */
Ball.prototype.toDeath = function() {
  this.dying = true;
  this.lifeTime = this.dyingRate;
  return this;
};

/**
 * @private (please use aging:true in options at construct)
 * Decreases the lifeTime of the ball.
 *
 * Called on .move()
 */
Ball.prototype.age = function() {
  //    console.info(this.lifeTime);
  //decrease the lifeTime
  this.lifeTime--;

  //if aging is on, flags as dying when the moment comes
  if (this.lifeTime <= this.dyingRate) this.dying = true;

  //if too old, die
  if (this.lifeTime < 1) this.die();
};

/**
 * @param {Ball} ball
 * @return {Boolean}
 *
 * Detects a collision between this and an other ball
 *
 * http://stackoverflow.com/questions/345838/ball-to-ball-collision-detection-and-handling
 */
Ball.prototype.checkBallCollision = function(ball) {
  var xd = this.x - ball.x;
  var yd = this.y - ball.y;

  var sumRadius = this.radius + ball.radius;
  var sqrRadius = sumRadius * sumRadius;

  var distSqr = xd * xd + yd * yd;

  if (distSqr <= sqrRadius) {
    return true;
  }

  return false;
};

/**
 * @param {Ball} ball
 * @param {Function} callback @optional
 *
 * Resolves a collision between this and an other ball
 *
 * http://www.cademia.org/frontend/doc/cib/util/geo/Vector2D.html
 * http://jamieblog.org/vector2d-for-javascript/
 */
Ball.prototype.resolveBallCollision = function(ball, callback) {
  var RESTITUTION = 0.85;

  //get the mtd
  var delta = this.getVector2D(ball);
  var d = delta.getLength();
  // minimum translation distance to push balls apart after intersecting
  var mtd = delta.scale((this.radius + ball.radius - d) / d);

  // resolve intersection --
  // inverse mass quantities (tophe note :  inverted ball and this)
  var im1 = 1 / this.mass;
  var im2 = 1 / ball.mass;

  // impact speed
  var vectorVelocity = new Vector2D(
    this.velocityX - ball.velocityX,
    this.velocityY - ball.velocityY
  );
  var vn = vectorVelocity.dot(mtd.normalize());

  // sphere intersecting but moving away from each other already
  if (vn > 0) return;

  // collision impulse
  var i = (-(1 + RESTITUTION) * vn) / (im1 + im2);
  var impulse = mtd.scale(i);

  // change in momentum
  var ims1 = impulse.scale(im1);
  var ims2 = impulse.scale(im2);

  this.velocityX = (this.velocityX + ims1.x) * this.elasticity;
  this.velocityY = (this.velocityY + ims1.y) * this.elasticity;
  ball.velocityX = (ball.velocityX - ims2.x) * this.elasticity;
  ball.velocityY = (ball.velocityY - ims2.y) * this.elasticity;

  //update alpha on bounce
  this.updateAlphaOnCollision();
  ball.updateAlphaOnCollision();

  //update color on bounce
  this.updateColorOnCollision();
  ball.updateColorOnCollision();

  if (callback) callback.call({});
};

/**
 * @param {Int} stageWidth
 * @param {Int} stageHeight
 * @param {Function} callback @optional
 *
 * Manages the collisions of this with the borders of the stage stageWidth/stageHeight
 */
Ball.prototype.manageStageBorderCollision = function(
  stageWidth,
  stageHeight,
  callback
) {
  var collision = false;
  //left border
  if (this.x - this.radius < 0) {
    this.velocityX = -this.velocityX * this.elasticity;
    this.x = this.radius;
    collision = true;
  }
  //right border
  if (this.x + this.radius > stageWidth) {
    this.velocityX = -this.velocityX * this.elasticity;
    this.x = stageWidth - this.radius;
    collision = true;
  }
  //top border
  if (this.y - this.radius < 0) {
    this.velocityY = -this.velocityY * this.elasticity;
    this.y = this.radius;
    collision = true;
  }
  //bottom border
  if (this.y + this.radius > stageHeight) {
    this.velocityY = -this.velocityY * this.elasticity;
    this.y = stageHeight - this.radius;
    collision = true;
  }

  if (collision) {
    //        this.updateAlphaOnCollision();
    //        this.updateColorOnCollision();
    if (callback) callback.call({});
  }
};

/**
 * @param {Int} stageWidth
 * @param {Int} stageHeight
 *
 * @return {Boolean}
 *
 * Checks if this is out of the stage stageWidth/stageHeight
 */
Ball.prototype.checkOutOfBounds = function(stageWidth, stageHeight) {
  var GAP = 40;
  if (
    this.x - this.radius < -GAP ||
    this.x + this.radius > stageWidth + GAP ||
    this.y - this.radius < -GAP ||
    this.y + this.radius > stageHeight + GAP
  )
    return true;
  else return false;
};

/**
 * @param {Int} stageWidth
 * @param {Int} stageHeight
 * @param {Int} level @optional
 *
 * @return {Ball}
 *
 * Randomly positions and prepares the velocity of a ball, inside stageWidth/stageHeight
 */
Ball.prototype.setRandomPositionAndSpeedInBounds = function(
  stageWidth,
  stageHeight,
  level
) {
  this.x = this.random() * stageWidth;
  this.y = this.random() * stageHeight;
  this.velocityX = this.random() * 10;
  this.velocityY = this.random() * 10;
  return this;
};

/**
 * @param {Int} stageWidth
 * @param {Int} stageHeight
 * @param {Int} level @optional
 *
 * @return {Ball}
 *
 * Randomly positions and prepares the velocity of a ball, outside stageWidth/stageHeight
 * The velocity of the ball will be set so that it will enter the stage
 * The ball is flagged "temporaryOutOfBounds"
 */
Ball.prototype.setRandomPositionAndSpeedOutOfBounds = function(
  stageWidth,
  stageHeight,
  level
) {
  var GAP = 40;

  if (this.random() > 0.5) {
    this.x = -GAP;
    this.velocityX = this.random() * 10;
  } else {
    this.x = stageWidth + GAP;
    this.velocityX = -this.random() * 10;
  }

  if (this.random() > 0.5) {
    this.y = -GAP;
    this.velocityY = this.random() * 10;
  } else {
    this.y = stageHeight + GAP;
    this.velocityY = -this.random() * 10;
  }
  this.temporaryOutOfBounds = true;

  return this;
};

/**
 * @param {CanvasRenderingContext2D} ctx
 */
Ball.prototype.draw = function(ctx) {
  if (this.alpha < 1) {
    ctx.globalAlpha = this.alpha;
  }
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
  if (this.alpha < 1) {
    ctx.globalAlpha = 1;
  }
};

/**
 * Returns the innerHtml if you don't use canvas
 * Feel free to copy the line below and use it as your needs
 * @return {String}
 */
Ball.prototype.renderHtml = function() {
  return (
    "<div" +
    this.htmlClassAttribute +
    ' style="top:' +
    (this.getY() - this.getRadius()) +
    "px;left:" +
    (this.getX() - this.getRadius()) +
    "px;background:" +
    this.getColor() +
    ";width:" +
    this.getRadius() * 2 +
    "px;height:" +
    this.getRadius() * 2 +
    "px;border-radius:" +
    this.getRadius() +
    "px;-moz-border-radius:" +
    this.getRadius() +
    "px;opacity:" +
    this.getAlpha() +
    '"></div>'
  );
};

/**
 * @param {Ball}
 * @return {Number}
 */
Ball.prototype.computeDistance = function(ball) {
  return Math.sqrt(Math.pow(this.x - ball.x, 2) + Math.pow(this.y - ball.y, 2));
};

/**
 * @param {Ball}
 * @return {Vector2D}
 */
Ball.prototype.getVector2D = function(ball) {
  return new Vector2D(this.x - ball.x, this.y - ball.y);
};

/**
 * @param {Int} currentIndex (current iterator index of the loop)
 * @param {String} colorStart (hexa)
 * @param {String} colorEnd (hexa)
 * @param {Int} indexMin (iterator of the loop from where you started)
 * @param {Int} indexMax (iterator of the loop you intend to reach)
 *
 * @return {String} (color in hexa)
 *
 * http://refactormycode.com/codes/254-hex-color-between-two-colors
 */
Ball.prototype.computeColor = function(
  currentIndex,
  colorStart,
  colorEnd,
  indexMin,
  indexMax
) {
  var n = (currentIndex - indexMin) / (indexMax - indexMin);
  var s = parseInt(colorStart.replace("#", ""), 16);
  var e = parseInt(colorEnd.replace("#", ""), 16);

  var r = this.round(((e >> 16) - (s >> 16)) * n) + (s >> 16);
  var g =
    this.round((((e >> 8) & 0xff) - ((s >> 8) & 0xff)) * n) + ((s >> 8) & 0xff);
  var b = this.round(((e & 0xff) - (s & 0xff)) * n) + (s & 0xff);
  b |= (r << 16) | (g << 8);

  return "#" + ("000000" + b.toString(16)).slice(-6);
};

/**
 * @param {String} colorCode
 * @return {Boolean}
 *
 * Checks Hexa Color code (example : #FF00FF)
 */
Ball.prototype.validateColorCode = function(colorCode) {
  var regColorcode = /^(#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/;
  return regColorcode.test(colorCode);
};

/*
 * @param {Number} alpha
 * @return {Boolean}
 */
Ball.prototype.validateAlpha = function(alpha) {
  if (!isNaN(alpha) && alpha >= 0 && alpha <= 1) return true;
  else return false;
};

/**
 * Alias Math.random (optimize global access)
 * @return {Number}
 */
Ball.prototype.random = function() {
  return Math.random();
};

/**
 * Alias Math.round (optimize global access)
 * @return {Int}
 */
Ball.prototype.round = function(number) {
  return Math.round(number);
};

/* author: Jamie Nhu
 * email: duong_binhnhu@rocketmail.com
 * blog: http://jamieblog.org
 * date: 27th November 2011
 */
function Vector2D(x, y) {
  this.x = x || 0;
  this.y = y || 0; //construct Vector2D with param x,y

  //set x value
  this.setX = function(x) {
    this.x = x;
  };

  //set y value
  this.setY = function(y) {
    this.y = y;
  };

  //magnitude
  this.getLength = function() {
    var length = Math.sqrt(this.x * this.x + this.y * this.y);
    return length;
  };

  //dot product
  this.dot = function(vector) {
    return this.x * vector.x + this.y * vector.y;
  };

  //add vector
  this.add = function(vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  };

  //subtract
  this.subtract = function(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  };

  //normalize
  this.normalize = function() {
    this.x = this.x / this.getLength();
    this.y = this.y / this.getLength();
    return this;
  };

  //scale (multiply)
  this.scale = function(scale) {
    this.x *= scale;
    this.y *= scale;
    return this;
  };

  //has same direction
  this.hasSameDirection = function(vector) {
    if (this.isParralel(vector) && vector.x / this.x > 0) {
      return true;
    }
    return false;
  };

  //check parallel
  this.isParallel = function(vector) {
    if (vector.x / this.x == vector.y / this.y) {
      return true;
    }
    return false;
  };

  //check perpendicular
  this.isPerpendicular = function(vector) {
    if (this.dot(vector) == 0) {
      return true;
    }
    return false;
  };
  //equal
  this.isEqualTo = function(vector) {
    if (
      this.hasSameDirection(vector) &&
      this.getLength() == vector.getLength()
    ) {
      return true;
    }
    return false;
  };

  //angle
  this.angleBetween = function(vector) {
    return Math.acos(
      this.dot(vector) / (this.getLength() * vector.getLength())
    );
  };

  // invert the vetor
  this.invert = function() {
    this.x *= -1;
    this.y *= -1;
    return this;
  };

  //to string
  this.toString = function() {
    return "Vector2d(" + this.x + "," + this.y + ")";
  };
}

// compatibility with new api (can't use `move` keyword in rust)
Ball.prototype.step = Ball.prototype.move;

export default Ball;
