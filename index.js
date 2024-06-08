// samsang config

let GLOBALFRAMECOUNTER = 0;
let ENDED = true;
const LOCK_SEED_LENGTH = 15;
const EMOJI_CHOICES = ['💩', '🙋‍♂️']

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
let raf;

function newBall(text) {
	me = {
		id: Math.random().toString().substring(2,5) + Math.random().toString().substring(2,5) + Math.random().toString().substring(2,5),
		x: 100,
		y: canvas.height,
		vx: 5,
		fc: 0,
		vy: 2,
		exists: true,
		canRot: false,
		rot: randomIntFromInterval(-0.2, 0.4),
		radius: 25,
		color: "blue",
		draw() {
			ctx.save();
			ctx.font = '75px Arial';
			if(this.canRot) ctx.rotate(this.rot);
			this.rot = this.rot - 0.01;
			ctx.fillText(text, this.x, this.y);
			ctx.restore();
		},
		actuallyAnimate() {
			if(this.exists) this.draw();
			this.canRot = true;
			// if(this.fc == 30) this.canRot = true;
			me = [];
			window['ballx'].forEach(xval=>{
				realXval = xval.x;
				me.push(realXval);
			})

			if(calcMedian(me) > 130) {
				this.x += this.vx * randomIntFromInterval(-3, 0.1);
			} else {
				this.x += this.vx * randomIntFromInterval(-1, 0.8);
			}

			
			this.y += this.vy;
	
			if (this.y + this.vy > canvas.height || this.y + this.vy < 0) {
				if(this.y > 20) { this.vy = -this.vy; } else { this.exists = false }
			}
			if (this.x + this.vx > canvas.width || this.x + this.vx < 0) {
				this.exists = false;
			}
			window['ballx'].push({id:this.id, x:this.x});
			this.fc++;
		}
	};
	return me;
}


function calcMedian(arr) {
  var half = Math.floor(arr.length / 2);
  arr.sort(function(a, b) { return a - b;});

  if (arr.length % 2) {
    return arr[half];
  } else {
    return (arr[half] + arr[half] + 1) / 2.0;
  }
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.random() * (max - min + 1) + min
}

window['balls'] = [];
window['ballx'] = [];

document.querySelector('#seedinp').maxLength = LOCK_SEED_LENGTH * 2;
document.querySelector('#seedinp').value = "";

function startBallin(seed="") {
	window['balls'] = [];
	if (seed !== "") {
		seed = seed.toString();
		seedlen = seed.split('|').length;
		seedsplit = seed.split('|');
		if (seedlen > LOCK_SEED_LENGTH + 1) {
			console.log('That seed was a little too long! Cu;po9pt from', seedsplit.length, 'characters to', LOCK_SEED_LENGTH)
			seedsplit.splice(LOCK_SEED_LENGTH, seedsplit.length)
		}
		seedsplit.forEach(no => {
			if(no == "") return;
			if(no == "1") no = EMOJI_CHOICES[1];
			if(no == "0") no = EMOJI_CHOICES[0];
			window['balls'].push(newBall(no))
		})
		document.querySelector('#seed').innerText = "Seed grabbed! Hover over the canvas to run the animation!";
		document.querySelector('#seedinp').value = seedsplit.join('|')
	} else {
		for(let i = 0; i < LOCK_SEED_LENGTH; i ++) {
			let seednum = 0;
			choice = EMOJI_CHOICES[0];
			choicefac = Math.random().toString().substring(2,3);
			if (choicefac > 4) choice = EMOJI_CHOICES[1];
			if (choicefac > 4) seednum = 1;
			seed += '|' + seednum;
			window['balls'].push(newBall(choice));
		}
		document.querySelector('#seed').innerText = "Seed generated. Hover over the canvas to run the animation!";
		document.querySelector('#seedinp').value = seed;
	}
	ENDED = false;
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);	
  if (ENDED) return;
	window['ballx'] = [];
	let nonexistant = 0;

	window['balls'].forEach(ball => {
	ball.actuallyAnimate();
		if(!ball.exists) nonexistant++;
	})

	if (nonexistant !== window['balls'].length) GLOBALFRAMECOUNTER++;
	if (nonexistant === window['balls'].length) {
		console.log('This run lasted', GLOBALFRAMECOUNTER, 'canvas updates/frames.')
		ENDED = true;
	}
	raf = window.requestAnimationFrame(draw);
}

// draw()
requestAnimationFrame(draw);

canvas.addEventListener("mouseover", (e) => {
	if (ENDED) return;
	console.log('Started, mouse over.')
});

canvas.addEventListener("mouseout", (e) => {
	if (ENDED) return;
	console.log('Paused, mouse out.')
	// window.cancelAnimationFrame(raf);
});