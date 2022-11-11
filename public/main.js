import { VideoCanvas } from "./VideoCanvas.js";
import { TickNo } from "./TickNo.js";
import { TickOnly } from "./TickOnly.js";

const main = async () => {
    try {
        const elements = new VideoCanvas();
        elements.init();
        const tick = new TickOnly(elements);
        elements.setTickFunc(() => tick.exec());
        await elements.start();

        document.querySelectorAll(".radiotick").forEach(radio => {
            radio.addEventListener("change", (ev) => {
                const target = ev.target;
                if(target.id === "tick-no") {
                    const tick = new TickNo(elements);
                    elements.setTickFunc(() => tick.exec());
                } else {
                    const tick = new TickOnly(elements);
                    elements.setTickFunc(() => tick.exec());
                }
            });
        });

    } catch (e) {
        console.error(e);
    }
};

window.addEventListener("load", main);