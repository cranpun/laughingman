import * as Icons from "./Icons.js";


// MYTODO マルチ対応
// MYTODO アイコンの縦横比対応

export class TickOnly {
    constructor(elements) {
        this.myicon;
        this.loadedmyicon;
        this.clearTimes = 0;

        this.elements = elements;
        this.detector = new FaceDetector();
        this.pre = { wh: 0, x: 0, y: 0 };
        this.icon = Icons.laugh;
        this.setImage();
    }

    /**
     * しきい値をもとに今回の値を算出
     */
    calcNowVal(nowval, field) {
        if(this.pre[field] === 0) {
            // 前回値がないので、この値でOK
            this.pre[field] = nowval;
            return nowval;
        }
        const threshold = {
            wh: {
                min: 30,
                max: 40,
            },
            x: {
                min: 20,
                max: 100,
            },
            y: {
                min: 20,
                max: 100,
            }
        };
        // 大きく場所を移動していないのであれば前回の位置のままとする
        const diff = Math.abs(nowval - this.pre[field]);
        if (threshold[field].min <= diff && diff <= threshold[field].max) {
            // if(field === "wh") {
            //     console.log(diff);
            // }
            this.pre[field] = nowval;
            return nowval;
        } else {
            // いきなり動いたので前回の値を利用
            return this.pre[field];
        }
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
    async exec() {
        try {
            let pos;
            if (this.loadedmyicon) {
                const detects = await this.detector.detect(this.elements.myvideo);
                this.elements.myctxicon.clearRect(0, 0, this.elements.vwidth, this.elements.vheight);
                if (detects.length > 0) {
                    // 今回検知できたものがあれば以前のアイコンをクリア
                    const detect = detects[0];

                    const box = detect.boundingBox;
                    pos = this.fixPosWH(box);
                    this.clearTimes = 0;
                } else {
                    // 今回は検出できなかったので前回の値を利用
                    pos = this.pre;
                    this.clearTimes++;
                }
                // 検出した顔にアイコンを表示
                if (pos && this.clearTimes < 3) {
                    this.elements.myctxicon.drawImage(this.myicon, pos.x, pos.y, pos.wh, pos.wh);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };
}



// **************************************
// private
// **************************************
