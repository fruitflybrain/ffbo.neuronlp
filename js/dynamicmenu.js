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
        removeSymbol: '<i class="fa fa-trash"></i>',
        pinSymbol: '<i class="fa fa-thumb-tack"></i>',
        singleObjSel: undefined,
        pinnedObjSel: undefined,
        compare: undefined,
        removable: false,
        pinnable: false
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
        var changed_label = label.replace('<', '&lt').replace('>', '&gt');
        var btnId = "btn-" + uidDecode(id);
        var btnToggleId = "btn-toggle-" + uidDecode(id);
        var btnRmId = (_this.config.removable) ? "btn-rm-" + uidDecode(id): false;
        var btnPinSymId = (_this.config.pinnable) ? "btn-pin-symbol-" + uidDecode(id): false;
        var domStr = `<li id='li-${btnId}' class='mm-listitem'>` +
                      "<span>" +
                      `<div id='${btnId}' role='button' label="${label}" class='btn-single-ob'>${changed_label}</div>` +
                      "<div class='btn-single-obj-ctrl'>" +
                        ((btnRmId) ? `<a id='${btnRmId}' role='button'>${_this.config.removeSymbol}</a>` : '') +
                        ((btnPinSymId) ? `<a id='${btnPinSymId}' class='btn-unpinned' role='button'>${_this.config.pinSymbol}</a>` : '') +
                        `<a id='${btnToggleId}' role='button'>${_this.config.showSymbol}</a>` +
                        "</div>" +
                      "</span>" +
                     `</li>`;

        var idx = findIndex(label, _this.btnLabelList, _this.config.compare);

        if (idx === _this.btnLabelList.length)
          $(_this.config.singleObjSel).append(domStr);
        else {
          var offset = $(_this.config.singleObjSel).children().length - _this.btnLabelList.length;
          $(_this.config.singleObjSel + " > li:nth-child(" + (idx+offset+1) + ")").before(domStr);
        }

        _this.btnLabelList.splice(idx, 0, label);
        $("#" + btnId)
          .click( function() {
            var id = $(this).attr("id").substring(4);
            id = uidEncode(id);
            _this.dispatch.getInfo(id);
        });
        $("#" + btnToggleId)
          .click( function() {
            var id = $(this).attr("id").substring(11);
            id = uidEncode(id);
            _this.dispatch.toggle(id);
        });
        $("#li-" + btnId)
          .mouseenter( function() {
            var id = $(this).attr("id").substring(7);
            id = uidEncode(id);
            _this.dispatch.highlight(id);
          })
          .mouseleave( function() {
            _this.dispatch.resume();
          });
        if (btnRmId) {
          $("#" + btnRmId).click( function() {
              var id = $(this).attr("id").substring(7);
              id = uidEncode(id);
              _this.dispatch.remove(id);
          })
        }
        if (btnPinSymId) {
          $("#" + btnPinSymId).click( function() {
              var id = $(this).attr("id").substring(15);
              id = uidEncode(id);
              _this.dispatch.togglePin(id);
          })
        }
      }

      this.removeNeuron = function(id) {
        var liBtnId = "li-btn-" + uidDecode(id);
        var label = $("#" + liBtnId + " > span > .btn-single-ob").attr('label');
        $(`[id=${liBtnId}]`).hide("slide", { direction: "right" }, 800, function() {
          $(`#${liBtnId}`).remove();
        });
        var idx = _this.btnLabelList.indexOf(label);
        if (idx > -1)
          _this.btnLabelList.splice(idx, 1);
      }

      this.toggleVisibility = function(id, visibility) {
        var btn = $("[id='btn-toggle-" + uidDecode(id) + "']");
        var symbol = (visibility) ? _this.config.showSymbol : _this.config.hideSymbol;
        btn.html(symbol);
      }

      this.updatePinnedNeuron = function(id, label, pinned) {
        id = uidDecode(id);
        var changed_label = label.replace('<', '&lt').replace('>', '&gt');
        var pinBtnId = "btn-pin-" + id;
        var pinnedSymbolId = "btn-pinned-" + id;
        if (pinned) {
          var domStr = `<li id='li-${pinBtnId}' class='mm-listitem'>` +
                         "<span>" +
                           `<div id='${pinBtnId}' role='button'  class='btn-single-ob btn-pinned'>${changed_label}</div>` +
                           `<div class='btn-single-obj-ctrl'><a id='${pinnedSymbolId}' class='btn-pinned' role='button'>${_this.config.pinSymbol}</a></div>` +
                         "</span>" +
                       "</li>";
          $( _this.config.pinnedObjSel ).append(domStr);
          $("#" + pinBtnId)
            .click( function() {
                var id = $(this).attr("id").substring(8);
                _this.dispatch.getInfo(uidEncode(id));
            })
          $("#" + pinnedSymbolId)
            .click( function() {
                var id = $(this).attr("id").substring(11);
                $(this).removeClass("btn-pinned");
                $(this).addClass("btn-unpinned");
                _this.dispatch.unpin(uidEncode(id));
            })
          $("#li-" + pinBtnId)
            .mouseenter( function() {
                var id = $(this).attr("id").substring(11);
                id = uidEncode(id);
                _this.dispatch.highlight(id);
            })
            .mouseleave( function() {
                _this.dispatch.resume();
            })
        } else {
            $("#li-" + pinBtnId).hide("slide", { direction: "right" }, 800, function() {
              $("#li-" + pinBtnId).remove();
            });
        }

        if (_this.config.pinnable) {
          var btnPinSymId = "btn-pin-symbol-" + id;
          var oldClass = ((pinned) ? "btn-unpinned" : "btn-pinned");
          var newClass = ((pinned) ? "btn-pinned" : "btn-unpinned");
          $(`[id=${btnPinSymId}]`).removeClass(oldClass).addClass(newClass);
        }

      };

      this.dispatch = {
        getInfo: function(){},
        highlight: function(){},
        resume: function(){},
        toggle: function(){},
        unpin: function(){},
        hideAll: function(){},
        showAll: function(){},
        remove: function(){}
      };
    };

    return FFBODynamicMenu;
  }
)
