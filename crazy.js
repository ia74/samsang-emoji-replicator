const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
let raf;

function newBall(text) {
	return {
		id: Math.random().toString().substring(2,5) + Math.random().toString().substring(2,5) + Math.random().toString().substring(2,5),
		x: 100,
		y: canvas.height,
		vx: 5,
		vy: 2,
		exists: true,
		radius: 25,
		color: "blue",
		draw() {
			ctx.save();
			ctx.scale(0.5, 0.5);
			ctx.translate(100,100);
			ctx.font = '75px Arial';
			rot = randomIntFromInterval(1, 2);
			ctx.rotate(rot);
			ctx.fillText(text, this.x, this.y);
			ctx.restore();
		},
		actuallyAnimate() {
			if(this.exists) this.draw();
			me = [];
			window['ballx'].forEach(xval=>{
				realXval = xval.x;
				me.push(realXval);
			})

			if(calcMedian(me) > 130) {
				this.x += this.vx * randomIntFromInterval(-2, 0.1);
			} else {
				this.x += this.vx * randomIntFromInterval(-1, 0.45);
			}

			
			this.y += this.vy;
	
			if (this.y + this.vy > canvas.height || this.y + this.vy < 0) {
				if(this.y > 20) { this.vy = -this.vy; } else { this.exists = false }
			}
			if (this.x + this.vx > canvas.width || this.x + this.vx < 0) {
				this.exists = false;
			}
			window['ballx'].push({id:this.id, x:this.x});
		}
	};
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

for(let i = 0; i < 15; i ++) {
	choice = "💩";
	choicefac = Math.random().toString().substring(2,3);
	if (choicefac > 4) choice = "🙋‍♂️";
	window['balls'].push(newBall(choice));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);	
	window['ballx'] = [];

	window['balls'].forEach(ball => {
		ball.actuallyAnimate();
	})

  raf = window.requestAnimationFrame(draw);
}

canvas.addEventListener("mouseover", (e) => {
  raf = window.requestAnimationFrame(draw);
});

canvas.addEventListener("mouseout", (e) => {
  window.cancelAnimationFrame(raf);
});