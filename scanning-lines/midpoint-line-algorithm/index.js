let ROWS_COUNT = 49;
let COLS_COUNT = 49;
let showGrid = true;
let algo = true; // false = base, true = improved

//let [x1, y1] = [50, 50];
let x0 = Math.floor(COLS_COUNT / 2);
let y0 = Math.floor(ROWS_COUNT / 2);
//let [x0, y0] = [5, 8];
let [x1, y1] = [10, 7];

(() => {
    /** @type {HTMLInputElement | null} */
    const gridElem = document.getElementById("grids");
    /** @type {HTMLInputElement | null} */
    const sizeElem = document.getElementById("size");
    /** @type {HTMLInputElement | null} */
    const baseAlgoElem = document.getElementById("base-algo");
    /** @type {HTMLInputElement | null} */
    const improvedAlgoElem = document.getElementById("improved-algo");

    if (gridElem === null || sizeElem === null || improvedAlgoElem === null || baseAlgoElem === null) {
        throw new Error("Couldn't find configuration elements");
    }
    gridElem.addEventListener("change", (event) => (showGrid = event.target.checked));
    gridElem.checked = showGrid;
    sizeElem.addEventListener("change", (event) => (ROWS_COUNT = COLS_COUNT = event.target.value));
    sizeElem.value = ROWS_COUNT;
    baseAlgoElem.addEventListener("change", () => (algo = false));
    improvedAlgoElem.addEventListener("change", () => (algo = true));
    improvedAlgoElem.checked = true;


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
    if (algo) MidpointLineAlgorithm(ctx, x0, y0, x1, y1);
    else drawLine(ctx, x0, y0, x1, y1);
    ctx.fillStyle = "blue";
    ctx.fillRect(x0, y0, 1, 1);
    ctx.fillStyle = "red";
    ctx.fillRect(x1, y1, 1, 1);
}

function drawLine(
    /** @type {CanvasRenderingContext2D} */ ctx,
    /** @type {number} */ x0, /** @type {number} */ y0,
    /** @type {number} */ x1, /** @type {number} */ y1
) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const incrE = dy + dy;
    const incrNE = dy + dy - dx - dx;
    let d = dy + dy - dx;
    let y = y0;
    for (let x = x0; x <= x1; ++x) {
        ctx.fillRect(x, y, 1, 1);
        if (d <= 0) { d += incrE; }
        else { d += incrNE; y++; }
    }
}

function MidpointLineAlgorithm(
    /** @type {CanvasRenderingContext2D} */ ctx,
    /** @type {number} */ x0, /** @type {number} */ y0,
    /** @type {number} */ x1, /** @type {number} */ y1
) {
    if (x1 >= x0 && y1 >= y0) {
        const dx = x1 - x0;
        const dy = y1 - y0;
        if (dy <= dx) {
            const incrE = dy + dy;
            const incrNE = dy + dy - dx - dx;
            let d = dy + dy - dx;
            let y = y0;
            for (let x = x0; x <= x1; ++x) {
                ctx.fillRect(x, y, 1, 1);
                if (d <= 0) { d += incrE; }
                else { d += incrNE; y++; }
            }
        } else {
            const incrE = dx + dx;
            const incrNE = dx + dx - dy - dy;
            let d = dx + dx - dy;
            let x = x0;
            for (let y = y0; y <= y1; ++y) {
                ctx.fillRect(x, y, 1, 1);
                if (d <= 0) { d += incrE; }
                else { d += incrNE; x++; }
            }
        }
    } else if (x1 >= x0 && y1 < y0) {
        const dx = x1 - x0;
        const dy = y0 - y1;
        if (dy <= dx) {
            const incrE = dy + dy;
            const incrNE = dy + dy - dx - dx;
            let d = dy + dy - dx;
            let y = y0;
            for (let x = x0; x <= x1; ++x) {
                ctx.fillRect(x, y, 1, 1);
                if (d <= 0) { d += incrE; }
                else { d += incrNE; y--; }
            }
        } else {
            const incrE = dx + dx;
            const incrNE = dx + dx - dy - dy;
            let d = dx + dx - dy;
            let x = x1;
            for (let y = y1; y <= y0; ++y) {
                ctx.fillRect(x, y, 1, 1);
                if (d <= 0) { d += incrE; }
                else { d += incrNE; x--; }
            }
        }
    } else if (x1 < x0 && y1 >= y0) {
        const dx = x0 - x1;
        const dy = y1 - y0;
        if (dy <= dx) {
            const incrE = dy + dy;
            const incrNE = dy + dy - dx - dx;
            let d = dy + dy - dx;
            let y = y1;
            for (let x = x1; x <= x0; ++x) {
                ctx.fillRect(x, y, 1, 1);
                if (d < 0) { d += incrE; }
                else { d += incrNE; y--; }
            }
        } else {
            const incrE = dx + dx;
            const incrNE = dx + dx - dy - dy;
            let d = dx + dx - dy;
            let x = x0;
            for (let y = y0; y < y1; ++y) {
                ctx.fillRect(x, y, 1, 1);
                if (d < 0) { d += incrE; }
                else { d += incrNE; x--; }
            }
        }
    } else if (x1 < x0 && y1 < y0) {
        const dx = x0 - x1;
        const dy = y0 - y1;
        if (dy <= dx) {
            const incrN = dy + dy;
            const incrNE = dy + dy - dx - dx;
            let d = dy + dy - dx;
            let y = y1;
            for (let x = x1; x <= x0; ++x) {
                ctx.fillRect(x, y, 1, 1);
                // the removal of <= is not trivial
                // its importance is visible when introducing
                // lines with patterns (dashed, dotted lines etc.)
                // if not removed, the direction of line will be missing!
                if (d < 0) { d += incrN; }
                else { d += incrNE; y++; }
            }
        } else {
            const incrE = dx + dx;
            const incrNE = dx + dx - dy - dy;
            let d = dx + dx - dy;
            let x = x1;
            for (let y = y1; y <= y0; ++y) {
                ctx.fillRect(x, y, 1, 1);
                if (d < 0) { d += incrE; }
                else { d += incrNE; x++; }
            }
        }
    }
}
