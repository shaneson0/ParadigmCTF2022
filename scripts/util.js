

startMockAccount = async (account) => {
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: account,
    });
}

module.exports = {
    startMockAccount
}
