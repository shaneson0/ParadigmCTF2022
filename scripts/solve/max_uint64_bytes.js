
const Limit = 18446744073709551615;

async function create_max_uint64_bytes2(depth, ) {

}


async function create_max_uint64_bytes() {
    let reason = "0x";
    for (i = 0; i < Limit; i++) {
        reason = reason + "0";
    }
    return reason
}


module.exports = {
    create_max_uint64_bytes
}
