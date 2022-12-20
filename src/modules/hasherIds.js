import hasherIds from "hashids"

const hasher = new hasherIds("pipiska228", 6)

export default {
    encode(id) {
        return hasher.encode(id)
    },
    decode(hash) {
        return hasher.decode(hash)
    }
}