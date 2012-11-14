Connector = function (elemParent, elemChild) {
    this.parent = elemParent;
    this.child = elemChild;
    this.newChild = null;

    this.render = {};
    this.render.element = null;
    this.render.elem_path = null;
    this.render.elem_circle = null;

    this.nStartX = 0;
    this.nStartY = 0;

    this.nEndX = 0;
    this.nEndY = 0;

    this.svgns = 'http://www.w3.org/2000/svg';
    this.xlinkns = 'http://www.w3.org/1999/xlink';

    this.init = function (elemBody) {
        this.initRender();
        this.updateNodePosition();
        this.bindEvent();
    }

    this.remove = function () {
        $(this.render.elem_path).remove();
        $(this.render.elem_circle).remove();
    };

    this.initRender = function () {
        this.render.element = $(".svgBody");
        this.render.elem_path = this.initPathElement();
        this.render.elem_circle = this.initPointElement();

        this.render.element.append(this.render.elem_path);
        this.render.element.append(this.render.elem_circle);
    }

    this.initPointElement = function () {
        this.render.elem_circle = document.createElementNS(this.svgns, "circle");
        this.render.elem_circle.setAttribute("fill", "#8CF");
        this.render.elem_circle.setAttribute("r", "10px");
        this.render.elem_circle.setAttribute("cx", this.child.getX() - 5 + "px");
        this.render.elem_circle.setAttribute("cy", this.child.getY() + 5 + "px");

        return this.render.elem_circle;
    }

    this.bindEvent = function () {
        var self = this;

        $(this.render.elem_circle).drag("start", function (ev, dd) {
            self.newChild = self.child.createChildNode();
        });

        $(this.render.elem_circle).drag(function (ev, dd) {
            self.newChild.move(dd.offsetX - self.render.element.offset().left, dd.offsetY - self.render.element.offset().top);
        });
    }

    this.initPathElement = function () {
        this.render.elem_path = document.createElementNS(this.svgns, "path");
        this.render.elem_path.setAttribute("d", this.getRenderPath());
        this.render.elem_path.setAttribute("stroke", "#8CF");
        this.render.elem_path.setAttribute("stroke-width", "2");
        this.render.elem_path.setAttribute("fill", "none");

        return this.render.elem_path;
    }

    this.getRenderPath = function () {
        var bwX = ((this.nEndX - this.nStartX) / 2);
        return "M" + this.nStartX + "," + this.nStartY + ",Q" + (this.nStartX + bwX) + "," + this.nEndY + "," + this.nEndX + "," + this.nEndY;
    }

    this.updateNodePosition = function () {
        this.setParentPointPosition(this.parent.getX(), this.parent.getY());
        this.setChildPointPosition(this.child.getX(), this.child.getY());

        this.render.elem_path.setAttribute("d", this.getRenderPath());
        this.render.elem_circle.setAttribute("cx", this.child.getX() - 8);
        this.render.elem_circle.setAttribute("cy", this.child.getY() - 8);
    }

    this.setParentPointPosition = function (nX, nY) {
        this.nStartX = nX;
        this.nStartY = nY;
    }

    this.setChildPointPosition = function (nX, nY) {
        this.nEndX = nX;
        this.nEndY = nY;
    }
}