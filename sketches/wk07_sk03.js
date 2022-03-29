// require https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.15/paper-full.min.js
// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js

const PARAMS = {
  bgColor: "#252525",
  strokeColor: "#FFF",
  rotationSpeed: 30,
  isRotating: true,
};

const setupTweakPane = () => {
  const pane = new Tweakpane.Pane();

  pane.addInput(PARAMS, "rotationSpeed", {
    min: 1,
    max: 90,
  });
  pane.addInput(PARAMS, "isRotating");
  pane.addInput(PARAMS, "bgColor");
  pane.addInput(PARAMS, "strokeColor");

  pane.on("change", () => {
    BG.fillColor = PARAMS.bgColor;

    Cartridge.children.forEach((c) => {
      c.strokeColor = PARAMS.strokeColor;
    });
    CartridgeBack.children.forEach((c) => {
      c.strokeColor = PARAMS.strokeColor;
    });
  });
};

let BG = null;
let Cartridge = null;
let CartridgeBack = null;

const setupCartridge = (isFront = false) => {
  let c = new paper.Group();

  const base = new paper.Path();
  base.add(new paper.Point(0, 0));
  base.add(new paper.Point(240 - 20, 0));
  base.add(new paper.Point(240 - 20, 10));
  base.add(new paper.Point(240, 10));
  base.add(new paper.Point(240, 274));
  base.add(new paper.Point(0, 274));
  base.closePath();

  if (isFront) {
    const label = new paper.Path.Rectangle(
      new paper.Point(26, 74),
      new paper.Size(186, 166),
      5
    );

    const circle1 = new paper.Path.Circle(new paper.Point(50, 40), 25);
    const circle2 = new paper.Path.Circle(
      new paper.Point(base.bounds.width - 50, 40),
      25
    );
    const longHoleInner = new paper.Path.Rectangle(
      new paper.Point(50, 15),
      new paper.Point(base.bounds.width - 50, 65)
    );

    let longHole = circle1.unite(circle2);
    longHole = longHole.unite(longHoleInner);

    const LINES_HEIGHT = 4;
    const LINES_DISTANCE = 9;
    const LINES_OFFSET_TOP = 20;

    const cutC_1 = circle1.clone().scale(1.2);
    for (let i = 0; i < 5; i++) {
      const posY = LINES_OFFSET_TOP + i * LINES_DISTANCE;
      const r = new paper.Path.Rectangle(
        new paper.Point(0, posY),
        new paper.Point(50, posY + LINES_HEIGHT)
      );
      const realR = r.subtract(cutC_1);
      c.addChild(realR);
    }

    const cutC_2 = circle2.clone().scale(1.2);
    for (let i = 0; i < 5; i++) {
      const posY = LINES_OFFSET_TOP + i * LINES_DISTANCE;
      const r = new paper.Path.Rectangle(
        new paper.Point(base.bounds.width, posY),
        new paper.Point(base.bounds.width - 50, posY + LINES_HEIGHT)
      );
      const realR = r.subtract(cutC_2);
      c.addChild(realR);
    }

    const arrow = new paper.Path.RegularPolygon(
      new paper.Point(base.bounds.width / 2, base.bounds.height - 13),
      3,
      20
    );
    arrow.rotate(180);
    arrow.scale(1, 0.7);

    c.addChildren([label, longHole, arrow]);
  }

  c.addChildren([base]);

  c.children.forEach((c) => {
    c.applyMatrix = false;
    c.strokeScaling = false;
    c.strokeColor = PARAMS.strokeColor;
  });

  return c;
};

window.onload = () => {
  const canvas = document.getElementById("myCanvas");

  paper.setup(canvas);

  const bounds = new paper.Rectangle(
    new paper.Point(0, 0),
    new paper.Point(400, 400)
  );

  BG = new paper.Path.Rectangle(bounds);
  BG.fillColor = PARAMS.bgColor;

  Cartridge = setupCartridge(true);
  Cartridge.translate(
    new paper.Point(
      bounds.width / 2 - Cartridge.bounds.width / 2,
      bounds.height / 2 - Cartridge.bounds.height / 2
    )
  );

  CartridgeBack = setupCartridge();
  CartridgeBack.translate(
    new paper.Point(
      bounds.width / 2 - Cartridge.bounds.width / 2,
      bounds.height / 2 - Cartridge.bounds.height / 2
    )
  );

  setupTweakPane();

  const startWidth = Cartridge.bounds.width;

  let frameCount = 0;
  let rotateCount = 0;

  paper.view.onFrame = () => {
    frameCount++;

    if (PARAMS.isRotating) {
      rotateCount++;
      currRatio = Math.sin(rotateCount / PARAMS.rotationSpeed);

      const currentWidth = Cartridge.bounds.width;
      const scaleRatio = Math.abs(currRatio * startWidth) / currentWidth;

      Cartridge.scale(scaleRatio, 1);
      Cartridge.translate(currRatio / 4, 0);

      CartridgeBack.scale(scaleRatio, 1);
      CartridgeBack.translate((currRatio * -1) / 4, 0);
    }
  };

  paper.view.draw();
};
