import * as Icons from "./Icons.js";

export class TickOnly {
    constructor(elements) {
        this.myicon;
        this.loadedmyicon;

        this.elements = elements;
        this.detector = new FaceDetector();
        this.pre = {wh: 0, x: 0, y: 0 };
        this.icon = Icons.laugh;
        this.setImage();
    }



    /**
     * しきい値をもとに今回の値を算出
     */
    calcNowVal(nowval, field) {
        const threshold = { wh: 30, x: 20, y: 20 };
        // 大きく場所を移動していないのであれば前回の位置のままとする
        const ret = Math.abs(nowval - this.pre[field]) >= threshold[field] ? nowval : this.pre[field];
        return ret;
    };

    // アイコンサイズの補正
    fixPosWH(box) {
        // whの大きい方を基準に拡大して、位置をその分左上にずらす
        const nowmax = Math.max(box.width, box.height);
        const max = this.calcNowVal(nowmax, "wh");
        const wh = max * this.icon.spread;
        const offset = (wh - max) / 2; // ずらすのは増加分の半分。残り半分は右下に伸ばす
        const x = this.calcNowVal(box.x - offset, "x") + (offset * this.icon.xoffset);
        const y = this.calcNowVal(box.y - offset, "y") + (offset * this.icon.yoffset);

        return {
            wh: wh,
            x: x,
            y: y,
        };
    }

    setImage() {
        // 顔に表示するアイコンと読み込み待ちフラグ
        this.myicon = new Image();
        this.myicon.src = this.icon.path;
        this.loadedmyicon = false;
        this.myicon.onload = () => {
            this.loadedmyicon = true;
        }
    }

    // // ビデオ更新のたびに実行
    // const tickMulti = async () => {
    //     try {
    //         if (loadedmyicon) {
    //             const detects = await detector.detect(myvideo);

    //             if (detects.length > 0) {
    //                 // 今回検知できたものがあれば以前のアイコンをクリア
    //                 myctxicon.clearRect(0, 0, vwidth, vheight);

    //                 // 検出した顔すべてにアイコンを表示
    //                 for (const detect of detects) {
    //                     const box = detect.boundingBox;
    //                     const pos = fixPosWH(box);
    //                     myctxicon.drawImage(myicon, pos.x, pos.y, pos.wh, pos.wh);
    //                 }
    //             }
    //             myctxvideo.drawImage(myvideo, 0, 0, vwidth, vheight);
    //         }
    //         window.requestAnimationFrame(tickMulti);
    //     } catch (e) {
    //         console.error(e);
    //     }
    // };

    // ビデオ更新のたびに実行
    async exec(){
        try {
            let pos;
            if (this.loadedmyicon) {
                const detects = await this.detector.detect(this.elements.myvideo);
                if (detects.length > 0) {
                    // 今回検知できたものがあれば以前のアイコンをクリア
                    this.elements.myctxicon.clearRect(0, 0, this.elements.vwidth, this.elements.vheight);
                    const detect = detects[0];

                    const box = detect.boundingBox;
                    pos = this.fixPosWH(box);
                } else {
                    // 今回は検出できなかったので前回の値を利用
                    pos = this.pre;
                }
                // 検出した顔にアイコンを表示
                if (pos) {
                    this.elements.myctxicon.drawImage(this.myicon, pos.x, pos.y, pos.wh, pos.wh);
                }
                this.elements.myctxvideo.drawImage(this.elements.myvideo, 0, 0, this.elements.vwidth, this.elements.vheight);
            }
        } catch (e) {
            console.error(e);
        }
    };
}



// **************************************
// private
// **************************************
