(function ($) {
    $.fn.extend({
        prompt:function (data_url, max_num, ul_id, word_least_length_to_show_prompt, outer_css, line_css, line_selected_css) {
            max_num = max_num || '5'; // 每次最多获取的数据量，默认5行
            word_least_length_to_show_prompt = word_least_length_to_show_prompt || 1; // 最短输入几个字符显示提示
            outer_css = outer_css || {
                'background':'#ffffff', 'color':'#CCC',
                'border':'1px solid #DDDDDD'
            }; // 生成的ul的css
            line_css = line_css || {
                'background-color':'white',
                'color':'black',
                'cursor':'pointer',
                'text-align': 'left'
            }; // 生成的li的css
            line_selected_css = line_selected_css || {
                'background-color':'#EBEBEB'
            };

            function randomString(length) {
                var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
                if (!length) {
                    length = Math.floor(Math.random() * chars.length);
                }
                var str = '';
                for (var i = 0; i < length; i++) {
                    str += chars[Math.floor(Math.random() * chars.length)];
                }
                return str;
            }

            var input = $(this);

            var l = input.offset().left;
            var w = input.width();
            ul_id = ul_id || randomString(10);
            outer = $("<ul id='" + ul_id + "'></ul>");
            outer.insertAfter(input);
            outer.css({
                'position':'absolute',
                'overflow':'hidden',
                'margin':'0px',
                'padding':'0px',
                'line-height':'20px',
                'background':'none repeat scroll 0 0',
                'list-style-type':'none'
            });
            outer.css(outer_css);
            outer.offset({
                left:l
            });
            outer.width(w + parseInt(input.css('padding-left')) + parseInt(input.css('padding-right')));
            outer.hide();

            var currentIndex = -1;
            var li_count = 0;


            function mouse_over_line_handler() {
                if (currentIndex > -1) {
                    var old_selected = outer.children('[index=' + currentIndex + ']');
                    old_selected.css(line_css);
                }
                currentIndex = $(this).attr('index');
                var now_selected = outer.children('[index=' + currentIndex + ']');
                now_selected.css(line_selected_css);
                input.val(now_selected.text());
            }

            var last_keyup_time = new Date().getTime();

            // 根据上下键选择
            input.bind('keyup', function (event) {
                var keyCode = event.keyCode;
                outer = $("#" + ul_id);
                switch (keyCode) {
                    case 13:
                    {
                        outer.html('');
                        outer.hide();
                    }
                        break;
                    case 38:
                    {        // 向上键
                        if (currentIndex > -1) {
                            var old_selected = outer.children('[index=' + currentIndex + ']');
                            old_selected.css(line_css);
                        }
                        if (currentIndex < 0) {
                            currentIndex = (li_count - 1);
                        } else {
                            currentIndex = (currentIndex - 1) % li_count;
                        }
                        var now_selected = outer.children('[index=' + currentIndex + ']');
                        now_selected.css(line_selected_css);
                        input.val(now_selected.text());
                    }
                        break;
                    case 40:
                    {         // 向下键
                        if (currentIndex > -1) {
                            var old_selected = outer.children('[index=' + currentIndex + ']');
                            old_selected.css(line_css);
                        }
                        currentIndex = (currentIndex + 1) % li_count;
                        var now_selected = outer.children('[index=' + currentIndex + ']');
                        now_selected.css(line_selected_css);
                        input.val(now_selected.text());
                    }
                        break;
                    default :
                    {
                        var now_time = new Date().getTime();
                        if (now_time - last_keyup_time < 500) { // 500ms内连续敲击不联网查询
                            return;
                        }
                        last_keyup_time = now_time;
                        var word = input.val();
                        if (word.length < word_least_length_to_show_prompt) {
                            outer.hide();
                            return;
                        }
                        $.getJSON(data_url, {
                            "word":word,
                            'max_num':max_num
                        }, function (data) {
                            outer.html('');
                            var c = 0;
                            for (var k in data) {
                                var new_li = $("<li index='" + (c++) + "'></li>");
                                new_li.text(data[k]);
                                new_li.css(line_css);
                                outer.append(new_li);
                                new_li.mouseover(mouse_over_line_handler);
                            }
                            li_count = data.length;
                            currentIndex = -1;
                            outer.show();
                        });
                    }
                        break;
                }
            });
            /*延迟时间执行blur,以备鼠标点击按钮可选*/
            $(this).blur(function () {
                setTimeout(function () {
                    outer.hide();
                }, 260);
            });
            $(this).focus(function () {
                outer.show();
            });
        }
    });
})(jQuery);
