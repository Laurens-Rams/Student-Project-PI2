document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    
    const backgroundImage = new Image();
    backgroundImage.src = 'portrait.png'; 
    let bgImageLoaded = false;

    backgroundImage.onload = function() {
        bgImageLoaded = true;
        draw();
    };

    const particleLifespan = 1000; 
    const centralCircleRadius = 35;
    const centralCircle = { x: canvas.width / 2, y: canvas.height / 2, radius: centralCircleRadius };
    const blurSize = 20; 

    class Particle {
        constructor(x, y, velocity, size) {
            this.x = x;
            this.y = y;
            this.velocity = velocity;
            this.size = size;
            this.startTime = Date.now();
            this.opacity = 1;
            this.initialSize = size;
        }
    
        update() {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            
            const lifeRatio = (Date.now() - this.startTime) / particleLifespan;
            this.opacity = 1;
    
         
            this.size = this.initialSize * Math.exp(lifeRatio * 3); 
    
            return this.opacity > 0;
        }
    
        draw(context) {
            context.beginPath();
            context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            context.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            context.fill();
        }

        
    }

    function emitParticles() {
        const particlesToEmit = 70;
        for (let i = 0; i < particlesToEmit; i++) {
            let angle = Math.random() * Math.PI * 2;
            let speed = Math.random() * 2.3 + 0.2; 
            let velocity = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
            let size = Math.random() * 4 + 2; 
    
            particles.push(new Particle(centralCircle.x, centralCircle.y, velocity, size));
        }
    }

    function drawBackground() {
        if (bgImageLoaded) {
            const scale = canvas.width / backgroundImage.width;
            const scaledHeight = backgroundImage.height * scale;
            context.drawImage(backgroundImage, 0, 0, canvas.width, scaledHeight);
        }
    }


    function drawCircle() {
        context.save();
        context.beginPath();
        context.arc(centralCircle.x, centralCircle.y, centralCircle.radius + blurSize, 0, Math.PI * 2);
        context.clip();
        context.filter = 'blur(' + blurSize + 'px)';
        context.drawImage(canvas, -blurSize, -blurSize);
        context.restore();


        context.beginPath();
        context.arc(centralCircle.x, centralCircle.y, centralCircle.radius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(255, 255, 255, 0.1)';
        context.fill();

        context.font = '17px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = '#ededed';
        context.fillText('Click', centralCircle.x, centralCircle.y);
    }
    

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground(); 
        particles = particles.filter(particle => {
            particle.update();
            particle.draw(context);
            return particle.update();
        });
    
        drawCircle(); 
        requestAnimationFrame(draw);
    }

    canvas.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        centralCircle.x = event.clientX - rect.left;
        centralCircle.y = event.clientY - rect.top;
        centralCircle.x = event.clientX - rect.left + 70;
        centralCircle.y = event.clientY - rect.top + 70;
    });

    canvas.addEventListener('click', function() {
            emitParticles();
            setTimeout(function() {
                console.log("word")
                window.location.href = 'second-page.html';
            }, 1550); 
    });

    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        centralCircle.x = canvas.width / 2;
        centralCircle.y = canvas.height / 2;
    });

    requestAnimationFrame(draw);
});
