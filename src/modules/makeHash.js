import md5 from "md5";

export default function (text) {
    const salt = process.env.SALT ?? "s@1t";

    return md5(text + salt);
}