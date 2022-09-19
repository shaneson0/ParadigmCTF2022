

startMockAccount = async (account) => {
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: account,
    });
}

setBalance = async (user, amount) => {
    await network.provider.send("hardhat_setBalance", [
        user,
        amount,
    ]);
}

module.exports = {
    startMockAccount,
    setBalance
}
