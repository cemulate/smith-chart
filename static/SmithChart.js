function isWhole(num) {
    var i = Math.abs(num) % 1
    return ((i < 0.0000001) || (i > 0.9999999))
}

function getZ(gamma) {
    var one = new Complex(1, 0)
    return gamma.add(one).mul(gamma.neg().add(one).inv()) // Z = (1 + gamma) / (1 - gamma)
}

function getGamma(z) {
    var one = new Complex(1, 0)
    return z.add(one.neg()).mul(z.add(one).inv()) // gamma = (z - 1) / (z + 1)
}

function SmithChart(surface_width, surface_height, callbacks) {

    this.callbacks = callbacks

    this.coordinateSystem = new CoordinateSystem(surface_width, surface_height)
    this.coordinateSystem.autoSetFromWidth(2.75)

    this.bgLayer = new paper.Layer()
    this.staticGroup = new paper.Group()
    this._drawBgLayer()

    this.cursor = {
        gamma: new Complex(0, 0),
        z: new Complex(0, 0)
    }
    this.cursor_display = false
    this.selection = null

    this.mouseTool = new paper.Tool()
    this._configureTool()

    this.cursorLayer = new paper.Layer()
    this.dynamicGroup = new paper.Group()
    this.drawCursorLayer()

    // this.mainLayer = new paper.Layer()
    // this.staticGroup = new paper.Group()

}

SmithChart.prototype.setSelectionByGamma = function(gamma) {
    this.selection = {
        gamma: gamma,
        z: getZ(gamma)
    }

    this.drawCursorLayer()
}

SmithChart.prototype.setSelectionByZ = function(z) {
    this.selection = {
        gamma: getGamma(z),
        z: z
    }

    this.drawCursorLayer()
}

SmithChart.prototype._configureTool = function () {
    
    var self = this

    this.mouseTool.onMouseMove = function (event) {
        var p = self.coordinateSystem.inverseTransform(event.point)
        
        var g = new Complex(p.x, p.y)

        if (g.mag() <= 1) {

            self.cursor_display = true
            
            self.cursor.gamma = g
            self.cursor.z = getZ(g)
            if (self.callbacks.stateUpdated) {
                self.callbacks.stateUpdated()
            }
        } else {
            self.cursor_display = false
        }

        self.drawCursorLayer()
    }


    this.mouseTool.onMouseDown = function(event) {
        if (self.selection == null) {
            self.selection = {
                gamma: self.cursor.gamma,
                z: self.cursor.z
            }
        } else {
            self.selection = null
        }

        if (self.callbacks.stateUpdated) {
            self.callbacks.stateUpdated()
        }

        self.drawCursorLayer()
    }

}

SmithChart.prototype._drawBgLayer = function () {

    this.bgLayer.activate()
    this.bgLayer.removeChildren(0)

    var cs = this.coordinateSystem

    var xaxis = new paper.Path.Line(new paper.Point(0, cs.miny), new paper.Point(0, cs.maxy))
    xaxis.strokeColor = 'black'
    xaxis.strokeWidth = 2.5
    xaxis.opacity = 0.6
    var yaxis = new paper.Path.Line(new paper.Point(cs.minx, 0), new paper.Point(cs.maxx, 0))
    yaxis.strokeColor = 'black'
    yaxis.strokeWidth = 2.5
    yaxis.opacity = 0.6

    this.staticGroup.removeChildren(0)

    // Clip to the unit circle (slightly outside)
    var clip = new paper.Path.Circle(new paper.Point(0, 0), 1.005)
    this.staticGroup.addChild(clip)

    var i = 0
    for (i = 0; i < 10.05; i += 0.2) {
        var c = this.circle_constRL(i)
        c.strokeColor = "black"
        c.opacity = isWhole(i) ? 0.6 : 0.2
        this.staticGroup.addChild(c)
    }

    for (i = -5; i < 5.05; i += 0.2) {
        var c = this.circle_constXL(i)
        c.strokeColor = "black"
        c.opacity = isWhole(i) ? 0.6 : 0.2
        this.staticGroup.addChild(c)
    }

    this.staticGroup.clipped = true

    this.bgLayer.addChild(this.staticGroup)


    this.bgLayer.setMatrix(this.coordinateSystem.matrix)
    paper.project.view.draw()


}

SmithChart.prototype.drawCursorLayer = function () {
    this.cursorLayer.activate()
    this.cursorLayer.removeChildren(0)

    this.dynamicGroup.removeChildren(0)

    var clip = new paper.Path.Circle(new paper.Point(0, 0), 1.005)
    this.dynamicGroup.addChild(clip)

    if (this.selection != null) {

        var rl = this.circle_constRL(this.selection.z.r)
        rl.opacity = 1
        rl.strokeColor = "blue"
        rl.strokeWidth = 4
        this.dynamicGroup.addChild(rl)

        var xl = this.circle_constXL(this.selection.z.i)
        xl.opacity = 1
        xl.strokeColor = "blue"
        xl.strokeWidth = 4
        this.dynamicGroup.addChild(xl)

        var p = new paper.Path.Circle(new paper.Point(this.selection.gamma.r, this.selection.gamma.i), 0.02)
        p.opacity = 1
        p.fillColor = "blue"
        this.dynamicGroup.addChild(p)

    } else if (this.cursor_display) {

        var rl = this.circle_constRL(this.cursor.z.r)
        rl.opacity = 1
        rl.strokeColor = "red"
        rl.strokeWidth = 4
        this.dynamicGroup.addChild(rl)

        var xl = this.circle_constXL(this.cursor.z.i)
        xl.opacity = 1
        xl.strokeColor = "red"
        xl.strokeWidth = 4
        this.dynamicGroup.addChild(xl)
    }


    this.dynamicGroup.clipped = true

    this.cursorLayer.addChild(this.dynamicGroup)
    this.cursorLayer.setMatrix(this.coordinateSystem.matrix)

    paper.project.view.draw()

}


SmithChart.prototype.circle_constRL = function (rl) {

    var center = new paper.Point(rl / (1.0 + rl), 0)
    var radius = 1.0 / (1.0 + rl)

    return paper.Path.Circle(center, radius)

}

SmithChart.prototype.circle_constXL = function (xl) {

    var center = new paper.Point(1.0, 1.0 / xl)
    var radius = 1.0 / xl

    return paper.Path.Circle(center, radius)

}

