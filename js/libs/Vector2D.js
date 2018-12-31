class Vector2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  get_length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  dot(vector) {
    return this.x * vector.x + this.y * vector.y;
  }
  normalize() {
    return new Vector2D(this.x / this.get_length(), this.y / this.get_length());
  }
  scale(scale) {
    return new Vector2D(this.x * scale, this.y * scale);
  }
}

export default Vector2D;
