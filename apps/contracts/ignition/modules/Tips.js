const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const Tips = buildModule("Tips", (m) => {
  const token = m.contract("Tips");

  return { token };
});

module.exports = Tips;
