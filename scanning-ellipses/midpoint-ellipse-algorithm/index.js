let ROWS_COUNT = 49;
let COLS_COUNT = 49;
let showGrid = true;
let algo = true; // false = base, true = improved

let x0 = Math.floor(COLS_COUNT / 2);
let y0 = Math.floor(ROWS_COUNT / 2);
let [x1, y1] = [20, 20];

(() => {
    /** @type {HTMLInputElement | null} */
    const gridElem = document.getElementById("grids");
    /** @type {HTMLInputElement | null} */
    const sizeElem = document.getElementById("size");

    if (gridElem === null || sizeElem === null) {
        throw new Error("Couldn't find configuration elements");
    }
    gridElem.addEventListener("change", (event) => (showGrid = event.target.checked));
    gridElem.checked = showGrid;
    sizeElem.addEventListener("change", (event) => (ROWS_COUNT = COLS_COUNT = event.target.value));
    sizeElem.value = ROWS_COUNT;


    /** @type {HTMLCanvasElement | null} */
    const canvasElem = document.getElementById("canvas");
    if (canvasElem === null) throw new Error("Couldn't find the canvas element!");
    canvasElem.width = 800;
    canvasElem.height = 800;
    const canvasContext = canvasElem.getContext("2d");
    if (canvasContext === null) throw new Error("Couldn't get the canvas context!");
    render(canvasContext, canvasElem.width, canvasElem.height);

    canvasElem.addEventListener("mousemove", (event) => {
        x1 = Math.floor(event.offsetX / canvasElem.width * COLS_COUNT);
        y1 = Math.floor(event.offsetY / canvasElem.height * ROWS_COUNT);

        render(canvasContext, canvasElem.width, canvasElem.height);
    });
    canvasElem.addEventListener("mousedown", (event) => {
        x0 = Math.floor(event.offsetX / canvasElem.width * COLS_COUNT);
        y0 = Math.floor(event.offsetY / canvasElem.height * ROWS_COUNT);

        render(canvasContext, canvasElem.width, canvasElem.height);
    });
})();

function render(
    /** @type {CanvasRenderingContext2D} */ ctx,
    /** @type {number} */ width,
    /** @type {number} */ height
) {
    ctx.reset();
    ctx.fillStyle = "#ddd";
    ctx.fillRect(0, 0, width, height);

    /* Scale canvas to only work with one coordinate system */
    ctx.scale(width / COLS_COUNT, height / ROWS_COUNT);

    if (showGrid) {
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 0.03;
        ctx.beginPath();
        for (let x = 0; x <= COLS_COUNT; ++x) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, ROWS_COUNT);
        }
        for (let y = 0; y <= ROWS_COUNT; ++y) {
            ctx.moveTo(0, y);
            ctx.lineTo(COLS_COUNT, y);
        }
        ctx.stroke();
    }

    /* Draw line */
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    if (algo) MidpointEllipseAlgorithm(ctx);
    else MidpointEllipseAlgorithm(ctx);
    ctx.fillStyle = "blue";
    ctx.fillRect(x0, y0, 1, 1);
    ctx.fillStyle = "red";
    ctx.fillRect(x1, y1, 1, 1);
}



function MidpointEllipseAlgorithm(
    /** @type {CanvasRenderingContext2D} */ ctx
) {
    const a = x1 > x0 ? x1 - x0 : x0 - x1;
    const b = y1 > y0 ? y1 - y0 : y0 - y1;
    let x = 0;
    let y = b;
    EllipsePoints(x, y);

    let d1 = b * b - a * a * b + a * a * 0.25;
    while (a * a * (y - 0.5) > b * b * (x + 1)) {
        if (d1 < 0) {
            d1 += b * b * (x + x + 3);
            x++;
        } else {
            d1 += b * b * (x + x + 3) + a * a * (2 - y - y);
            x++;
            y--;
        }
        EllipsePoints(x, y);
    }

    let d2 = b * b * (x + 0.5) * (x + 0.5) + a * a * (y - 1) * (y - 1) - a * a * b * b;
    while (y > 0) {
        if (d2 < 0) {
            d2 += b * b * (2 * x + 2) + a * a * (3 - 2 * y);
            x++;
            y--;
        } else {
            d2 += a * a * (3 - 2 * y);
            y--;
        }
        EllipsePoints(x, y);
    }

    function EllipsePoints(x, y) {
        if (x === 0) {
            ctx.fillRect(x0, y0 + y, 1, 1);
            ctx.fillRect(x0, y0 - y, 1, 1);
            return;
        }
        if (y === 0) {
            ctx.fillRect(x0 + x, y0, 1, 1);
            ctx.fillRect(x0 - x, y0, 1, 1);
            return;
        }
        ctx.fillRect(x0 + x, y0 + y, 1, 1);
        ctx.fillRect(x0 - x, y0 + y, 1, 1);
        ctx.fillRect(x0 + x, y0 - y, 1, 1);
        ctx.fillRect(x0 - x, y0 - y, 1, 1);
        return;
    }
}
