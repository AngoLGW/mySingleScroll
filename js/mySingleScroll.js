(function ($) {
    var timers = [];
    var methods = {
        init: function (options) {
            var defaults = {
                speed: 3000,//默认时间间隔3s
                direction: 'horizantal'//默认方向水平
            };
            var opts = $.extend({}, defaults, options), intId = [];

            function nextMove(obj, step) {
                obj.find("ul").animate({
                    marginLeft: -step
                }, 150, function () {
                    $(this).find("li").slice(0, 1).appendTo($(this));
                    $(this).css("margin-left", 0);
                });
            }

            function preMove(obj, step) {
                var ul = obj.find("ul");
                ul.css('margin-left', -step);
                ul.find("li").last().prependTo(ul);
                ul.animate({
                    marginLeft: 0
                }, 150, function () {
                    ul.css("margin-left", 0);
                });
            }

            function downMove(obj, step) {
                obj.find("ul").animate({
                    marginTop: -step
                }, 150, function () {
                    $(this).find("li").slice(0, 1).appendTo($(this));
                    $(this).css("margin-top", 0);
                });
            }

            function upMove(obj, step) {
                var ul = obj.find("ul");
                ul.find("li").last().prependTo(ul);
                ul.css('margin-top', -step);
                ul.animate({
                    marginTop: 0
                }, 150, function () {
                    ul.css("margin-top", 0);
                });
            }

            return this.each(function (i) {
                var speed = opts["speed"] < 1000 ? 3000 : opts["speed"];
                var direction = opts["direction"] == 'vertical' || opts["direction"] == 'horizantal' ? opts["direction"] : 'vertical';
                var _this = $(this);
                var ul = _this.find("ul"), pre = _this.find(".pre"), next = _this.find(".next");
                var sh, isMove, ishori, move, lmove, rmove;
                if (direction == 'horizantal') {
                    isMove = _this.width() < ul.width();
                    ishori = true;
                    move = nextMove;
                    lmove = preMove;
                    rmove = nextMove;
                    sh = ul.find("li:first").outerWidth(true);
                } else {
                    isMove = _this.height() < ul.height();
                    ishori = false;
                    move = downMove;
                    lmove = upMove;
                    rmove = downMove;
                    sh = ul.find("li:first").outerHeight(true);
                }
                if (isMove) {
                    timers[i] = setInterval(function () {
                        move(_this, sh);
                    }, speed);

                    _this.hover(function () {
                        clearInterval(timers[i]);
                    }, function () {
                        timers[i] = setInterval(function () {
                            move(_this, sh);
                        }, speed);
                    });
                    pre.click(function () {
                        lmove(_this, sh);
                    });
                    next.click(function () {
                        rmove(_this, sh);
                    });
                }
            });
        },
        destroy: function () {
            return this.each(function (i) {
                _this = $(this);
                clearInterval(timers[i]);
                _this.find('ul').css({ 'margin-top': 0 });
                _this.find('ul').css({ 'margin-left': 0 });
                _this.unbind("mouseenter").unbind("mouseleave");
                _this.find('.pre').unbind('click');
                _this.find('.next').unbind('click');
            });
        }
    }
    $.fn.mySingleScroll = function (options) {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
        } else if (typeof method == 'object' || !method) {
            method = methods.init;
        } else {
            $.error('error');
            return this;
        }
        return method.apply(this, arguments);
    }
})(jQuery)