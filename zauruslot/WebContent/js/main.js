/**
 * Zauruslot.
 * @author ponta
 */
var reel0 = [4, 1, 7, 2, 5, 3, 4, 1, 3, 4, 6, 4, 1, 5, 2, 7, 3, 4, 1, 4, 3];
var reel1 = [1, 2, 7, 1, 3, 2, 4, 6, 1, 3, 2, 5, 1, 3, 6, 2, 1, 3, 2, 4, 2];
var reel2 = [4, 1, 7, 3, 1, 2, 3, 4, 1, 2, 5, 3, 4, 1, 2, 6, 3, 4, 1, 2, 3];

$(document).ready(function() {
	var gap = getReelTop();

	// initial setting
	$('.reelFace').each(function() {
		var reel = $(this);
		reel.attr('dy', 2);
		reel.attr('stat', 0); // stat={0:stopped, 1:rotating, 2:down}
	});
	$('.reel').mousedown(function() {
		var reel = $(this).find('.reelFace');
		var stat = parseInt(reel.attr('stat'));
		if (stat !== 1) {
			return;
		}
		var offset = reel.offset();
		var iy = offset.top - gap;
		var mark = parseInt(iy / 40);

		if (mark === 0) {
			mark = -21;
		}
		reel.attr('stat', 2);
		reel.attr('mark', mark);
	});
	$('#trigger').click(function() {
		if (getReelStat() !== 0) {
			return;
		}
		var credit = parseInt($('#coin').text());
		if (credit < 3) {
			return;
		}
		$('#coin').text(credit - 3);
		$('.reelFace').each(function() {
			var reel = $(this);
			reel.attr('dy', 0);
			reel.attr('stat', 1);
		});
	});
	mainLoop();
});

function mainLoop() {
	var gap = getReelTop();
	setTimeout(function() {
		$('.reelFace').each(function() {
			var reel = $(this);
			var stat = parseInt(reel.attr('stat'));
	
			if (stat === 0) {
				return;
			}
			var offset = reel.offset();
			var iy = offset.top - gap;
			var dy = parseInt(reel.attr('dy'));

			if (dy < 16) {
				dy += 2;
			}
			iy += dy;
			if (stat === 2) {
				var mark = parseInt(reel.attr('mark'));
				var markPos = mark * 40 + 10;
				if (markPos < iy) {
					iy = markPos;
					reel.attr('stat', 0);
					if (getReelStat() === 0) {
						judge();
					}
				}
			}
			if (0 < iy) {
				iy -= 840;
			}
			reel.offset({ top: iy + gap, left: offset.left });
			reel.attr('iy', iy);
			reel.attr('dy', dy);
		});
		mainLoop();
	}, 33);
}

function judge() {
	var marks = [];
	$('.reelFace').each(function(ix, obj) {
		marks[ix] = -parseInt($(this).attr('mark')) % 21;
	});
//	console.log('mark:' + marks[0] + '|' + marks[1] + '|' + marks[2]);
	var coin = 0;
	coin += sameFace(marks, 0, 0, 0); // 上
	coin += sameFace(marks, 1, 1, 1); // 中
	coin += sameFace(marks, 2, 2, 2); // 下
	coin += sameFace(marks, 0, 1, 2); // ななめ
	coin += sameFace(marks, 2, 1, 0); // ななめ
	if (0 < coin) {
		$('#coin').slideUp('slow', function() {
			var credit = parseInt($(this).text());
			$(this).text(credit + coin);
			$(this).show();
		});
	}
}

function sameFace(marks, ix0, ix1, ix2) {
	var result = 0;
	var val0 = reel0[(marks[0] + ix0) % 21];
	var val1 = reel1[(marks[1] + ix1) % 21];
	var val2 = reel2[(marks[2] + ix2) % 21];
	if (val0 == val1 && val1 == val2) {
		if (val0 == 2) {
			result = 30;
		} else if (val0 == 7) {
			result = 100;
		} else {
			result = 10;
		}
	}
	return result;
}

function getReelStat() {
	var result = 0;
	$('.reelFace').each(function() {
		var reel = $(this);
		var stat = parseInt(reel.attr('stat'));

		if (stat !== 0) {
			result = stat;
			return false;
		}
	});
	return result;
}

function getReelTop() {
	var offset = $('#reel0').offset();

	return offset.top;
}
