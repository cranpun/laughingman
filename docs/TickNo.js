import { VideoCanvas } from "./VideoCanvas.js";

export class TickNo {
    constructor(elements) {
        this.elements = elements;
        this.isNotClear = true;
    }

    async exec() {
        try {
            if (this.isNotClear) {
                // iconのcanvasはクリア
                this.elements.myctxicon.clearRect(0, 0, this.elements.vwidth, this.elements.vheight);
                this.isNotClear = false;
            }
        } catch (e) {
            console.error(e);
        }
    }
}



// **************************************
// private
// **************************************
