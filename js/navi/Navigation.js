


var Navigation = function () {

    /*
    <div class="navi_wrap" style="position:absolute;right:10px;top:10px;">
    <div class="navi_titlebar" style="text-align:center;">네비게이션</div>
    <div class="navi_body" style="width:250px;height:250px;background:#FFF;border:1px solid #000;">
    <div class="navi_point" style="position:relative;left:0px;top:0px;border:1px solid red;width:10px;height:10px;"></div>
    </div>
    </div>
    */

    this.svgns = 'http://www.w3.org/2000/svg';
    this.xlinkns = 'http://www.w3.org/1999/xlink';

    this.elemNaviWrap = null;
    this.elemNaviTitlebar = null;
    this.elemNaviBody = null;
    this.elemNaviPoint = null;

    this.elemScreen = null;
    this.elemContent = null;
    this.elemBody = null;
    this.elemSvgMini = null;

    this.init = function (elemBody, elemScreen, elemContent) {
        this.elemScreen = elemScreen;
        this.elemContent = elemContent;
        this.elemBody = elemBody;

        this.initElement(this.elemBody);
        this.initNavi(elemScreen, elemContent);
        this.bindEvent();
    }


    this.initNavi = function (elemScreen, elemContent) {
        var screenWidth = $(elemScreen).width();
        var screenHeight = $(elemScreen).height();

        var mapWidth = $(elemContent).width();
        var mapHeight = $(elemContent).height();

        var rateWidth = screenWidth / mapWidth;
        var rateHeight = screenHeight / mapHeight;

        var naviWidth = parseInt($(this.elemNaviBody).css("width"));
        var naviHeight = parseInt($(this.elemNaviBody).css("height"));

        var naviBoxWidth = naviWidth * rateWidth;
        var naviBoxHeight = naviHeight * rateHeight;

        $(this.elemNaviPoint).css({
            width: naviBoxWidth + "px",
            height: naviBoxHeight + "px"
        });
    };

    this.applyNavigation = function(){
        var miniSvgBody = $(".svgBody").clone();
        $(miniSvgBody).css({
            width:"250px",
            height:"250px"
        });

        if(this.elemSvgMini != null){
            $(this.elemSvgMini).remove();
        }

        miniSvgBody.removeAttr("class");
        miniSvgBody.insertBefore( $(this.elemNaviPoint) );
        this.elemSvgMini = miniSvgBody;
        
        return true;
    };

    this.initElement = function () {
        this.elemNaviWrap = document.createElement('div');
        this.elemNaviTitlebar = document.createElement('div');
        this.elemNaviBody = document.createElement('div');
        this.elemNaviPoint = document.createElement('div');

        this.elemNaviWrap.setAttribute("class", "navi_wrap");
        this.elemNaviTitlebar.setAttribute("class", "navi_titlebar");
        this.elemNaviBody.setAttribute("class", "navi_body");
        this.elemNaviPoint.setAttribute("class", "navi_point");

        this.elemSvgMini = document.createElementNS(this.svgns, "circle");

        $(this.elemNaviBody).append(this.elemSvgMini);

        this.elemNaviWrap.appendChild(this.elemNaviTitlebar);
        this.elemNaviBody.appendChild(this.elemNaviPoint);
        this.elemNaviWrap.appendChild(this.elemNaviBody);

        this.elemNaviTitlebar.appendChild(document.createTextNode("Navigation"));

        this.elemBody.append(this.elemNaviWrap);
    }


    this.bindEvent = function () {
        var self = this;
        $(this.elemNaviTitlebar).drag(function (ev, dd) {
            $(self.elemNaviWrap).css({
                left: dd.offsetX,
                top: dd.offsetY,
            });
        });

        $(this.elemNaviPoint).drag(function (ev, dd) {
            var naviLeft = parseInt($(self.elemNaviBody).offset().left);
            var naviTop = parseInt($(self.elemNaviBody).offset().top);
            var naviWidth = $(self.elemNaviBody).width();
            var naviHeight = $(self.elemNaviBody).height();

            var boxWidth = $(self.elemNaviPoint).width();
            var boxHeight = $(self.elemNaviPoint).height();

            var left = dd.offsetX - naviLeft;
            var top = dd.offsetY - naviTop;
            var right = left + boxWidth;
            var bottom = top + boxHeight;

            if (right > naviWidth) { left = naviWidth - boxWidth; }
            if (bottom > naviHeight) { top = naviHeight - boxHeight; }
            if (left < 0) { left = 0; }
            if (top < 0) { top = 0; }

            var rateLeft = left / naviWidth;
            var rateTop = top / naviHeight;

            $(self.elemNaviPoint).css({
                left: left,
                top: top
            });

            $(self.elemContent).css({
                left: -(self.elemContent.width() * rateLeft),
                top: -(self.elemContent.height() * rateTop)
            });

        });
    }

};
