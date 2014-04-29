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



// A convenience function provided along with the class, since it's a rather base functionality
// This takes a coordinate system object and draws a nice coordinate plane on the chosen layer

function drawCoordinatePlane(coordinateSystem, layer, options) {

    layer.activate()
    layer.removeChildren(0)

    var cs = coordinateSystem
    var width = cs.maxx - cs.minx
    var height = cs.maxy - cs.miny

    var xline = new paper.Path.Line(new paper.Point(cs.minx, 0), new paper.Point(cs.maxx, 0))
    xline.strokeWidth = 2.5
    xline.opacity = 0.6
    xline.strokeColor = "black"

    var yline = new paper.Path.Line(new paper.Point(0, cs.miny), new paper.Point(0, cs.maxy))
    yline.strokeWidth = 2.5
    yline.opacity = 0.6
    yline.strokeColor = "black"

    var doBorder = ('border' in options) ? options.border : false
    if (doBorder) {
        var border = new paper.Path.Rectangle(new paper.Point(cs.minx, cs.miny), new paper.Size(width, height))
        border.strokeColor = "black"
        border.opacity = 0.5
        border.strokeWidth = 10.0
    }

    var spaceX = ('x_interval' in options) ? options.x_interval : (cs.maxx - cs.minx) / 10 || 1
    var spaceY = ('y_interval' in options) ? options.y_interval : (cs.maxy - cs.miny) / 10 || 1

    var line = null
    var x = 0
    for (x = 0; x < cs.maxx; x = x + spaceX) {
        line = new paper.Path.Line(new paper.Point(x, cs.miny), new paper.Point(x, cs.maxy))
        line.strokeWidth = 2.0
        line.opacity = 0.2
        line.strokeColor = "black"
    }

    for (x = 0; x > cs.minx; x = x - spaceX) {
        line = new paper.Path.Line(new paper.Point(x, cs.miny), new paper.Point(x, cs.maxy))
        line.strokeWidth = 2.0
        line.opacity = 0.2
        line.strokeColor = "black"
    }

    var y = 0
    for (y = 0; y < cs.maxy; y = y + spaceY) {
        line = new paper.Path.Line(new paper.Point(cs.minx, y), new paper.Point(cs.maxx, y))
        line.strokeWidth = 2.0
        line.opacity = 0.2
        line.strokeColor = "black"
    }

    for (y = 0; y > cs.miny; y = y - spaceY) {
        line = new paper.Path.Line(new paper.Point(cs.minx, y), new paper.Point(cs.maxx, y))
        line.strokeWidth = 2.0
        line.opacity = 0.2
        line.strokeColor = "black"
    }

    layer.setMatrix(cs.matrix)

    paper.view.draw()

}