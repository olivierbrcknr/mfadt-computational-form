// require https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.15/paper-full.min.js
// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js

// parameteres
const PARAMS = {
  bgColor: "#252525",
  strokeColor: "#ED5D28",
  fanScale: 4,
  spacing: 100,
  rotationSpeed: 7,
  strokeWidth: 1,
};

const setupTweakPane = () => {
  const pane = new Tweakpane.Pane();

  pane.addInput(PARAMS, "rotationSpeed", {
    min: 1,
    max: 90,
  });
  pane.addInput(PARAMS, "bgColor");

  const f1 = pane.addFolder({
    title: "Fan Parameters",
  });
  f1.addInput(PARAMS, "fanScale", {
    min: 0.1,
    max: 8,
  });
  f1.addInput(PARAMS, "strokeWidth", {
    min: 0.1,
    max: 8,
  });
  f1.addInput(PARAMS, "strokeColor");

  pane.on("change", () => {
    BG.fillColor = PARAMS.bgColor;
    allFans.forEach((f) => {
      const currentScale = f.blades.scaling.x;
      const newScale = PARAMS.fanScale / currentScale;
      f.blades.scale(newScale);

      f.blades.children.forEach((b, k) => {
        b.strokeColor = PARAMS.strokeColor;
        b.strokeWidth = PARAMS.strokeWidth;

        // bounding
        if (k === 0) {
          b.strokeWidth = 0;
          b.fillColor = PARAMS.bgColor;
        }
      });
    });
  });
};

let BG = null;
const allFans = [];

let ID = 0;

class Fan {
  constructor(x, y) {
    this.ID = ID;

    this.isRotating = false;

    this.blades = new paper.Group();
    this.blades.applyMatrix = false;

    const CENTER_POINT = new paper.Point(0, 0);

    const bounding = new paper.Path.Circle(
      new paper.Point(0, 0),
      new paper.Point(6, 6)
    );
    bounding.strokeWidth = 0;
    bounding.fillColor = PARAMS.bgColor;

    const blade_1 = new paper.Path();
    blade_1.strokeColor = PARAMS.strokeColor;
    blade_1.closed = true;

    blade_1.add(new paper.Point(0, 0));
    blade_1.add(new paper.Point(0, 6));
    blade_1.add(new paper.Point(2, 4));
    blade_1.add(new paper.Point(2, 2));
    blade_1.strokeScaling = false;

    const blade_2 = blade_1.clone();
    blade_2.rotate(90, CENTER_POINT);

    const blade_3 = blade_1.clone();
    blade_3.rotate(180, CENTER_POINT);

    const blade_4 = blade_1.clone();
    blade_4.rotate(270, CENTER_POINT);

    this.blades.addChildren([bounding, blade_1, blade_2, blade_3, blade_4]);
    this.blades.translate(
      new paper.Point(
        PARAMS.spacing / 2 +
          x * PARAMS.spacing +
          (y % 2 === 0 ? PARAMS.spacing / 2 : 0),
        PARAMS.spacing / 2 + y * PARAMS.spacing
      )
    );
    this.blades.scale(4);

    this.blades.onMouseEnter = () => {
      this.isRotating = true;
    };

    ID++;
  }
  spin() {
    this.blades.rotate(PARAMS.rotationSpeed);

    if (this.blades.rotation <= 0) {
      this.isRotating = false;
      this.blades.rotation = 0;
    }
  }
}

window.onload = () => {
  const canvas = document.getElementById("myCanvas");

  paper.setup(canvas);

  BG = new paper.Path.Rectangle(paper.view.bounds);
  BG.fillColor = PARAMS.bgColor;

  for (let x = 0; x < paper.view.bounds.width / PARAMS.spacing; x++) {
    for (let y = 0; y < paper.view.bounds.height / PARAMS.spacing; y++) {
      allFans.push(new Fan(x, y));
    }
  }

  setupTweakPane();

  let frameCount = 0;
  paper.view.onFrame = () => {
    allFans.forEach((f) => {
      if (f.isRotating) {
        f.spin();
      }
    });

    frameCount++;
  };

  paper.view.draw();
};
