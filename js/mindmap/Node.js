
Node = function (nodeParent) {
    this.render = {};
    this.render.element = null;
    this.render.elem_textNode = null;
    this.render.newChildNode = null;
    this.childList = [];
    this.nX = 0;
    this.nY = 0;
    this.connector = null;
    this.elemBody = null;
    this.level = 0;

    if (nodeParent === undefined) {
        this.parent = this;
    } else {
        this.parent = nodeParent;
    }

    this.initConnector = function (elemBody) {
        this.connector = new Connector(this.parent, this);
        this.connector.init(elemBody);
    }

    this.setText = function (text) {
        this.render.elem_textNode.textContent = text;
    }

    this.init = function (elemBody, nX, nY, level) {
        if (level !== undefined) {
            this.level = level;
        }

        this.elemBody = elemBody;
        this.initRender();
        this.initConnector(elemBody);


        this.move(nX, nY);
    }

    this.move = function (nX, nY) {
        $(this.render.element).css({
            left: nX,
            top: nY
        });

        this.nX = nX;
        this.nY = nY;

        this.updateConnector();
    }

    this.updateConnector = function () {
        this.connector.updateNodePosition();

        for (var iter = 0, len = this.childList.length; iter < len; iter++) {
            this.childList[iter].updateConnector();
        }
    }

    this.getX = function () {
        return this.nX;
    }

    this.getY = function () {
        return this.nY;
    }

    this.initRender = function () {
        this.render.element = document.createElement("div");

        $(this.render.element).data("object", this);
        
        //$(this.render.element).data("object").remove();
        var fixLevel = (this.level > 4) ? 4 : this.level;
        this.render.element.setAttribute("class", "node node" + fixLevel);

        this.render.elem_textNode = document.createTextNode("New Node" + cnt++);
        this.render.element.appendChild(this.render.elem_textNode);

        this.elemBody.append(this.render.element);
        this.bindRenderEvent();
    };

    this.createChildNode = function () {
        var childNode = new Node(this);
        childNode.init(this.elemBody, this.getX(), this.getY(), this.level + 1);
        this.childList.push(childNode);

        return childNode;
    };

    this.remove = function () {
        $(this.render.element).remove();
        this.connector.remove();

        for (var iter = 0, len = this.childList.length; iter < len; iter++) {
            this.childList[iter].connector.parent = this.childList[iter];
            this.childList[iter].parent = this.childList[iter];
            this.childList[iter].updateConnector();
        }
    }

    this.bindRenderEvent = function () {
        var self = this;

        $(this.render.element).click(function () {
            //self.render.element.setAttribute("contenteditable", "true");

            var sel = window.getSelection();
            var range = document.createRange();
            range.setStart(self.render.element, 0);
            range.setEnd(self.render.element, 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        });

        $(this.render.element).live("dblclick", function (e) {
            self.remove();
        });

        $(this.render.element).drag(function (ev, dd) {
            self.move(dd.offsetX - self.elemBody.offset().left, dd.offsetY - self.elemBody.offset().top);
        });
    }
};