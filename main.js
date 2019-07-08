const main = async () => {
    try {
        // 読み取った画像とそのサイズ
        const myvideo = document.querySelector("#myvideo");
        let vwidth = 0;
        let vheight = 0;
        // 前回の値。
        let pre = { wh: 0, x: 0, y: 0 };
        const threshold = { wh: 30, x: 20, y: 20 };
        const spread = 2.4;

        // 表示するキャンバス。videoとアイコンのレイヤ。読み込み順によって重ね順が変わるのを防ぐため2枚用意。
        const mycanvasicon = document.querySelector("#mycanvasicon");
        const myctxicon = mycanvasicon.getContext("2d");
        myctxicon.strokeText("now loading ...", 10, 10);
        const mycanvasvideo = document.querySelector("#mycanvasvideo");
        const myctxvideo = mycanvasvideo.getContext("2d");

        // 顔に表示するアイコンと読み込み待ちフラグ
        const myicon = new Image();
        myicon.src = "./icon.png";
        let loadedmyicon = false;
        myicon.onload = () => {
            loadedmyicon = true;
        }

        /**
         * しきい値をもとに今回の値を算出
         */
        const calcNowVal = (nowval, field) => {
            const ret = Math.abs(nowval - pre[field]) >= threshold[field] ? nowval : pre[field];
            pre[field] = ret; // 前回の値を更新
            return ret;
        };

        // 顔認識のインスタンス化
        const detector = new FaceDetector();

        // アイコンサイズの補正
        const fixPosWH = (box) => {
            // whの大きい方を基準に拡大して、位置をその分左上にずらす
            const nowmax = Math.max(box.width, box.height);
            const max = calcNowVal(nowmax, "wh");
            const wh = max * spread;
            const offset = (wh - max) / 2; // ずらすのは増加分の半分。残り半分は右下に伸ばす
            const x = calcNowVal(box.x - offset, "x");
            const y = calcNowVal(box.y - offset, "y");

            return {
                wh: wh,
                x: x,
                y: y,
            };
        }

        // ビデオ更新のたびに実行
        const tick = async () => {
            try {
                if (loadedmyicon) {
                    const detects = await detector.detect(myvideo);

                    // 以前のアイコンをクリア
                    myctxicon.clearRect(0, 0, vwidth, vheight);

                    // 検出した顔すべてにアイコンを表示
                    for (const detect of detects) {
                        const box = detect.boundingBox;
                        const pos = fixPosWH(box);
                        myctxicon.drawImage(myicon, pos.x, pos.y, pos.wh, pos.wh);
                    }
                    myctxvideo.drawImage(myvideo, 0, 0, vwidth, vheight);
                }
                window.requestAnimationFrame(tick);
            } catch (e) {
                console.error(e);
            }
        };

        // カメラの取得
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        myvideo.srcObject = stream;
        myvideo.onloadedmetadata = async (e) => {
            // 撮影開始
            myvideo.play();
            mycanvasicon.width = mycanvasvideo.width = vwidth = myvideo.videoWidth;
            mycanvasicon.height = mycanvasvideo.height = vheight = myvideo.videoHeight;
            await tick();
        };
    } catch (e) {
        console.error(e);
    }
};

window.addEventListener("load", main);