var p
var g = 9.82
var m = 50.0
var l = 400.0

function Pendulum(origin_, r_, m_) {
	this.path = [];
	this.origin = origin_.copy();
	this.position = createVector();
	this.r = r_;
	this.angle = PI / 4;

	this.aVelocity = 0.0;
	this.aAcceleration = 0.0;
	this.damping = 0.995 - 0.0005 * m;   // amortiguacion
	this.ballr = m_;      // radio bola masa

	this.dragging = false;


	this.go = function () {
		this.update();  //calcula y actualiza
		this.drag();    //eventos usuario
		this.display(); // dibuja
	};

	var gravity = 0.1 * g
	this.damping = 0.995 - 0.0003 * m / 3
	this.aAcceleration = (-1 * gravity / this.r) * sin(this.angle)
	this.aVelocity += this.aAcceleration
	this.aVelocity *= this.damping
	this.angle += this.aVelocity

	this.display = function () {
		this.position.set(l * sin(this.angle), l * cos(this.angle), 0) //length * sin(theta), length * cos(theta)
		this.position.add(this.origin)

		stroke('#e0ad16');
		strokeWeight(2);
		// dibujar brazo
		line(this.origin.x, this.origin.y, this.position.x, this.position.y);

		ellipseMode(CENTER); //configurar p5 para generar desde el centro circunferencias

		this.path.push(new Punto(this.position.x, this.position.y));
		if (this.path.length > 100) { this.path.splice(0, 1); }
		var c = 0;
		for (i in this.path) {
			fill(color(25, 25 + c++, 205));
			stroke(color(25, 25 + c++, 205));
			ellipse(this.path[i].x, this.path[i].y, 5, 5);
		}

		stroke('#e0ad16');
		fill('#9b9888');
		if (this.dragging) fill('#c66a0d');
		// Dibujar bola
		ellipse(this.position.x, this.position.y, m, m);
	};
}

new Pendulum(v, l, m);