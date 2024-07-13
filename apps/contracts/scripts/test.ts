import "@nomicfoundation/hardhat-ethers";
import { ethers } from "hardhat";

const erc20abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount)",
  "function approve(address spender, uint256 amount) returns (bool)",
];

async function main() {
  //deposit erc20 token from deployer key
  const deployerKey = process.env.DEPLOYER_KEY;
  if (!deployerKey) {
    console.warn(
      "DEPLOYER_KEY not found in .env file. Running with default config"
    );
  }
  const MyContract = await ethers.getContractFactory("Tips");
  const signer = new ethers.Wallet(deployerKey as string);
  const contractAddress = "0xf62d149d96060d6804C12814fD6f387A47C42654";
  const erc20token = "0x32ffdde66a45d504ee691eb1c1f1bd739e16cc6c";
  const user = "0x29369c3E2d9EC68f6f900C27de3eFb161133Cde7";

  const contract = MyContract.attach(
    contractAddress,
    MyContract.interface,
    signer
  );

  const erc20 = await ethers.getContractAt(erc20abi, erc20token);
  const amount = ethers.parseEther("1");
  //   const approveTx = await erc20.approve(contractAddress, amount);
  //   await approveTx.wait();

  //   const depositTx = await contract.deposit(amount, erc20token);

  //claim erc20 token from contract

  const claimTx = await contract.claimTokens(erc20token, amount);
  await claimTx.wait();

  const res = await contract.balanceOfContract(erc20token);

  console.log(res.toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
