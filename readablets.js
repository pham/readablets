(function($) {
$.fn.readablets = function($o) {
	var _o = $.extend({
		compact: true,
		twelvehour: true,
		times: [60, 3600, 86400, 2592000, 31536000],
		months: [
			'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
			'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
		],
		second: 's',
		minute: 'm',
		hour: 'h',
		day: 'd'
	}, $o),

	_dm = function($ts) {
		return $ts.getDate() + ' ' + _o.months[$ts.getMonth()];
	},

	_dmy = function($ts) {
		return _dm($ts) + ' ' + $ts.getFullYear().toString().substring(2);
	},

	_dmy_hm = function($ts) {
		return _dmy($ts).replace(/\s/g, '-') + ' @ ' + _hhmm($ts);
	},

	_hhmm = function($ts) {
		var _mm = $ts.getMinutes().toString().replace(/^\d$/, '0$&'),
			_hh = $ts.getHours(),
			_ap = ' am';

		if (_o.twelvehour && (_hh === 0 || _hh > 12)) {
			_hh = (_hh + 12) % 12;
			_ap = ' pm';
		}

		return _hh.toString().replace(/^\d$/, '0$&') + ':' + _mm +
		   (_o.twelvehour ? _ap : '');
	},

	_draw = function($ob) {
		var _start = _o.start || (new Date()).getTime(),
			_ts = parseInt($ob.data('ts') || $ob.text() || 0, 10),
			_d = parseInt((_start - _ts) / 1000, 10),
			_target = new Date(_ts),
			_string = '';

		$ob.data('ts', _ts);

		if (!_o.compact) {
			$ob.text(_dmy_hm(_target));
			return true;
		}

		if (_d < 0) {
			_d = Math.abs(_d);
			_o.future = true;
		} else {
			_o.future = false;
		}

		if (_d < _o.times[0])
			{
			_string = _d + _o.second;
			_reload($ob, 1000);
			}
		else if (_d < _o.times[1])
			{
			_string = Math.round(_d / 60) + _o.minute;
			_reload($ob, 60000);
			}
		else if (_d < _o.times[2])
			{
			_string = Math.round(_d / 3600) + _o.hour;
			_reload($ob, 3600000);
			}
		else if (_d < _o.times[3])
			{
			_string = Math.round(_d / 86400) + _o.day;
			_reload($ob, 86400000);
			}
		else if (_d < _o.times[4])
			{
			_string = _dm(_target);
			}
		else
			{
			_string = _dmy(_target);
			}

		if ($.isFunction(_o.cbFormat)) {
			_string = _o.cbFormat(_string);
		}

		if (_o.future) {
			_string = '+' + _string;
		}

		$ob.attr('title', _dmy_hm(_target))
			.html(_string);
	},

	_reload = function($ob, $ms) {
		$ob.data('timer', setTimeout(function() {_draw($ob)}, $ms));
	};

	return this.each(function() {
		var _this = $(this);
		clearTimeout(_this.data('timer'));

		if (!_this.data('ts')) {
			_this.bind('update', function($e, $ts) {
				_this.data('ts', $ts);
				_draw(_this);
				return false;
			});
		}

		_draw(_this);
		return true;
	});
};
}(jQuery));
