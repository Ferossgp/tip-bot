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
  const user = "0x29369c3E2d9EC68f6f900C27de3eFb161133Cde7";

  //sepolia
  //   const contractAddress = "0xf62d149d96060d6804C12814fD6f387A47C42654";
  //   const erc20token = "0x32ffdde66a45d504ee691eb1c1f1bd739e16cc6c";

  //sepolia
  // const contractAddress = "0xf62d149d96060d6804C12814fD6f387A47C42654";
  // const erc20token = "0x34182d56d905a195524a8f1813180c134687ca34";

  // arbitrum
  //   const contractAddress = "0x03DF7a86c1506FfFDE626b3F02aF0a4e01E1395a";
  //   const erc20token = "0x4e5CB09A5dCbAd6aa54a8aaA29b7F50C32349fB2";

  //base
  //   const erc20token = "0xA830d481741cE7b0A2E0a0e2a780079f10B87d0c";
  //   const contractAddress = "0x106aD991745e304e3C2175836dB85AE88FfddBB0";

  //zircuit
  //   const erc20token = "0xaa6dA3B886Fa13ABF371B18Cae7A1c4EAa0DdB6C";
  //   const contractAddress = '0x27Eb1CcE195749980c93a066Cc99DC5DE58D9582'

  //morph
  //   const erc20token = "0x9F7921d02e1740c4Dbf26c65CB9B263a93edB0A5";
  //   const contractAddress = "0x27Eb1CcE195749980c93a066Cc99DC5DE58D9582";
  //scroll
    const erc20token = "0x82224c9441957019368f98d1b3e94f05BA7DCFC0";
    const contractAddress = "0x27Eb1CcE195749980c93a066Cc99DC5DE58D9582";

  //ape

  const contract = MyContract.attach(
    contractAddress,
    MyContract.interface,
    signer
  );

  const erc20 = await ethers.getContractAt(erc20abi, erc20token);
  const amount = ethers.parseEther("1000");
  const approveTx = await erc20.approve(contractAddress, amount);
  await approveTx.wait();

  //   const depositTx = await contract.deposit(amount, erc20token);

  //claim erc20 token from contract

  //   const claimTx = await contract.claimTokens(erc20token, amount);
  //   await claimTx.wait();

  const res = await contract.balanceOfContract(erc20token);

  console.log(res.toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
