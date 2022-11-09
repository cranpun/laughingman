export class Icon {
    constructor(spread, xoffset, yoffset, path) {
        this.spread = spread;
        this.xoffset = xoffset;
        this.yoffset = yoffset;
        this.path = path;

    }
}

export const laugh = new Icon(
    2.4,
    +0.0,
    -0.3,
    "./icons/icon.png",
);
export const me01 = new Icon(
    4.0,
    +0.0,
    +0.5,
    "./icons/me01.png",
);
export const nh_ratix = new Icon(
    4.0,
    +0.0,
    +0.5,
    "./icons/nh_ratix.png",
);
export const nh_nohmi = new Icon(
    4.0,
    +0.2,
    +0.4,
    "./icons/nh_nohmi.png",
);
export const nh_toys = new Icon(
    4.5,
    +0.0,
    +0.1,
    "./icons/nh_toys.png",
);
