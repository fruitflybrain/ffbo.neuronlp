// Adapted from https://stackoverflow.com/a/30538574
if( moduleExporter === undefined){
  var moduleExporter = function(name, dependencies, definition) {
    if (typeof module === 'object' && module && module.exports) {
      dependencies = dependencies.map(require);
      module.exports = definition.apply(context, dependencies);
    } else if (typeof require === 'function') {
      define(dependencies, definition);
    } else {
      window[name] = definition();
    }
  };
}

moduleExporter(
  'DynamicMenu',
  ['jquery'],
  function($){
    $ = $ || window.$;

    function uidDecode(id) {

      id = id.replace(/#/g,'hashtag');
      id = id.replace(/:/g,'colon');
      return id;
    }
    function uidEncode(id) {

      if (id.indexOf("hashtag") > -1)
          id = id.replace("hashtag","#");
      if (id.indexOf("colon") > -1)
          id = id.replace("colon",":");
      return id;
    }
    function findIndex(x, array, compare) {

      var idx;
      for (idx = 0; idx < array.length; ++idx) {
        if (compare(x, array[idx]))
          break;
      }
      return idx;
    }

    function compareLeftRigt(x, y) {

      var _x = x.split(' ');
      var _y = y.split(' ');
      if (_x[_x.length-1] == _y[_y.length-1])
        return _x[0] < _y[0];
      else
        return _x[_x.length-1] < _y[_y.length-1] ;
    }

    function compareCase(x, y) {
      var _x = x.toUpperCase();
      var _y = y.toUpperCase();
      if (_x == _y)
        return x[0] < y[0];
      else
        return _x < _y;
    }

    function compare(x, y) {
      return x < y;
    }

    var compareFunc = {
      'LeftRight': compareLeftRigt,
      'Case': compareCase
    }

    var FFBODynamicMenu = function(config, struture){

      var _this = this;
      this.btnLabelList = [];
      this.config = {
        showSymbol: '<i class="fa fa-eye"></i>',
        hideSymbol: '<i class="fa fa-eye-slash"></i>',
        singleObjSel: undefined,
        pinnedObjSel: undefined,
        compare: undefined
      }

      for (var key of Object.keys(config)) {
        if (!(key in this.config))
          continue;
        var val = config[key];
        if (val !== undefined )
          this.config[key] = val;
      }

      if (this.config.compare === undefined)
        this.config.compare = compare;
      else if (typeof this.config.compare === 'string' || this.config.compare instanceof String)
        this.config.compare = compareFunc[this.config.compare];

      this.addNeuron = function(id, label) {
        var btnId = "btn-" + uidDecode(id);
        var domStr = "<li id='li-" + btnId + "'>" +
                      "<a id='" + btnId + "'role='button' label='" + label + "' class='btn-single-ob'>" + _this.config.showSymbol + " " + label + "</a>" +
                     "</li>";

        var idx = findIndex(label, _this.btnLabelList, _this.config.compare);

        if (idx === _this.btnLabelList.length)
          $(_this.config.singleObjSel).append(domStr);
        else {
          var offset = $(_this.config.singleObjSel).children().length - _this.btnLabelList.length;
          $(_this.config.singleObjSel + " > li:nth-child(" + (idx+offset+1) + ")").before(domStr);
        }

        _this.btnLabelList.splice(idx, 0, label);

        $("#" + btnId).click( function() {
            _this.dispatch.resume();
            var id = $(this).attr("id").substring(4);
            id = uidEncode(id);
            _this.dispatch.toggle(id);
            _this.dispatch.highlight(id);
        })
        .mouseenter( function() {
            var id = $(this).attr("id").substring(4);
            id = uidEncode(id);
            _this.dispatch.highlight(id);
        })
        .mouseleave( function() {
            _this.dispatch.resume();
        });
      }

      this.removeNeuron = function(id) {
        var liBtnId = "li-btn-" + uidDecode(id);
        var label = $("#" + liBtnId + " > a").attr('label');
        $("#" + liBtnId).remove();
        var idx = _this.btnLabelList.indexOf(label);
        if (idx > -1)
          _this.btnLabelList.splice(idx, 1);
      }

      this.toggleVisibility = function(id, visibility) {
        var btn = $("[id='btn-" + uidDecode(id) + "']");
        var label = btn.attr('label');
        var symbol = (visibility) ? _this.config.showSymbol : _this.config.hideSymbol;
        btn.html(symbol + " " + label);
      }

      this.updatePinnedNeuron = function(id, label, pinned) {
        id = uidDecode(id);
        var pinBtnId = "btn-pin-" + id;
        if (pinned) {
          $( _this.config.pinnedObjSel ).append(
            "<li><a id='" + pinBtnId + "'role='button' class='btn-single-pin'>" + label + "</a></li>");
          $("#" + pinBtnId)
            .click( function() {
                var id = $(this).attr("id").substring(8);
                updateInfoPanel([$(this).text(), uidEncode(id)]);
            })
            .mouseenter( function() {
                var id = $(this).attr("id").substring(8);
                id = uidEncode(id);
                _this.dispatch.highlight(id);
            })
            .mouseleave( function() {
                _this.dispatch.resume();
            })
        } else {
            $("#" + pinBtnId).remove();
        }
      };

      this.dispatch = {
        highlight: function(){},
        resume: function(){},
        toggle: function(){},
        unpin: function(){},
        hideAll: function(){},
        showAll: function(){},
      };
    };

    return FFBODynamicMenu;
  }
)
