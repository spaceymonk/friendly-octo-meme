let ROWS_COUNT = 49;
let COLS_COUNT = 49;
let showGrid = true;
let algo = true; // false = base, true = improved

let x0 = Math.floor(COLS_COUNT / 2);
let y0 = Math.floor(ROWS_COUNT / 2);
let [x1, y1] = [20, 20];
let R = Math.floor(Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1)));

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
        R = Math.floor(Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1)));

        render(canvasContext, canvasElem.width, canvasElem.height);
    });
    canvasElem.addEventListener("mousedown", (event) => {
        x0 = Math.floor(event.offsetX / canvasElem.width * COLS_COUNT);
        y0 = Math.floor(event.offsetY / canvasElem.height * ROWS_COUNT);
        R = Math.floor(Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1)));

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
    if (algo) MidpointCircleAlgorithm(ctx);
    else MidpointCircleAlgorithm(ctx);
    ctx.fillStyle = "blue";
    ctx.fillRect(x0, y0, 1, 1);
    ctx.fillStyle = "red";
    ctx.fillRect(x1, y1, 1, 1);
}



function MidpointCircleAlgorithm(
    /** @type {CanvasRenderingContext2D} */ ctx
) {
    let x = 0;
    let y = R;
    let d = 1 - R;  // before (h= d - 1/4) substitution: d = 5/4 - radius
    let deltaE = 3;
    let deltaSE = -R - R + 5;  // -2R + 5

    CirclePoints(ctx, x, y);
    let px = x;  // added to remove double painting the pixels
    let py = y;  // added to remove double painting the pixels

    while (y > x) {  // not y>=x mind you, otherwise printing twice the starting point
        if (d < 0) {
            // this is the direct calculation of increments
            //d += x + x + 3;
            d += deltaE;
            deltaE += 2;
            deltaSE += 2;
            x++;
        } else {
            //d += x + x - y - y + 5;
            d += deltaSE;
            deltaE += 2;
            deltaSE += 4;
            x++;
            y--;
        }

        if (!(px === y && py === x))
            CirclePoints(ctx, x, y);
        px = x;
        py = y;

    }

    function CirclePoints(ctx, x, y) {
        if (x === 0) {
            ctx.fillRect(x0, y0 + y, 1, 1);
            ctx.fillRect(x0, y0 - y, 1, 1);
            ctx.fillRect(x0 + y, y0, 1, 1);
            ctx.fillRect(x0 - y, y0, 1, 1);
            return;
        }
        if (x === y) {
            ctx.fillRect(x0 + x, y0 + y, 1, 1);
            ctx.fillRect(x0 - x, y0 + y, 1, 1);
            ctx.fillRect(x0 + x, y0 - y, 1, 1);
            ctx.fillRect(x0 - x, y0 - y, 1, 1);
            return;
        }
        ctx.fillRect(x0 + x, y0 + y, 1, 1);
        ctx.fillRect(x0 - x, y0 + y, 1, 1);
        ctx.fillRect(x0 + x, y0 - y, 1, 1);
        ctx.fillRect(x0 - x, y0 - y, 1, 1);
        ctx.fillRect(x0 + y, y0 + x, 1, 1);
        ctx.fillRect(x0 - y, y0 + x, 1, 1);
        ctx.fillRect(x0 + y, y0 - x, 1, 1);
        ctx.fillRect(x0 - y, y0 - x, 1, 1);
    }
}
