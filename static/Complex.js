function Complex(config, imag) {
	
	// Complex(real, imag)
	// Complex({real: <num>, imag: <num>})
	// Complex({angle: <num>, mag: <num>})

	if (typeof(config) == "number") {
		this.r = config
		this.i = imag
	} else if (typeof(config) == "object") {
		if (config.real != null && config.imag != null) {
			this.r = config.real
			this.i = config.imag
		} else if (config.angle != null && config.mag != null) {
			this.r = config.mag * Math.cos(config.angle)
			this.i = config.mag * Math.sin(config.angle)
		} else {
			this.r = 0
			this.i = 0
		}
	}
}

Complex.prototype.mag = function() {
	return Math.sqrt(this.r*this.r + this.i*this.i)
}

Complex.prototype.angle = function() {
	return Math.atan2(this.i, this.r)
}

Complex.prototype.conj = function() {
	return new Complex(this.r, -this.i)
}

Complex.prototype.add = function(c) {
	return new Complex(this.r + c.r, this.i + c.i)
}

Complex.prototype.neg = function() {
	return new Complex(-this.r, -this.i)
}

Complex.prototype.mul = function(c) {
	return new Complex(this.r * c.r - this.i * c.i, this.r * c.i + this.i * c.r)
}

Complex.prototype.inv = function() {
	return new Complex({
		angle: -this.angle(),
		mag: 1 / this.mag()
	})
}

Complex.prototype.copy = function() {
	return new Complex(this.r, this.i)
}