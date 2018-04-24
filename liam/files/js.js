var even = false;

window.addEventListener("load", (a) => {
    // const bg = document.getElementById("background-player");
    // bg.style["height"] = "100%";
    // bg.style["width"] = "100%";
    // var s = (screen.width / 1717)*1920;
    // bg.style = `width: ${Math.max(s, screen.height * (1920/1080))}px; height: ${Math.max(screen.height, s * (1080/1920))}px; margin-left:-100px`;
    const boom = () => {
        confetti(document.getElementById("confetti"));
        window.setTimeout(boom, 2000);
        even = !even;
    };
    boom();
});

const defaultColors = [
    // '#ffffff'
    '#a864fd',
    '#29cdff',
    '#78ff44',
    '#ff718d',
    '#fdff6a'
  ];

function createElements(root, elementCount, colors) {
    return Array
        .from({ length: elementCount })
        .map((_, index) => {
            const element = document.createElement('div');
            const color = colors[index % colors.length];
            element.style['background-color']= color; // eslint-disable-line space-infix-ops
            element.style.width = '10px';
            element.style.height = '10px';
            element.style.position = 'absolute';
            element.style.zIndex = 100;
            root.appendChild(element);
            return element;
        });
}

function randomPhysics(angle, spread, startVelocity, random) {
    const radAngle = angle * (Math.PI / 180);
    const radSpread = spread * (Math.PI / 180);
    return {
        x: even ? 0 : 1920,
        y: 850,
        wobble: random() * 10,
        velocity: (startVelocity * 0.5) + (random() * startVelocity),
        angle2D: -radAngle + ((0.5 * radSpread) - (random() * radSpread)),
        angle3D: -(Math.PI / 4) + (random() * (Math.PI / 2)),
        tiltAngle: random() * Math.PI
    };
}

function updateFetti(fetti, progress, decay) {
    /* eslint-disable no-param-reassign */
    fetti.physics.x += Math.cos(fetti.physics.angle2D) * fetti.physics.velocity;
    fetti.physics.y += Math.sin(fetti.physics.angle2D) * fetti.physics.velocity;
    fetti.physics.z += Math.sin(fetti.physics.angle3D) * fetti.physics.velocity;
    fetti.physics.wobble += 0.1;
    fetti.physics.velocity *= decay;
    fetti.physics.y += 3;
    fetti.physics.tiltAngle += 0.1;

    const { x, y, tiltAngle, wobble } = fetti.physics;
    const wobbleX = x + (10 * Math.cos(wobble));
    const wobbleY = y + (10 * Math.sin(wobble));
    const transform = `translate3d(${wobbleX}px, ${wobbleY}px, 0) rotate3d(1, 1, 1, ${tiltAngle}rad)`;

    fetti.element.style.transform = transform;
    // fetti.element.style.opacity = 1 - progress;

    /* eslint-enable */
}

function animate(root, fettis, decay) {
    const totalTicks = 400;
    let tick = 0;

    function update() {
        fettis.forEach((fetti) => updateFetti(fetti, tick / totalTicks, decay));

        tick += 1;
        if (tick < totalTicks) {
        requestAnimationFrame(update);
        } else {
        fettis.forEach((fetti) => {
            if (fetti.element.parentNode === root) {
            return root.removeChild(fetti.element);
            }
        });
        }
    }

    requestAnimationFrame(update);
}

function confetti(root, {
    angle = even ? 45 : 135,
    decay = 0.90,
    spread = 60,
    startVelocity = 80,
    elementCount = 50,
    colors = defaultColors,
    random = Math.random,
} = {}) {
    const elements = createElements(root, elementCount, colors);
    const fettis = elements.map((element) => ({
        element,
        physics: randomPhysics(angle, spread, startVelocity, random)
    }));

    animate(root, fettis, decay);
}