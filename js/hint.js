/* 
 * Hint
 * Basic hinting system for providing in-game help when a player gets stuck.
 * (c) 2015 Q42
 * http://q42.com | @q42
 * Written by Martin Kool
 * martin@q42.nl | @mrtnkl
 */
var HintType = {
  None: 'Nada',
  NumberCanBeEntered:       'NumberCanBeEntered',
  OneDirectionLeft:         'A este número le queda solo una dirección hacia donde mirar <span id="nextdot"></span>',
  ValueReached:             'Este número ya ve todos sus puntos <span id="nextdot" class="red"></span>',
  WouldExceed:              'Este número se va a exceder si sigue mirando más allá en cierta dirección <span id="nextdot" class="red"></span>',
  OneDirectionRequired:     'Hay un punto que es necesario para <br>cualquier solución imaginable <span id="nextdot"></span>',
  MustBeWall:               'Éste debería ser fácil... <span id="nextdot" class="red"></span>',

  ErrorClosedTooEarly:      'Este número no ve suficiente <span id="nextdot"></span>', 
  ErrorClosedTooLate:       'Este número ve demasiado <span id="nextdot" class="red"></span>', 
  Error:                    'Éste no se ve bien <span id="nextdot" class="red"></span>',
  Errors:                   'Éstos no se ven bien <span id="nextdot" class="red"></span>',
  LockedIn:                 'Un punto azul siempre debería ver al menos uno más <span id="nextdot"></span>',
  GameContinued:            'Ahora puedes continuar el<br>juego que habías comenzado <span id="nextdot"></span>'
};

function Hint(grid) {
  var self = this,
      active = false,
      visible = false,
      info = {
        type: HintType.None,
        tile: null
      }

  function clear() {
    hide();
    if (grid)
      grid.unmark();
    active = false;
    info = {
      type: HintType.None,
      tile: null
    }
  }

  function mark(tile, hintType) {
    if (active) {
      info.tile = tile;
      info.type = hintType;
      return true;
    }
    return false;
  }

  function next() {
    var wrongTiles = grid.getClosedWrongTiles();
    if (wrongTiles.length) {
      var wrongTile = Utils.pick(wrongTiles),
          tileInfo = wrongTile.collect(),
          hintType = (tileInfo.numberCount > wrongTile.value? HintType.ErrorClosedTooLate : HintType.ErrorClosedTooEarly);

      wrongTile.mark();
      show(hintType);
      return;
    }

    var lockedInTile = grid.getNextLockedInTile();
    if (lockedInTile) {
      show(HintType.LockedIn);
      lockedInTile.mark();
      return;
    }

    active = true;
    grid.solve(false, true);
    if (info.tile) {
      show(info.type);
      info.tile.mark();
    }
  }

  function show(type) {
    var s = type;
    $('#hintMsg').html('<span>' + s + '</span>');
    $('html').addClass('showHint');
    visible = true;
  }

  function hide() {
    $('html').removeClass('showHint');
    visible = false;
  }

  this.clear = clear;
  this.mark = mark;
  this.next = next;
  this.show = show;
  this.hide = hide;
  
  this.info = info;
  this.__defineGetter__('active', function() { return active; })
  this.__defineSetter__('active', function(v) { active = v; })
  this.__defineGetter__('visible', function() { return visible; })
};