/**
 * 以form-get形式提交的bootstrap分页插件
 * 
 * 
 * @author laoqiming <laoqiming@qq.com>
 * 
 * @date 2017-5-6
 * 
 * @example
 * $('.form-pagination').formPagination();
 * 
 * @example
 * $('.form-pagination').formPagination({pagesize:12});
 * 
 */
;(function(factory ,undefined){
    if(typeof define == 'function' && define.amd){
        define(['jquery'],factory);
    }else if(typeof jQuery != undefined){
        factory(jQuery);
    }
})(function($){
    "use strict";
    $.fn.formPagination = function(options){
        var o = {
            empty : '<div class="alert alert-warning text-center">没有符合条件的记录！</div>'
        };
        $.extend(o,options);
        return this.each(function(){
            var _s = $(this),
                urlParams = parse_url(location.search),
                paramHtml = [],
                page = 1,
                pagesize = 12,
                pagecount = 1,
                recordcount = 0,
                showpagecount = 5;

            //把页面请求参数导入form，以不丢失页面参数。
            for(var p in urlParams){
                if(!_s.find('[name='+p+']').length){
                    paramHtml.push('<input type="hidden" name="'+p+'" value="'+urlParams[p]+'">');
                }
            };
            $(paramHtml.join('')).appendTo(_s);

            //更新分页参数
            updateParams.call(_s,urlParams);

            //获取分页数据
            page = Number($('.form-pagination-page',this).val()) || pagesize;
            pagesize = Number($('.form-pagination-pagesize',this).val()) || pagesize;
            recordcount = Number($('.form-pagination-recordcount',this).val()) || recordcount;
            showpagecount = Number($('.form-pagination-showpagecount',this).val()) || showpagecount;

            //计算分页数据
            pagecount = Math.floor(recordcount / pagesize) + (recordcount % pagesize ? 1:0);
            page = page < 1 ? 1 : page ;
            page = page > pagecount ? pagecount : page ;

            $('.form-pagination-page',this).val(page);


            //计算链接分页
            var _pageStart = 1,_pageEnd = 1,_pagePadding = Math.floor(showpagecount/2);
            _pageStart = page - _pagePadding < 1 ? 1 : page - _pagePadding;
            _pageEnd = showpagecount + _pageStart - 1;
            _pageEnd = _pageEnd > pagecount ? pagecount : _pageEnd;
            //console.log(pagecount + '|'+_pageStart+'|'+ _pageEnd + '|' + showpagecount);
            if((_pageEnd - _pageStart + 1) < showpagecount  && _pageStart > 1){
                //如果显示的分页数不够showpagecount,而且开始页不是第一页，则向前面增加分页数。
                _pageStart = _pageStart - (showpagecount - (_pageEnd - _pageStart + 1));
                _pageStart =  _pageStart < 1 ? 1 : _pageStart;
            }
            //console.log(pagecount + '|'+_pageStart+'|'+ _pageEnd + '|' + showpagecount);

            //处理分页栏
            if($('.form-pagination',this).length==0){
                $('<div class="form-pagination"></div>').appendTo(this);
            }

            if(recordcount>0){

                //有数据记录时，渲染分页控件
                if($('.form-pagination-paging',this).length==0){
                    $('<div class="form-pagination-stat">共有<b class="form-pagination-stat-recordcount">0</b>条记录</div> \
                        <ul class="pagination form-pagination-paging">\
                        </ul>\
                        <div class="form-pagination-gotopage-wrap">\
                            <div class="input-group">\
                                <div class="input-group-addon">跳到</div> \
                                <select class="form-pagination-gotopage form-control"></select> \
                            </div> \
                        </div>').appendTo($('.form-pagination',this));
                }
                //生成链接分页html
                var pagingHtml = [];

                pagingHtml.push('<li><a href="javascript:;" data-page="1"><i class="glyphicon glyphicon-step-backward"></i> </a></li>');
                for(var i =  _pageStart ; i <= _pageEnd ; i++){
                    pagingHtml.push('<li class="'+(i==page?'active':'')+'"><a href="javascript:;" data-page="'+i+'">'+i+'</a></li>');
                }
                pagingHtml.push('<li><a href="javascript:;" data-page="'+pagecount+'"><i class="glyphicon glyphicon-step-forward"></i> </a></li>');
                $(pagingHtml.join('')).appendTo($('.form-pagination-paging',this));
                $('.form-pagination-stat-recordcount',this).text(recordcount);

                //生成跳转分页
                pagingHtml = [];
                for(i = 1; i<= pagecount ; i++ ){
                    pagingHtml.push('<option value="'+i+'">'+i+'</option>');
                }
                $(pagingHtml.join('')).appendTo($('.form-pagination-gotopage',this));

            }else{
                //没有数据记录时，显示无记录提示
                $('.form-pagination',this).html(o.empty);

            }

            //事件绑定
            $('.form-pagination-gotopage',this).val( page ).change(function(){
                _s.find('.form-pagination-page').val($(this).val());
                _s.trigger('submit');
            });
            $('.form-pagination-paging a',this).click(function(){
                _s.find('.form-pagination-page').val($(this).attr('data-page'));
                _s.trigger('submit');
            });
            if($('.form-pagination-pagesize',this).is('select')){
                $('.form-pagination-pagesize',this).change(function(){
                    _s.trigger('submit');
                });
            }
            _s.submit(function(e){
                console.log(e);
                if(!e.isTrigger){
                    $('.form-pagination-page',this).val(1);
                    console.log($('.form-pagination-page',this).val());
                }
            });
        });
        function parse_url(_url){
            var pattern = /([\w-]+)=([^&]+)/ig;
            var parames = {};
            _url.replace(pattern, function(a, b, c){
                parames[b] = typeof parames[b] == 'undefined' ? decodeURI(c) : (parames[b]+','+ decodeURI(c));
            });
            return parames;
        }
        function updateParams(params){
            //更新参数
            var control = null,
                value = '';
            for(var name in params){
                control = $('[name='+name+']',this);
                value = params[name] || '';
                if(control.is(':checkbox')){
                    value = value.split(',');
                    control.prop('checked',false).each(function(){
                        var item = $(this);
                        for(var v in value){
                            if(item.attr('value')== value[v]){
                                item.prop('checked',true);
                            }
                        }
                    })
                }else if(control.is(':radio')){
                    control.each(function(){
                        $(this).prop('checked',$(this).attr('value')== value);
                    })
                }else{
                    control.val(value);
                }
            }
        }
    }
});