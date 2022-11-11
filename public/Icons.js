export class Icon {
    constructor(zoom, xoffset, yoffset, path, width, height) {
        this.zoom = zoom;
        this.xoffset = xoffset; // 縦位置補正
        this.yoffset = yoffset; // 横位置補正
        this.path = path;
        this.width = width;
        this.height = height;

    }
}

export const icons = {
    laugh: new Icon(
        1,
        +1000,
        +750,
        "./icons/icon.png",
        1978,
        1978,
    ),
    me01: new Icon(
        1.8,
        +500,
        +1000,
        "./icons/me01.png",
        1424,
        1756,
    ),
    nh_nohmi: new Icon(
        1.6,
        +500,
        +1600,
        "./icons/nh_nohmi.png",
        1714,
        1913,
    ),
    nh_ratix: new Icon(
        1.6,
        +500,
        +1600,
        "./icons/nh_ratix.png",
        1678,
        2068,
    ),
    nh_toys: new Icon(
        1.5,
        +200,
        +500,
        "./icons/nh_toys.png",
        1638,
        1740,
    )
};
