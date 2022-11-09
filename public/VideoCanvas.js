export class VideoCanvas {
    constructor() {
        // property
        this.myvideo;
        this.vwidth;
        this.vheight;
        this.mycanvasicon;
        this.myctxicon;
        this.mycanvasvideo;
        this.myctxvideo;

        this.tickFunc;
    }

    init() {
        // 読み取った画像とそのサイズ
        this.myvideo = document.querySelector("#myvideo");
        this.vwidth = 0;
        this.vheight = 0;

        // 表示するキャンバス。videoとアイコンのレイヤ。読み込み順によって重ね順が変わるのを防ぐため2枚用意。
        this.mycanvasicon = document.querySelector("#mycanvasicon");
        this.myctxicon = this.mycanvasicon.getContext("2d");
        this.myctxicon.strokeText("now loading ...", 10, 10);
        this.mycanvasvideo = document.querySelector("#mycanvasvideo");
        this.myctxvideo = this.mycanvasvideo.getContext("2d");
    }

    setTickFunc(tickFunc) {
        this.tickFunc = tickFunc;
    }

    async start() {
        // カメラの取得
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.myvideo.srcObject = stream;
        this.myvideo.onloadedmetadata = async (e) => {
            // 撮影開始
            this.myvideo.play();
            this.mycanvasicon.width = this.mycanvasvideo.width = this.vwidth = this.myvideo.videoWidth;
            this.mycanvasicon.height = this.mycanvasvideo.height = this.vheight = this.myvideo.videoHeight;
            await this.capture();
        };
    }

    async capture() {
        // カメラ映像の描画
        this.myctxvideo.drawImage(this.myvideo, 0, 0, this.vwidth, this.vheight);
        if (this.tickFunc) {
            await this.tickFunc();
        }
        window.requestAnimationFrame(() => this.capture());
    }

}
