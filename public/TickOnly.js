import * as Icons from "./Icons.js";


// MYTODO マルチ対応

class Basesize {
    constructor(base, size) {
        this.base = base;
        this.size = size;
    }
}
class Sizepos {
    constructor() {
        this.basesize = new Basesize(0, "");
        this.zoom = 0;
        this.width = 0;
        this.height = 0;
        this.x = 0;
        this.y = 0;
    }
}

export class TickOnly {
    constructor(elements) {
        this.myicon; // アイコンの画像データ
        this.loadedmyicon; // アイコンのロードフラグ
        this.lostCount = 0; // ロストした回数。これが規定回数以内であれば前回の表示を継続

        this.elements = elements;
        this.detector = new FaceDetector();
        this.sizepos = new Sizepos();
        this.iconparam = Icons.icons.laugh; // 読み込む画像のパラメータ
        this.setImage();
    }

    /**
     * しきい値をもとに今回の値を算出
     */
    shouldBeUpdate(nowval, field) {
        if (this.sizepos[field] === 0) {
            // 前回値がないので、この値でOK
            return true;
        }
        // 変化させる範囲。これより大きい変動だと、誤検知の可能性があるので調整しない
        const diffThreshold = {
            width: {
                min: 30,
                max: 40,
            },
            height: {
                min: 30,
                max: 40,
            },
            x: {
                min: 40,
                max: 100000,
            },
            y: {
                min: 40,
                max: 100000,
            }
        };
        // 大きく場所を移動していないのであれば前回の位置のままとする
        const diff = Math.abs(nowval - this.sizepos[field]);
        if (diffThreshold[field].min <= diff && diff <= diffThreshold[field].max) {
            // if(field === "wh") {
            //     console.log(diff);
            // }
            return true;
        } else {
            // いきなり動いたので前回の値を利用
            return false;
        }
    };

    getBaseSize(width, height) {
        if (width > height) {
            return {
                size: width,
                base: "width"
            }
        } else {
            return {
                size: height,
                base: "height"
            }
        }
    }

    // アイコンサイズの補正
    updateSizepos(box) {
        // whの大きい方を基準に拡大・縮小
        const basesize = this.getBaseSize(box.width, box.height);
        if (this.shouldBeUpdate(basesize.size, basesize.base)) {
            this.sizepos.basesize = basesize;
            this.sizepos.zoom = box[basesize.base] / this.iconparam[basesize.base] * this.iconparam.zoom;
            this.sizepos.width = this.iconparam.width * this.sizepos.zoom * 2.5;
            this.sizepos.height = this.iconparam.height * this.sizepos.zoom * 2.5;
        }

        //　位置：検知した位置は中心なので、そこから今回のzoomに従ってずらす。
        const x = box.x - (this.sizepos.width / 2) + (this.sizepos.zoom * this.iconparam.xoffset);
        this.sizepos.x = this.shouldBeUpdate(x, "x") ? x : this.sizepos.x;
        const y = box.y - (this.sizepos.height / 2) + (this.sizepos.zoom * this.iconparam.yoffset);
        this.sizepos.y = this.shouldBeUpdate(y, "y") ? y : this.sizepos.y;
    }

    setImage() {
        // 顔に表示するアイコンと読み込み待ちフラグ
        this.myicon = new Image();
        this.myicon.src = this.iconparam.path;
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
                    this.updateSizepos(box);
                    this.lostCount = 0;
                } else {
                    // 今回は検出できなかったので前回の値を利用
                    this.lostCount++;
                }
                // 検出した顔にアイコンを表示
                if (this.lostCount < 30) {
                    this.elements.myctxicon.drawImage(this.myicon, this.sizepos.x, this.sizepos.y, this.sizepos.width, this.sizepos.height);
                } else {
                    // 未検出が一定数を超えたのでsizeposを初期化
                    this.sizepos = new Sizepos();
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
