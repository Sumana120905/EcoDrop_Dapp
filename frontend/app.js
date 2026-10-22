
const CONTRACT_ADDRESS = "0x1d2A37eD3054CB39D6Ac0c968A9f45071987020B"; // Add deployed Sepolia contract address
const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "verifier",
        "type": "address"
      }
    ],
    "name": "CollectionConfirmed",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "confirmCollection",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "category",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      }
    ],
    "name": "registerWaste",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "verifier",
        "type": "address"
      }
    ],
    "name": "VerifierAuthorised",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "verifier",
        "type": "address"
      }
    ],
    "name": "verifyRecycler",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "registrant",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "category",
        "type": "string"
      }
    ],
    "name": "WasteRegistered",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "authorisedVerifiers",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllRecords",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "registrant",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "category",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "enum EcoDrop.Status",
            "name": "status",
            "type": "uint8"
          }
        ],
        "internalType": "struct EcoDrop.WasteRecord[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalRecords",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "getWaste",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "registrant",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "category",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "enum EcoDrop.Status",
            "name": "status",
            "type": "uint8"
          }
        ],
        "internalType": "struct EcoDrop.WasteRecord",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalRecords",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];     // Add ABI copied from Remix

const SEPOLIA_CHAIN_ID = 11155111n;

let provider;
let signer;
let contract;

const $ = (id) => document.getElementById(id);

function setStatus(message, error = false) {
  $("statusText").textContent = message;
  document.querySelector(".activity-dot").style.background =
    error ? "#c94c4c" : "#16805d";
}

function shortAddress(address) {
  return address.slice(0, 6) + "..." + address.slice(-4);
}

function isConfigured() {
  return ethers.isAddress(CONTRACT_ADDRESS) &&
         CONTRACT_ABI.length > 0;
}

async function checkNetwork() {
  const network = await provider.getNetwork();

  if (network.chainId !== SEPOLIA_CHAIN_ID) {
    throw new Error("Switch MetaMask to Sepolia.");
  }
}

async function connectWallet() {
  try {
    if (!window.ethereum) {
      throw new Error("Please install the MetaMask extension.");
    }

    provider = new ethers.BrowserProvider(window.ethereum);

    await provider.send("eth_requestAccounts", []);
    await checkNetwork();

    signer = await provider.getSigner();

    $("connectBtn").textContent =
      shortAddress(await signer.getAddress());

    $("networkBadge").textContent = "Sepolia · Connected";

    if (isConfigured()) {
      contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      await refreshRecords();
    } else {
      setStatus("Wallet connected. Configure the contract address and ABI.");
    }
  } catch (error) {
    setStatus(error.shortMessage || error.message, true);
  }
}

async function getContract() {
  if (!signer || !contract) {
    throw new Error("Connect your wallet and configure the contract first.");
  }

  await checkNetwork();
  return contract;
}

function explainError(error) {
  if (error.code === "ACTION_REJECTED" || error.code === 4001) {
    return "Transaction cancelled in MetaMask.";
  }

  return error.shortMessage ||
         error.reason ||
         error.message ||
         "The operation failed.";
}

async function registerWaste(event) {
  event.preventDefault();

  try {
    const appContract = await getContract();

    const category = $("category").value.trim();
    const description = $("description").value.trim();

    if (!category || !description) {
      throw new Error("Enter both a category and description.");
    }

    setStatus("Confirm registration in MetaMask...");

    const tx = await appContract.registerWaste(
      category,
      description
    );

    setStatus("Transaction submitted. Waiting for confirmation...");

    await tx.wait();

    $("registerForm").reset();

    setStatus("Waste registered successfully!");
    await refreshRecords();
  } catch (error) {
    setStatus(explainError(error), true);
  }
}

async function authoriseVerifier(event) {
  event.preventDefault();

  try {
    const appContract = await getContract();
    const address = $("verifierAddress").value.trim();

    if (!ethers.isAddress(address)) {
      throw new Error("Enter a valid wallet address.");
    }

    setStatus("Confirm verifier authorisation in MetaMask...");

    const tx = await appContract.verifyRecycler(address);
    await tx.wait();

    $("verifierForm").reset();
    setStatus("Recycler authorised successfully!");
  } catch (error) {
    setStatus(explainError(error), true);
  }
}

async function confirmCollection(event) {
  event.preventDefault();

  try {
    const appContract = await getContract();
    const id = $("collectId").value;

    if (!id || !Number.isSafeInteger(Number(id)) ||
        Number(id) < 1) {
      throw new Error("Enter a valid positive record ID.");
    }

    setStatus("Confirm collection in MetaMask...");

    const tx = await appContract.confirmCollection(BigInt(id));
    await tx.wait();

    $("collectForm").reset();

    setStatus("Collection confirmed successfully!");
    await refreshRecords();
  } catch (error) {
    setStatus(explainError(error), true);
  }
}

async function refreshRecords() {
  try {
    if (!provider || !signer) {
      throw new Error("Connect MetaMask first.");
    }

    await checkNetwork();

    if (!isConfigured()) {
      setStatus("Add the deployed contract address and ABI.");
      return;
    }

    contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    const [total, records] = await Promise.all([
      contract.getTotalRecords(),
      contract.getAllRecords()
    ]);

    let pending = 0;
    let collected = 0;

    const body = $("recordsBody");
    body.replaceChildren();

    for (const record of records) {
      const isCollected = Number(record.status) === 1;

      if (isCollected) collected++;
      else pending++;

      const row = document.createElement("tr");

      const cells = [
        `#${record.id}`,
        "",
        shortAddress(record.registrant),
        new Date(Number(record.timestamp) * 1000)
          .toLocaleDateString(),
        ""
      ];

      cells.forEach((value, index) => {
        const cell = document.createElement("td");

        if (index === 1) {
          const title = document.createElement("strong");
          title.textContent = record.category;

          const description = document.createElement("small");
          description.textContent = record.description;

          cell.append(title, description);
        } else if (index === 4) {
          const status = document.createElement("span");

          status.className = isCollected
            ? "status-pill status-collected"
            : "status-pill status-pending";

          status.textContent = isCollected
            ? "Collected"
            : "Awaiting collection";

          cell.appendChild(status);
        } else {
          cell.textContent = value;
        }

        row.appendChild(cell);
      });

      body.appendChild(row);
    }

    $("totalCount").textContent = total.toString();
    $("pendingCount").textContent = pending;
    $("collectedCount").textContent = collected;

    $("recordCountLabel").textContent =
      `${records.length} record(s)`;

    $("emptyState").hidden = records.length > 0;
    $("recordsTable").hidden = records.length === 0;

    setStatus("Blockchain records updated.");
  } catch (error) {
    setStatus(explainError(error), true);
  }
}

$("connectBtn").addEventListener("click", connectWallet);
$("registerForm").addEventListener("submit", registerWaste);
$("verifierForm").addEventListener("submit", authoriseVerifier);
$("collectForm").addEventListener("submit", confirmCollection);
$("refreshBtn").addEventListener("click", refreshRecords);

if (window.ethereum) {
  window.ethereum.on("accountsChanged", () => location.reload());
  window.ethereum.on("chainChanged", () => location.reload());
}
