import { VideoCanvas } from "./VideoCanvas.js";
import { TickNo } from "./TickNo.js";
import { TickOnly } from "./TickOnly.js";
import { TickMulti } from "./TickMulti.js";

const main = async () => {
    try {
        const elements = new VideoCanvas();
        elements.init();
        const tick = new TickNo(elements);
        elements.setTickFunc(() => tick.exec());
        await elements.start();

        document.querySelectorAll(".radiotick").forEach(radio => {
            radio.addEventListener("change", (ev) => {
                const target = ev.target;
                if (target.id === "tick-only") {
                    const tick = new TickOnly(elements);
                    elements.setTickFunc(() => tick.exec());
                } else if (target.id === "tick-multi") {
                    const tick = new TickMulti(elements);
                    elements.setTickFunc(() => tick.exec());
                } else {
                    const tick = new TickNo(elements);
                    elements.setTickFunc(() => tick.exec());
                }
            });
        });


        // イベントを強制的に発行させて初期設定に置き換え
        setTimeout(() => {
            document.querySelector("#tick-multi").click();
        }, 1)

    } catch (e) {
        console.error(e);
    }
};

window.addEventListener("load", main);