let ROWS_COUNT = 49;
let COLS_COUNT = 49;
let showGrid = true;
let algo = false; // false = base, true = improved
let unitStepsGranularity = 1;

let x0 = Math.floor(COLS_COUNT / 2);
let y0 = Math.floor(ROWS_COUNT / 2);
let [x1, y1] = [20, 20];
let R = Math.floor(Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1)));
let unitAnglesGranularity = Math.atan(1 / (R));

(() => {

    /** @type {HTMLCanvasElement | null} */
    const canvasElem = document.getElementById("canvas");
    if (canvasElem === null) throw new Error("Couldn't find the canvas element!");
    canvasElem.width = 800;
    canvasElem.height = 800;
    const canvasContext = canvasElem.getContext("2d");
    if (canvasContext === null) throw new Error("Couldn't get the canvas context!");
    /** @type {HTMLInputElement | null} */
    const gridElem = document.getElementById("grids");
    /** @type {HTMLInputElement | null} */
    const sizeElem = document.getElementById("size");
    /** @type {HTMLInputElement | null} */
    const baseAlgoElem = document.getElementById("base-algo");
    /** @type {HTMLInputElement | null} */
    const improvedAlgoElem = document.getElementById("improved-algo");
    /** @type {HTMLInputElement | null} */
    const granularityBaseElem = document.getElementById("granularity-base");
    /** @type {HTMLSpanElement | null} */
    const granularityImprovedElem = document.getElementById("granularity-improved");
    if (gridElem === null || sizeElem === null ||
        improvedAlgoElem === null || baseAlgoElem === null ||
        granularityBaseElem === null || granularityImprovedElem === null) {
        throw new Error("Couldn't find configuration elements");
    }

    render(canvasContext, canvasElem.width, canvasElem.height);

    canvasElem.addEventListener("mousemove", (event) => {
        x1 = Math.floor(event.offsetX / canvasElem.width * COLS_COUNT);
        y1 = Math.floor(event.offsetY / canvasElem.height * ROWS_COUNT);
        R = Math.floor(Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1)));

        render(canvasContext, canvasElem.width, canvasElem.height);
        granularityImprovedElem.innerText = (unitAnglesGranularity * 180 / Math.PI).toFixed(2);
    });
    canvasElem.addEventListener("mousedown", (event) => {
        x0 = Math.floor(event.offsetX / canvasElem.width * COLS_COUNT);
        y0 = Math.floor(event.offsetY / canvasElem.height * ROWS_COUNT);
        R = Math.floor(Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1)));

        render(canvasContext, canvasElem.width, canvasElem.height);
        granularityImprovedElem.innerText = (unitAnglesGranularity * 180 / Math.PI).toFixed(2);
    });


    gridElem.addEventListener("change", (event) => {
        showGrid = event.target.checked;
        render(canvasContext, canvasElem.width, canvasElem.height);
    });
    gridElem.checked = showGrid;
    sizeElem.addEventListener("change", (event) => {
        ROWS_COUNT = COLS_COUNT = event.target.value;
        render(canvasContext, canvasElem.width, canvasElem.height);
    });
    sizeElem.value = ROWS_COUNT;
    baseAlgoElem.addEventListener("change", () => {
        algo = false;
        render(canvasContext, canvasElem.width, canvasElem.height);
    });
    improvedAlgoElem.addEventListener("change", () => {
        algo = true;
        render(canvasContext, canvasElem.width, canvasElem.height);
    });
    baseAlgoElem.checked = true;
    granularityBaseElem.addEventListener("change", (event) => {
        unitStepsGranularity = parseFloat(event.target.value);
        render(canvasContext, canvasElem.width, canvasElem.height);
    });
    granularityBaseElem.value = unitStepsGranularity;
    granularityImprovedElem.innerText = (unitAnglesGranularity / 180 * Math.PI).toFixed(2);


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

    /* Draw circle */
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.strokeStyle = "transparent";
    ctx.lineWidth = 0.1;
    if (algo) drawCircleUnitAngles(ctx);
    else drawCircleUnitSteps(ctx);
    ctx.fillStyle = "blue";
    ctx.fillRect(x0, y0, 1, 1);
    ctx.fillStyle = "red";
    ctx.fillRect(x1, y1, 1, 1);
}

function drawCircleUnitSteps(/** @type {CanvasRenderingContext2D} */ ctx) {
    for (let r = 0; r <= R; r += unitStepsGranularity) {
        CirclePoints(ctx, Math.round(r), Math.round(Math.sqrt(R * R - r * r)));
    }

    function CirclePoints(ctx, x, y) {
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

function drawCircleUnitAngles(/** @type {CanvasRenderingContext2D} */ ctx) {
    unitAnglesGranularity = Math.atan(1 / (R + 1));
    let px = -1;
    let py = -1;
    for (let a = 0; a <= Math.PI / 4; a += unitAnglesGranularity) {
        const x = Math.round(Math.cos(a) * R);
        const y = Math.round(Math.sin(a) * R);
        if ((!(px === y && py === x)) && (!(px === x && py === y))) {
            CirclePoints(ctx, x, y);
        }
        px = x;
        py = y;
    }

    function CirclePoints(ctx, x, y) {
        if (y === 0) {
            ctx.fillRect(x0 + x, y0 + y, 1, 1);
            ctx.fillRect(x0 - x, y0 + y, 1, 1);
            ctx.fillRect(x0 + y, y0 + x, 1, 1);
            ctx.fillRect(x0 - y, y0 - x, 1, 1);
            return
        }
        if (x === 0) {
            ctx.fillRect(x0 + x, y0 + y, 1, 1);
            ctx.fillRect(x0 + x, y0 - y, 1, 1);
            ctx.fillRect(x0 + y, y0 + x, 1, 1);
            ctx.fillRect(x0 - y, y0 + x, 1, 1);
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