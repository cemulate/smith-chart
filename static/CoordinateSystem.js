/*

This "wraps" the Paper JS matrix class by maintaining a matrix
that represents the correct transformation according to the attributes
you have configured on the class

Access it by myCoordinateSystem.matrix

*/

function CoordinateSystem(real_width, real_height) {

    this.real_width = real_width
    this.real_height = real_height

    this.maxx = 10
    this.minx = -10
    this.maxy = 10
    this.miny = -10

    this._applyCoordinateChanges()

}

CoordinateSystem.prototype.setRealWidth = function(value) {
    this.real_width = value
    this._applyCoordinateChanges()
}

CoordinateSystem.prototype.setRealHeight = function (value) {
    this.real_height = value
    this._applyCoordinateChanges()
}

CoordinateSystem.prototype.setMinX = function (value) {
    this.minx = value
    this._applyCoordinateChanges()
}

CoordinateSystem.prototype.setMinY = function (value) {
    this.miny = value
    this._applyCoordinateChanges()
}

CoordinateSystem.prototype.setMaxX = function (value) {
    this.maxx = value
    this._applyCoordinateChanges()
}

CoordinateSystem.prototype.setMaxY = function (value) {
    this.maxy = value
    this._applyCoordinateChanges()
}

CoordinateSystem.prototype.autoSetFromWidth = function(width) {

    // Sets left, top, width, and height such that the resultant coordinate system has the origin in the middle of the screen,
    // the desired width given, and a height determined from the width such that the aspect ratio is 1:1

    this.minx = (-width) / 2
    this.maxx = width / 2

    var h = (width / this.real_width) * this.real_height

    this.maxy = h / 2
    this.miny = -h / 2

    this._applyCoordinateChanges()

}


CoordinateSystem.prototype._applyCoordinateChanges = function () {

    var left = this.minx
    var top = this.maxy
    var width = this.maxx - this.minx
    var height = -(this.maxy - this.miny)

    var px = ((0 - left) / width) * this.real_width
    var py = ((0 - top) / height) * this.real_height

    var sx = (1 / width) * this.real_width
    var sy = (1 / height) * this.real_height

    this.matrix = new paper.Matrix(sx, 0, 0, sy, px, py)

}

CoordinateSystem.prototype.inverseTransform = function(point) {
    var inv = this.matrix.inverted()
    return inv.transform(point)
}