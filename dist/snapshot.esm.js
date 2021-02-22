import { BigNumber } from '@ethersproject/bignumber';
import { toUtf8Bytes } from '@ethersproject/strings';
import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { EnumType, jsonToGraphQLQuery } from 'json-to-graphql-query';
import Ajv from 'ajv';
import { getAddress } from '@ethersproject/address';
import { formatUnits, parseUnits } from '@ethersproject/units';
import fetch$1 from 'cross-fetch';
import { bufferToHex } from 'ethereumjs-util';
import set from 'lodash.set';
import { JsonRpcProvider } from '@ethersproject/providers';
import contentHash from '@ensdomains/content-hash';
import { namehash } from '@ethersproject/hash';
import { isHexString } from '@ethersproject/bytes';
import bs58 from 'bs58';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var abi = [
	{
		constant: true,
		inputs: [
			{
				components: [
					{
						name: "target",
						type: "address"
					},
					{
						name: "callData",
						type: "bytes"
					}
				],
				name: "calls",
				type: "tuple[]"
			}
		],
		name: "aggregate",
		outputs: [
			{
				name: "blockNumber",
				type: "uint256"
			},
			{
				name: "returnData",
				type: "bytes[]"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
			{
				name: "addr",
				type: "address"
			}
		],
		name: "getEthBalance",
		outputs: [
			{
				name: "balance",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	}
];

var BALANCER_SUBGRAPH_URL = {
    '1': 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-beta',
    '42': 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-kovan'
};
function strategy(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var params, result, score;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {
                        poolShares: {
                            __args: {
                                where: {
                                    userAddress_in: addresses.map(function (address) { return address.toLowerCase(); }),
                                    balance_gt: 0
                                },
                                first: 1000,
                                orderBy: 'balance',
                                orderDirection: 'desc'
                            },
                            userAddress: {
                                id: true
                            },
                            balance: true,
                            poolId: {
                                totalShares: true,
                                tokens: {
                                    id: true,
                                    balance: true
                                }
                            }
                        }
                    };
                    if (snapshot !== 'latest') {
                        // @ts-ignore
                        params.poolShares.__args.block = { number: snapshot };
                    }
                    return [4 /*yield*/, subgraphRequest(BALANCER_SUBGRAPH_URL[network], params)];
                case 1:
                    result = _a.sent();
                    score = {};
                    if (result && result.poolShares) {
                        result.poolShares.forEach(function (poolShare) {
                            return poolShare.poolId.tokens.map(function (poolToken) {
                                var _a = poolToken.id.split('-'), tokenAddress = _a[1];
                                if (tokenAddress === options.address.toLowerCase()) {
                                    var userAddress = getAddress(poolShare.userAddress.id);
                                    if (!score[userAddress])
                                        score[userAddress] = 0;
                                    score[userAddress] =
                                        score[userAddress] +
                                            (poolToken.balance / poolShare.poolId.totalShares) *
                                                poolShare.balance;
                                }
                            });
                        });
                    }
                    return [2 /*return*/, score || {}];
            }
        });
    });
}

function getArgs(options, address) {
    var args = options.args || ['%{address}'];
    return args.map(function (arg) {
        return typeof arg === 'string' ? arg.replace(/%{address}/g, address) : arg;
    });
}
function strategy$1(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, multicall(network, provider, [options.methodABI], addresses.map(function (address) { return [
                            options.address,
                            options.methodABI.name,
                            getArgs(options, address)
                        ]; }), { blockTag: blockTag })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, Object.fromEntries(response.map(function (value, i) { return [
                            addresses[i],
                            parseFloat(formatUnits(value.toString(), options.decimals))
                        ]; }))];
            }
        });
    });
}

var ENS_SUBGRAPH_URL = {
    '1': 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
    '3': 'https://api.thegraph.com/subgraphs/name/ensdomains/ensropsten',
    '4': 'https://api.thegraph.com/subgraphs/name/ensdomains/ensrinkeby',
    '5': 'https://api.thegraph.com/subgraphs/name/ensdomains/ensgoerli'
};
function strategy$2(_space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var params, result, score;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {
                        domains: {
                            __args: {
                                where: {
                                    name: options.domain
                                },
                                first: 1000
                            },
                            id: true,
                            labelName: true,
                            subdomains: {
                                __args: {
                                    where: {
                                        owner_in: addresses.map(function (address) { return address.toLowerCase(); })
                                    }
                                },
                                owner: {
                                    id: true
                                }
                            }
                        }
                    };
                    if (snapshot !== 'latest') {
                        // @ts-ignore
                        params.domains.__args.block = { number: snapshot };
                    }
                    return [4 /*yield*/, subgraphRequest(ENS_SUBGRAPH_URL[network], params)];
                case 1:
                    result = _a.sent();
                    score = {};
                    if (result && result.domains) {
                        result.domains.forEach(function (u) {
                            u.subdomains.forEach(function (domain) {
                                var userAddress = domain.owner.id;
                                if (!score[userAddress])
                                    score[userAddress] = 0;
                                score[userAddress] = score[userAddress] + 1;
                            });
                        });
                    }
                    return [2 /*return*/, score || {}];
            }
        });
    });
}

var abi$1 = [
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
function strategy$3(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, multicall(network, provider, abi$1, addresses.map(function (address) { return [options.address, 'balanceOf', [address]]; }), { blockTag: blockTag })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, Object.fromEntries(response.map(function (value, i) { return [
                            addresses[i],
                            parseFloat(formatUnits(value.toString(), options.decimals))
                        ]; }))];
            }
        });
    });
}

function strategy$4(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var score;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, strategy$3(space, network, provider, addresses, options, snapshot)];
                case 1:
                    score = _a.sent();
                    return [2 /*return*/, Object.fromEntries(Object.entries(score).map(function (address) { return [
                            address[0],
                            address[1] * options.coeff
                        ]; }))];
            }
        });
    });
}

function strategy$5(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var score, totalScore;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, strategy$3(space, network, provider, addresses, options, snapshot)];
                case 1:
                    score = _a.sent();
                    totalScore = Object.values(score).reduce(function (a, b) { return a + b; }, 0);
                    return [2 /*return*/, Object.fromEntries(Object.entries(score).map(function (address) { return [
                            address[0],
                            (options.total * address[1]) / totalScore
                        ]; }))];
            }
        });
    });
}

function strategy$6(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var score;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, strategy$3(space, network, provider, addresses, options, snapshot)];
                case 1:
                    score = _a.sent();
                    return [2 /*return*/, Object.fromEntries(Object.entries(score).map(function (address) { return [address[0], Math.sqrt(address[1])]; }))];
            }
        });
    });
}

function strategy$7(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var score;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, strategy$3(space, network, provider, addresses, options, snapshot)];
                case 1:
                    score = _a.sent();
                    return [2 /*return*/, Object.fromEntries(Object.entries(score).map(function (address) { return [
                            address[0],
                            address[1] > (options.minBalance || 0) ? 1 : 0
                        ]; }))];
            }
        });
    });
}

function getDelegations(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var params, result, delegationsReverse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {
                        delegations: {
                            __args: {
                                where: {
                                    delegate_in: addresses.map(function (address) { return address.toLowerCase(); }),
                                    delegator_not_in: addresses.map(function (address) { return address.toLowerCase(); }),
                                    space_in: ['', space]
                                },
                                first: 1000
                            },
                            delegator: true,
                            space: true,
                            delegate: true
                        }
                    };
                    if (snapshot !== 'latest') {
                        // @ts-ignore
                        params.delegations.__args.block = { number: snapshot };
                    }
                    return [4 /*yield*/, subgraphRequest(SNAPSHOT_SUBGRAPH_URL[network], params)];
                case 1:
                    result = _a.sent();
                    if (!result || !result.delegations)
                        return [2 /*return*/, {}];
                    delegationsReverse = {};
                    result.delegations.forEach(function (delegation) {
                        return (delegationsReverse[delegation.delegator] = delegation.delegate);
                    });
                    result.delegations
                        .filter(function (delegation) { return delegation.space !== ''; })
                        .forEach(function (delegation) {
                        return (delegationsReverse[delegation.delegator] = delegation.delegate);
                    });
                    return [2 /*return*/, Object.fromEntries(addresses.map(function (address) { return [
                            address,
                            Object.entries(delegationsReverse)
                                .filter(function (_a) {
                                var delegate = _a[1];
                                return address.toLowerCase() === delegate;
                            })
                                .map(function (_a) {
                                var delegator = _a[0];
                                return delegator;
                            })
                        ]; }))];
            }
        });
    });
}

function strategy$8(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var delegations, score;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDelegations(space, network, provider, addresses, options, snapshot)];
                case 1:
                    delegations = _a.sent();
                    if (Object.keys(delegations).length === 0)
                        return [2 /*return*/, {}];
                    console.debug('Delegations', delegations);
                    return [4 /*yield*/, strategy$3(space, network, provider, Object.values(delegations).reduce(function (a, b) {
                            return a.concat(b);
                        }), options, snapshot)];
                case 2:
                    score = _a.sent();
                    console.debug('Delegators score', score);
                    return [2 /*return*/, Object.fromEntries(addresses.map(function (address) {
                            var addressScore = delegations[address]
                                ? delegations[address].reduce(function (a, b) { return a + score[b]; }, 0)
                                : 0;
                            return [address, addressScore];
                        }))];
            }
        });
    });
}

function strategy$9(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var score;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, strategy$3(space, network, provider, addresses, options, snapshot)];
                case 1:
                    score = _a.sent();
                    Object.keys(score).forEach(function (key) {
                        if (score[key] >= options.minBalance)
                            score[key] = score[key];
                        else
                            score[key] = 0;
                    });
                    return [2 /*return*/, score];
            }
        });
    });
}

function strategy$a(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var delegations, scores;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDelegations(space, network, provider, addresses, options, snapshot)];
                case 1:
                    delegations = _a.sent();
                    if (Object.keys(delegations).length === 0)
                        return [2 /*return*/, {}];
                    return [4 /*yield*/, Promise.all([strategy$3, strategy].map(function (s) {
                            return s(space, network, provider, Object.values(delegations).reduce(function (a, b) {
                                return a.concat(b);
                            }), options, snapshot);
                        }))];
                case 2:
                    scores = _a.sent();
                    return [2 /*return*/, Object.fromEntries(addresses.map(function (address) {
                            var addressScore = delegations[address]
                                ? delegations[address].reduce(function (a, b) { return a + (scores[0][b] || 0) + (scores[1][b] || 0); }, 0)
                                : 0;
                            return [address, addressScore];
                        }))];
            }
        });
    });
}

function strategy$b(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, multicall(network, provider, abi, addresses.map(function (address) { return [
                            MULTICALL[network],
                            'getEthBalance',
                            [address]
                        ]; }), { blockTag: blockTag })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, Object.fromEntries(response.map(function (value, i) { return [
                            addresses[i],
                            parseFloat(formatUnits(value.toString(), 18))
                        ]; }))];
            }
        });
    });
}

var getJWT = function (dfuseApiKey) { return __awaiter(void 0, void 0, void 0, function () {
    var rawResponse, content;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch$1('https://auth.dfuse.io/v1/auth/issue', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ api_key: dfuseApiKey })
                })];
            case 1:
                rawResponse = _a.sent();
                return [4 /*yield*/, rawResponse.json()];
            case 2:
                content = _a.sent();
                return [2 /*return*/, content.token];
        }
    });
}); };
function strategy$c(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var data, query, dfuseJWT;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = [];
                    query = Object.fromEntries(addresses.map(function (address) { return [
                        "_" + address,
                        {
                            __aliasFor: 'searchTransactions',
                            __args: {
                                indexName: new EnumType('CALLS'),
                                query: "(from:" + address + " OR to:" + address + ")",
                                sort: new EnumType('ASC'),
                                limit: 1
                            },
                            edges: {
                                block: {
                                    header: {
                                        timestamp: true
                                    },
                                    number: true
                                },
                                node: {
                                    from: true,
                                    to: true
                                }
                            }
                        }
                    ]; }));
                    return [4 /*yield*/, getJWT(options.dfuseApiKey || 'web_f527db575a38dd11c5b686d7da54d371')];
                case 1:
                    dfuseJWT = _a.sent();
                    return [4 /*yield*/, subgraphRequest('https://mainnet.eth.dfuse.io/graphql', query, {
                            headers: {
                                Authorization: "Bearer " + dfuseJWT
                            }
                        })];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, Object.fromEntries(Object.values(data).map(function (value, i) { return [
                            addresses[i],
                            (function () {
                                var _a, _b, _c;
                                var today = new Date().getTime();
                                var firstTransaction = ((_c = (_b = (_a = value.edges[0]) === null || _a === void 0 ? void 0 : _a.block) === null || _b === void 0 ? void 0 : _b.header) === null || _c === void 0 ? void 0 : _c.timestamp) || today;
                                var diffInSeconds = Math.abs(firstTransaction - today);
                                var walletAgeInDays = Math.floor(diffInSeconds / 1000 / 60 / 60 / 24);
                                return walletAgeInDays;
                            })()
                        ]; }))];
            }
        });
    });
}

var MAKER_DS_CHIEF_ADDRESS = {
    '1': '0x9ef05f7f6deb616fd37ac3c959a2ddd25a54e4f5'
};
var abi$2 = [
    {
        constant: true,
        inputs: [
            {
                name: '',
                type: 'address'
            }
        ],
        name: 'deposits',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
function strategy$d(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, multicall(network, provider, abi$2, addresses.map(function (address) { return [
                            MAKER_DS_CHIEF_ADDRESS[network],
                            'deposits',
                            [address]
                        ]; }), { blockTag: blockTag })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, Object.fromEntries(response.map(function (value, i) { return [
                            addresses[i],
                            parseFloat(formatUnits(value.toString(), options.decimals))
                        ]; }))];
            }
        });
    });
}

var UNI_ADDRESS = {
    '1': '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'
};
var abi$3 = [
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'getCurrentVotes',
        outputs: [
            {
                internalType: 'uint96',
                name: '',
                type: 'uint96'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
function strategy$e(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, multicall(network, provider, abi$3, addresses.map(function (address) { return [
                            UNI_ADDRESS[network],
                            'getCurrentVotes',
                            [address.toLowerCase()],
                            { blockTag: blockTag }
                        ]; }))];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, Object.fromEntries(response.map(function (value, i) { return [
                            addresses[i],
                            parseFloat(formatUnits(value.toString(), options.decimals))
                        ]; }))];
            }
        });
    });
}

var abi$4 = [
    {
        constant: true,
        inputs: [],
        name: 'getPricePerFullShare',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
function strategy$f(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, _a, score, pricePerFullShare;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, Promise.all([
                            strategy$3(space, network, provider, addresses, options, snapshot),
                            multicall(network, provider, abi$4, [[options.address, 'getPricePerFullShare', []]], { blockTag: blockTag })
                        ])];
                case 1:
                    _a = _b.sent(), score = _a[0], pricePerFullShare = _a[1][0];
                    pricePerFullShare = parseFloat(formatUnits(pricePerFullShare.toString(), 18));
                    return [2 /*return*/, Object.fromEntries(Object.entries(score).map(function (address) { return [
                            address[0],
                            address[1] * pricePerFullShare
                        ]; }))];
            }
        });
    });
}

var BIG6 = BigNumber.from('1000000');
var BIG18 = BigNumber.from('1000000000000000000');
var DECIMALS = 18;
var abi$5 = [
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'boostedBalanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'getReserves',
        outputs: [
            {
                internalType: 'uint112',
                name: '_reserve0',
                type: 'uint112'
            },
            {
                internalType: 'uint112',
                name: '_reserve1',
                type: 'uint112'
            },
            {
                internalType: 'uint32',
                name: '_blockTimestampLast',
                type: 'uint32'
            }
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true
    },
    {
        inputs: [],
        name: 'token0',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    }
];
var chunk = function (arr, size) {
    return Array.from({ length: Math.ceil(arr.length / size) }, function (v, i) {
        return arr.slice(i * size, i * size + size);
    });
};
function strategy$g(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, fxsQuery, freeUniLPFraxFxsQuery, farmingUniLPFraxFxsQuery, freeSushiLPFraxFxsQuery, farmingSushiLPFraxFxsQuery, freeSushiLPFxsWethQuery, farmingSushiLPFxsWethQuery, response, uniLPFraxFxs_token0, uniLPFraxFxs_getReserves, uniLPFraxFxs_totalSupply, sushiLPFraxFxs_token0, sushiLPFraxFxs_getReserves, sushiLPFraxFxs_totalSupply, sushiLPFxsWeth_token0, sushiLPFxsWeth_getReserves, sushiLPFxsWeth_totalSupply, uniLPFraxFxs_fxs_per_LP_E18, uni_FraxFxs_reservesFXS_E0, uni_FraxFxs_totalSupply_E0, sushiLPFraxFxs_fxs_per_LP_E18, sushi_FraxFxs_reservesFXS_E0, sushi_FraxFxs_totalSupply_E0, sushiLPFxsWeth_fxs_per_LP_E18, sushi_FxsWeth_reservesFXS_E0, sushi_FxsWeth_totalSupply_E0, responseClean, chunks, fxsBalances, freeUniFraxFxsBalances, farmUniFraxFxsBalances, freeSushiFraxFxsBalances, farmSushiFraxFxsBalances, freeSushiFxsWethBalances, farmSushiFxsWethBalances;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    fxsQuery = addresses.map(function (address) { return [
                        options.FXS,
                        'balanceOf',
                        [address]
                    ]; });
                    freeUniLPFraxFxsQuery = addresses.map(function (address) { return [
                        options.UNI_LP_FRAX_FXS,
                        'balanceOf',
                        [address]
                    ]; });
                    farmingUniLPFraxFxsQuery = addresses.map(function (address) { return [
                        options.FARMING_UNI_LP_FRAX_FXS,
                        'boostedBalanceOf',
                        [address]
                    ]; });
                    freeSushiLPFraxFxsQuery = addresses.map(function (address) { return [
                        options.SUSHI_LP_FRAX_FXS,
                        'balanceOf',
                        [address]
                    ]; });
                    farmingSushiLPFraxFxsQuery = addresses.map(function (address) { return [
                        options.FARMING_SUSHI_LP_FRAX_FXS,
                        'boostedBalanceOf',
                        [address]
                    ]; });
                    freeSushiLPFxsWethQuery = addresses.map(function (address) { return [
                        options.SUSHI_LP_FXS_WETH,
                        'balanceOf',
                        [address]
                    ]; });
                    farmingSushiLPFxsWethQuery = addresses.map(function (address) { return [
                        options.FARMING_SUSHI_LP_FXS_WETH,
                        'boostedBalanceOf',
                        [address]
                    ]; });
                    return [4 /*yield*/, multicall(network, provider, abi$5, __spreadArrays([
                            // Get 1inch LP OPIUM-ETH balance of OPIUM
                            // [options.OPIUM, 'balanceOf', [options.LP_1INCH_OPIUM_ETH]],
                            [options.UNI_LP_FRAX_FXS, 'token0'],
                            [options.UNI_LP_FRAX_FXS, 'getReserves'],
                            [options.UNI_LP_FRAX_FXS, 'totalSupply'],
                            [options.SUSHI_LP_FRAX_FXS, 'token0'],
                            [options.SUSHI_LP_FRAX_FXS, 'getReserves'],
                            [options.SUSHI_LP_FRAX_FXS, 'totalSupply'],
                            [options.SUSHI_LP_FXS_WETH, 'token0'],
                            [options.SUSHI_LP_FXS_WETH, 'getReserves'],
                            [options.SUSHI_LP_FXS_WETH, 'totalSupply']
                        ], fxsQuery, freeUniLPFraxFxsQuery, farmingUniLPFraxFxsQuery, freeSushiLPFraxFxsQuery, farmingSushiLPFraxFxsQuery, freeSushiLPFxsWethQuery, farmingSushiLPFxsWethQuery), { blockTag: blockTag })];
                case 1:
                    response = _a.sent();
                    uniLPFraxFxs_token0 = response[0];
                    uniLPFraxFxs_getReserves = response[1];
                    uniLPFraxFxs_totalSupply = response[2];
                    sushiLPFraxFxs_token0 = response[3];
                    sushiLPFraxFxs_getReserves = response[4];
                    sushiLPFraxFxs_totalSupply = response[5];
                    sushiLPFxsWeth_token0 = response[6];
                    sushiLPFxsWeth_getReserves = response[7];
                    sushiLPFxsWeth_totalSupply = response[8];
                    if (uniLPFraxFxs_token0[0] == options.FXS)
                        uni_FraxFxs_reservesFXS_E0 = uniLPFraxFxs_getReserves[0];
                    else
                        uni_FraxFxs_reservesFXS_E0 = uniLPFraxFxs_getReserves[1];
                    uni_FraxFxs_totalSupply_E0 = uniLPFraxFxs_totalSupply[0];
                    uniLPFraxFxs_fxs_per_LP_E18 = uni_FraxFxs_reservesFXS_E0
                        .mul(BIG18)
                        .div(uni_FraxFxs_totalSupply_E0);
                    if (sushiLPFraxFxs_token0[0] == options.FXS)
                        sushi_FraxFxs_reservesFXS_E0 = sushiLPFraxFxs_getReserves[0];
                    else
                        sushi_FraxFxs_reservesFXS_E0 = sushiLPFraxFxs_getReserves[1];
                    sushi_FraxFxs_totalSupply_E0 = sushiLPFraxFxs_totalSupply[0];
                    sushiLPFraxFxs_fxs_per_LP_E18 = sushi_FraxFxs_reservesFXS_E0
                        .mul(BIG18)
                        .div(sushi_FraxFxs_totalSupply_E0);
                    if (sushiLPFxsWeth_token0[0] == options.FXS)
                        sushi_FxsWeth_reservesFXS_E0 = sushiLPFxsWeth_getReserves[0];
                    else
                        sushi_FxsWeth_reservesFXS_E0 = sushiLPFxsWeth_getReserves[1];
                    sushi_FxsWeth_totalSupply_E0 = sushiLPFxsWeth_totalSupply[0];
                    sushiLPFxsWeth_fxs_per_LP_E18 = sushi_FxsWeth_reservesFXS_E0
                        .mul(BIG18)
                        .div(sushi_FxsWeth_totalSupply_E0);
                    responseClean = response.slice(9, response.length);
                    chunks = chunk(responseClean, addresses.length);
                    fxsBalances = chunks[0];
                    freeUniFraxFxsBalances = chunks[1];
                    farmUniFraxFxsBalances = chunks[2];
                    freeSushiFraxFxsBalances = chunks[3];
                    farmSushiFraxFxsBalances = chunks[4];
                    freeSushiFxsWethBalances = chunks[5];
                    farmSushiFxsWethBalances = chunks[6];
                    return [2 /*return*/, Object.fromEntries(Array(addresses.length)
                            .fill('x')
                            .map(function (_, i) {
                            var free_fxs = fxsBalances[i][0];
                            var free_uni_frax_fxs = freeUniFraxFxsBalances[i][0];
                            var farm_uni_frax_fxs = farmUniFraxFxsBalances[i][0];
                            var free_sushi_frax_fxs = freeSushiFraxFxsBalances[i][0];
                            var farm_sushi_frax_fxs = farmSushiFraxFxsBalances[i][0];
                            var free_sushi_fxs_weth = freeSushiFxsWethBalances[i][0];
                            var farm_sushi_fxs_weth = farmSushiFxsWethBalances[i][0];
                            // console.log(`==================${addresses[i]}==================`);
                            // console.log("Free FXS: ", free_fxs.div(BIG18).toString());
                            // console.log("Free Uni FRAX/FXS LP: ", free_uni_frax_fxs.div(BIG18).toString());
                            // console.log("Farmed Uni FRAX/FXS LP [boosted]: ", farm_uni_frax_fxs.div(BIG18).toString());
                            // console.log("Free Sushi FRAX/FXS LP: ", free_sushi_frax_fxs.div(BIG18).toString());
                            // console.log("Farmed Sushi FRAX/FXS LP [boosted]: ", farm_sushi_frax_fxs.div(BIG18).toString());
                            // console.log("Free Sushi FXS/WETH: ", free_sushi_fxs_weth.div(BIG18).toString());
                            // console.log("Farmed Sushi FXS/WETH [boosted]: ", farm_sushi_fxs_weth.div(BIG18).toString());
                            // console.log("------");
                            // console.log("FXS per Uni FRAX/FXS LP: ", uniLPFraxFxs_fxs_per_LP_E18.toString());
                            // console.log("FXS per Sushi FRAX/FXS LP: ", sushiLPFraxFxs_fxs_per_LP_E18.toString());
                            // console.log("FXS per Sushi FXS/WETH LP: ", sushiLPFxsWeth_fxs_per_LP_E18.toString());
                            // console.log(``);
                            return [
                                addresses[i],
                                parseFloat(formatUnits(free_fxs
                                    .add(free_uni_frax_fxs.mul(uniLPFraxFxs_fxs_per_LP_E18).div(BIG18)) // FXS share in free Uni FRAX/FXS LP
                                    .add(farm_uni_frax_fxs.mul(uniLPFraxFxs_fxs_per_LP_E18).div(BIG18)) // FXS share in farmed Uni FRAX/FXS LP [boosted]
                                    .add(free_sushi_frax_fxs
                                    .mul(sushiLPFraxFxs_fxs_per_LP_E18)
                                    .div(BIG18)) // FXS share in free Sushi FRAX/FXS LP
                                    .add(farm_sushi_frax_fxs
                                    .mul(sushiLPFraxFxs_fxs_per_LP_E18)
                                    .div(BIG18)) // FXS share in farmed Sushi FRAX/FXS LP [boosted]
                                    .add(free_sushi_fxs_weth
                                    .mul(sushiLPFxsWeth_fxs_per_LP_E18)
                                    .div(BIG18)) // FXS share in free Sushi FXS/WETH LP
                                    .add(farm_sushi_fxs_weth
                                    .mul(sushiLPFxsWeth_fxs_per_LP_E18)
                                    .div(BIG18)) // FXS share in farmed Sushi FXS/WETH LP [boosted]
                                    .toString(), DECIMALS))
                            ];
                        }))];
            }
        });
    });
}

var abi$6 = [
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'memberAddressByDelegateKey',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'members',
        outputs: [
            {
                internalType: 'address',
                name: 'delegateKey',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'shares',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'loot',
                type: 'uint256'
            },
            {
                internalType: 'bool',
                name: 'exists',
                type: 'bool'
            },
            {
                internalType: 'uint256',
                name: 'highestIndexYesVote',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'jailed',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'totalShares',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    }
];
function strategy$h(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, memberAddresses, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, multicall(network, provider, abi$6, addresses.map(function (address) { return [
                            options.address,
                            'memberAddressByDelegateKey',
                            [address]
                        ]; }), { blockTag: blockTag })];
                case 1:
                    memberAddresses = _a.sent();
                    return [4 /*yield*/, multicall(network, provider, abi$6, memberAddresses
                            .filter(function (addr) {
                            return addr.toString() !== '0x0000000000000000000000000000000000000000';
                        })
                            .map(function (addr) { return [options.address, 'members', [addr.toString()]]; }), { blockTag: blockTag })];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, Object.fromEntries(response.map(function (value, i) { return [
                            addresses[i],
                            parseFloat(formatUnits(value.shares.toString(), options.decimals))
                        ]; }))];
            }
        });
    });
}

var UNISWAP_SUBGRAPH_URL = {
    '1': 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
};
function strategy$i(_space, network, _provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var params, tokenAddress, result, score;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {
                        users: {
                            __args: {
                                where: {
                                    id_in: addresses.map(function (address) { return address.toLowerCase(); })
                                },
                                first: 1000
                            },
                            id: true,
                            liquidityPositions: {
                                __args: {
                                    where: {
                                        liquidityTokenBalance_gt: 0
                                    }
                                },
                                liquidityTokenBalance: true,
                                pair: {
                                    id: true,
                                    token0: {
                                        id: true
                                    },
                                    reserve0: true,
                                    token1: {
                                        id: true
                                    },
                                    reserve1: true,
                                    totalSupply: true
                                }
                            }
                        }
                    };
                    if (snapshot !== 'latest') {
                        // @ts-ignore
                        params.users.liquidityPositions.__args.block = { number: snapshot };
                    }
                    tokenAddress = options.address.toLowerCase();
                    return [4 /*yield*/, subgraphRequest(UNISWAP_SUBGRAPH_URL[network], params)];
                case 1:
                    result = _a.sent();
                    score = {};
                    if (result && result.users) {
                        result.users.forEach(function (u) {
                            u.liquidityPositions
                                .filter(function (lp) {
                                return lp.pair.token0.id == tokenAddress ||
                                    lp.pair.token1.id == tokenAddress;
                            })
                                .forEach(function (lp) {
                                var token0perUni = lp.pair.reserve0 / lp.pair.totalSupply;
                                var token1perUni = lp.pair.reserve1 / lp.pair.totalSupply;
                                var userScore = lp.pair.token0.id == tokenAddress
                                    ? token0perUni * lp.liquidityTokenBalance
                                    : token1perUni * lp.liquidityTokenBalance;
                                var userAddress = getAddress(u.id);
                                if (!score[userAddress])
                                    score[userAddress] = 0;
                                score[userAddress] = score[userAddress] + userScore;
                            });
                        });
                    }
                    return [2 /*return*/, score || {}];
            }
        });
    });
}

var sousChefabi = [
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'userInfo',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    }
];
var masterChefAbi = [
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            },
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'userInfo',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'rewardDebt',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    }
];
var masterChefContractAddress = '0x73feaa1eE314F8c655E354234017bE2193C9E24E';
function strategy$j(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, score, masterBalances, sousBalances;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, strategy$3(space, network, provider, addresses, options, snapshot)];
                case 1:
                    score = _a.sent();
                    return [4 /*yield*/, multicall(network, provider, masterChefAbi, addresses.map(function (address) { return [
                            masterChefContractAddress,
                            'userInfo',
                            ['0', address]
                        ]; }), { blockTag: blockTag })];
                case 2:
                    masterBalances = _a.sent();
                    return [4 /*yield*/, Promise.all(options.chefAddresses.map(function (item) {
                            return multicall(network, provider, sousChefabi, addresses.map(function (address) { return [
                                item.address,
                                'userInfo',
                                [address],
                                { blockTag: blockTag }
                            ]; }), { blockTag: blockTag });
                        }))];
                case 3:
                    sousBalances = _a.sent();
                    return [2 /*return*/, Object.fromEntries(Object.entries(score).map(function (address, index) { return [
                            address[0],
                            address[1] +
                                parseFloat(formatUnits(masterBalances[index].amount.toString(), 18)) +
                                sousBalances.reduce(function (prev, cur, idx) {
                                    return prev +
                                        parseFloat(formatUnits(cur[index].amount.toString(), options.chefAddresses[idx].decimals));
                                }, 0)
                        ]; }))];
            }
        });
    });
}

var synthetixStateAbi = [
    {
        constant: true,
        inputs: [{ name: '', type: 'address' }],
        name: 'issuanceData',
        outputs: [
            { name: 'initialDebtOwnership', type: 'uint256' },
            { name: 'debtEntryIndex', type: 'uint256' }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
var synthetixStateContractAddress = '0x4b9Ca5607f1fF8019c1C6A3c2f0CC8de622D5B82';
function strategy$k(space, network, provider, addresses, _, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, response, quadraticWeighting;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, multicall(network, provider, synthetixStateAbi, addresses.map(function (address) { return [
                            synthetixStateContractAddress,
                            'issuanceData',
                            [address]
                        ]; }), { blockTag: blockTag })];
                case 1:
                    response = _a.sent();
                    quadraticWeighting = function (value) {
                        // Scale the value by 100000
                        var scaledValue = value * 1e5;
                        return Math.sqrt(scaledValue);
                    };
                    return [2 /*return*/, Object.fromEntries(response.map(function (value, i) {
                            return [
                                addresses[i],
                                // initialDebtOwnership returns in 27 decimal places
                                quadraticWeighting(parseFloat(formatUnits(value.initialDebtOwnership.toString(), 27)))
                            ];
                        }))];
            }
        });
    });
}

var abi$7 = [
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'borrowBalanceStored',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
function strategy$l(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, oldBlockTag, _a, balanceOfCalls, borrowBalanceCalls, calls, _b, response, balancesOldResponse, balancesNowResponse, borrowsNowResponse, resultData, i, noBorrow, balanceNow, balanceOld;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    if (!(typeof snapshot === 'number')) return [3 /*break*/, 1];
                    _a = snapshot - options.offsetCheck;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, provider.getBlockNumber()];
                case 2:
                    _a = (_c.sent()) - options.offsetCheck;
                    _c.label = 3;
                case 3:
                    oldBlockTag = _a;
                    balanceOfCalls = addresses.map(function (address) { return [
                        options.address,
                        'balanceOf',
                        [address]
                    ]; });
                    borrowBalanceCalls = addresses.map(function (address) { return [
                        options.address,
                        'borrowBalanceStored',
                        [address]
                    ]; });
                    calls = balanceOfCalls.concat(borrowBalanceCalls);
                    return [4 /*yield*/, Promise.all([
                            multicall(network, provider, abi$7, calls, { blockTag: blockTag }),
                            multicall(network, provider, abi$7, addresses.map(function (address) { return [
                                options.address,
                                'balanceOf',
                                [address]
                            ]; }), { blockTag: oldBlockTag })
                        ])];
                case 4:
                    _b = _c.sent(), response = _b[0], balancesOldResponse = _b[1];
                    balancesNowResponse = response.slice(0, addresses.length);
                    borrowsNowResponse = response.slice(addresses.length);
                    resultData = {};
                    for (i = 0; i < balancesNowResponse.length; i++) {
                        noBorrow = 1;
                        if (options.borrowingRestricted) {
                            noBorrow =
                                borrowsNowResponse[i].toString().localeCompare('0') == 0 ? 1 : 0;
                        }
                        balanceNow = parseFloat(formatUnits(balancesNowResponse[i].toString(), options.decimals));
                        balanceOld = parseFloat(formatUnits(balancesOldResponse[i].toString(), options.decimals));
                        resultData[addresses[i]] = Math.min(balanceNow, balanceOld) * noBorrow;
                    }
                    return [2 /*return*/, resultData];
            }
        });
    });
}

function signMessage(web3, msg, address) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    msg = bufferToHex(new Buffer(msg, 'utf8'));
                    return [4 /*yield*/, web3.send('personal_sign', [msg, address])];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getBlockNumber(provider) {
    return __awaiter(this, void 0, void 0, function () {
        var blockNumber, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, provider.getBlockNumber()];
                case 1:
                    blockNumber = _a.sent();
                    return [2 /*return*/, parseInt(blockNumber)];
                case 2:
                    e_1 = _a.sent();
                    return [2 /*return*/, Promise.reject()];
                case 3: return [2 /*return*/];
            }
        });
    });
}

var abi$8 = [
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            },
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'userInfo',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'rewardDebt',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'exchangeRateStored',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'borrowBalanceStored',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
function strategy$m(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var creamAddress, blockTag, _a, calls, i, blockNumber, results, score, _i, _b, _c, userAddress, userBalance, balance;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    creamAddress = options.token;
                    if (!(typeof snapshot === 'number')) return [3 /*break*/, 1];
                    _a = snapshot;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, getBlockNumber(provider)];
                case 2:
                    _a = _d.sent();
                    _d.label = 3;
                case 3:
                    blockTag = _a;
                    calls = [];
                    for (i = 0; i < options.weeks; i++) {
                        blockNumber = blockTag > 40320 * i ? blockTag - 40320 * i : blockTag;
                        calls.push(
                        // @ts-ignore
                        creamBalanceOf(network, provider, addresses, options, blockNumber), creamSushiswapLP(network, provider, addresses, options, blockNumber), crCREAM(network, provider, addresses, options, blockNumber));
                    }
                    return [4 /*yield*/, Promise.all(calls)];
                case 4:
                    results = _d.sent();
                    score = results.reduce(function (balance, result) {
                        for (var _i = 0, _a = Object.entries(result); _i < _a.length; _i++) {
                            var _b = _a[_i], userAddress = _b[0], userBalance = _b[1];
                            balance[userAddress] = (balance[userAddress] || 0) + userBalance;
                        }
                        return balance;
                    }, {});
                    // get average balance of options.weeks
                    for (_i = 0, _b = Object.entries(score); _i < _b.length; _i++) {
                        _c = _b[_i], userAddress = _c[0], userBalance = _c[1];
                        balance = userBalance < 0 ? 0 : userBalance;
                        score[userAddress] = balance / options.weeks;
                    }
                    return [2 /*return*/, score];
            }
        });
    });
}
function creamBalanceOf(network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, numPool, numAddress, calls, _loop_1, i, balances;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    numPool = options.pools.length;
                    numAddress = addresses.length;
                    calls = [];
                    _loop_1 = function (i) {
                        calls.push.apply(calls, addresses.map(function (address) { return [
                            options.pools[i].address,
                            'balanceOf',
                            [address]
                        ]; }));
                    };
                    for (i = 0; i < numPool; i++) {
                        _loop_1(i);
                    }
                    return [4 /*yield*/, multicall(network, provider, abi$8, calls, {
                            blockTag: blockTag
                        })];
                case 1:
                    balances = _a.sent();
                    return [2 /*return*/, Object.fromEntries(addresses.map(function (address, i) {
                            var sum = 0;
                            for (var j = 0; j < numPool; j++) {
                                sum += parseFloat(formatUnits(balances[i + j * numAddress].toString(), 18));
                            }
                            return [address, sum];
                        }))];
            }
        });
    });
}
function creamSushiswapLP(network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, response, creamPerLP, lpBalances, stakedUserInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, multicall(network, provider, abi$8, __spreadArrays([
                            [options.token, 'balanceOf', [options.sushiswap]],
                            [options.sushiswap, 'totalSupply']
                        ], addresses.map(function (address) { return [
                            options.sushiswap,
                            'balanceOf',
                            [address]
                        ]; }), addresses.map(function (address) { return [
                            options.masterChef,
                            'userInfo',
                            [options.pid, address]
                        ]; })), { blockTag: blockTag })];
                case 1:
                    response = _a.sent();
                    creamPerLP = parseUnits(response[0][0].toString(), 18).div(response[1][0]);
                    lpBalances = response.slice(2, addresses.length + 2);
                    stakedUserInfo = response.slice(addresses.length + 2, addresses.length * 2 + 2);
                    return [2 /*return*/, Object.fromEntries(Array(addresses.length)
                            .fill('')
                            .map(function (_, i) {
                            var lpBalance = lpBalances[i][0].add(stakedUserInfo[i]['amount']);
                            var creamLpBalance = lpBalance
                                .mul(creamPerLP)
                                .div(parseUnits('1', 18));
                            return [addresses[i], parseFloat(formatUnits(creamLpBalance, 18))];
                        }))];
            }
        });
    });
}
function crCREAM(network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, response, exchangeRate, crCREAMBalances, borrowBalances;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, multicall(network, provider, abi$8, __spreadArrays([
                            [options.crCREAM, 'exchangeRateStored']
                        ], addresses.map(function (address) { return [
                            options.crCREAM,
                            'balanceOf',
                            [address]
                        ]; }), addresses.map(function (address) { return [
                            options.crCREAM,
                            'borrowBalanceStored',
                            [address]
                        ]; })), { blockTag: blockTag })];
                case 1:
                    response = _a.sent();
                    exchangeRate = response[0][0];
                    crCREAMBalances = response.slice(1, addresses.length + 1);
                    borrowBalances = response.slice(addresses.length + 1, addresses.length * 2 + 1);
                    return [2 /*return*/, Object.fromEntries(Array(addresses.length)
                            .fill('')
                            .map(function (_, i) {
                            var supplyBalance = crCREAMBalances[i][0]
                                .mul(exchangeRate)
                                .div(parseUnits('1', 18));
                            var lockedBalance = formatUnits(supplyBalance.sub(borrowBalances[i][0]), 18);
                            return [addresses[i], parseFloat(lockedBalance)];
                        }))];
            }
        });
    });
}

var abi$9 = [
    {
        constant: true,
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'balanceOfBonded',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
function strategy$n(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, daoQuery, lpQuery, response, uniswapESD, uniswapTotalSupply, daoBalances, lpBalances;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    daoQuery = addresses.map(function (address) { return [
                        options.dao,
                        'balanceOfBonded',
                        [address]
                    ]; });
                    lpQuery = addresses.map(function (address) { return [
                        options.rewards,
                        'balanceOfBonded',
                        [address]
                    ]; });
                    return [4 /*yield*/, multicall(network, provider, abi$9, __spreadArrays([
                            [options.token, 'balanceOf', [options.uniswap]],
                            [options.uniswap, 'totalSupply']
                        ], daoQuery, lpQuery), { blockTag: blockTag })];
                case 1:
                    response = _a.sent();
                    uniswapESD = response[0];
                    uniswapTotalSupply = response[1];
                    daoBalances = response.slice(2, addresses.length + 2);
                    lpBalances = response.slice(addresses.length + 2, addresses.length * 2 + 2);
                    return [2 /*return*/, Object.fromEntries(Array(addresses.length)
                            .fill('x')
                            .map(function (_, i) { return [
                            addresses[i],
                            parseFloat(formatUnits(uniswapESD[0]
                                .div(uniswapTotalSupply[0])
                                .mul(lpBalances[i][0])
                                .add(daoBalances[i][0])
                                .toString(), options.decimals))
                        ]; }))];
            }
        });
    });
}

function strategy$o(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var delegations, score;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDelegations(space, network, provider, addresses, options, snapshot)];
                case 1:
                    delegations = _a.sent();
                    if (Object.keys(delegations).length === 0)
                        return [2 /*return*/, {}];
                    console.debug('Delegations', delegations);
                    return [4 /*yield*/, strategy$n(space, network, provider, Object.values(delegations).reduce(function (a, b) {
                            return a.concat(b);
                        }), options, snapshot)];
                case 2:
                    score = _a.sent();
                    console.debug('Delegators score', score);
                    return [2 /*return*/, Object.fromEntries(addresses.map(function (address) {
                            var addressScore = delegations[address]
                                ? delegations[address].reduce(function (a, b) { return a + score[b]; }, 0)
                                : 0;
                            return [address, addressScore];
                        }))];
            }
        });
    });
}

var tokenAbi = [
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
function strategy$p(_space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, res, totalSupply, tokenBalanceInUni, tokensPerUni, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, multicall(network, provider, tokenAbi, [
                            [options.uniswapAddress, 'totalSupply', []],
                            [options.tokenAddress, 'balanceOf', [options.uniswapAddress]]
                        ].concat(addresses.map(function (address) { return [
                            options.stakingAddress,
                            'balanceOf',
                            [address]
                        ]; })), { blockTag: blockTag })];
                case 1:
                    res = _a.sent();
                    totalSupply = res[0];
                    tokenBalanceInUni = res[1];
                    tokensPerUni = tokenBalanceInUni / Math.pow(10, options.decimals) / (totalSupply / 1e18);
                    response = res.slice(2);
                    return [2 /*return*/, Object.fromEntries(response.map(function (value, i) { return [
                            addresses[i],
                            (value / Math.pow(10, options.decimals)) * tokensPerUni
                        ]; }))];
            }
        });
    });
}

var abi$a = [
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
var chunk$1 = function (arr, size) {
    return Array.from({ length: Math.ceil(arr.length / size) }, function (v, i) {
        return arr.slice(i * size, i * size + size);
    });
};
function strategy$q(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, doughv1Query, doughv2Query, eDOUGHQuery, stakedDoughQuery, lpDoughQuery, response, doughv2BPT, doughv2BptTotalSupply, responseClean, chunks, doughv1Balances, doughv2Balances, eDOUGHBalances, stakedDoughBalances, lpDoughBalances;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    doughv1Query = addresses.map(function (address) { return [
                        options.doughv1,
                        'balanceOf',
                        [address]
                    ]; });
                    doughv2Query = addresses.map(function (address) { return [
                        options.doughv2,
                        'balanceOf',
                        [address]
                    ]; });
                    eDOUGHQuery = addresses.map(function (address) { return [
                        options.eDOUGH,
                        'balanceOf',
                        [address]
                    ]; });
                    stakedDoughQuery = addresses.map(function (address) { return [
                        options.stakedDough,
                        'balanceOf',
                        [address]
                    ]; });
                    lpDoughQuery = addresses.map(function (address) { return [
                        options.BPT,
                        'balanceOf',
                        [address]
                    ]; });
                    return [4 /*yield*/, multicall(network, provider, abi$a, __spreadArrays([
                            [options.doughv2, 'balanceOf', [options.BPT]],
                            [options.BPT, 'totalSupply']
                        ], doughv1Query, doughv2Query, eDOUGHQuery, stakedDoughQuery, lpDoughQuery), { blockTag: blockTag })];
                case 1:
                    response = _a.sent();
                    doughv2BPT = response[0];
                    doughv2BptTotalSupply = response[1];
                    responseClean = response.slice(2, response.length);
                    chunks = chunk$1(responseClean, addresses.length);
                    doughv1Balances = chunks[0];
                    doughv2Balances = chunks[1];
                    eDOUGHBalances = chunks[2];
                    stakedDoughBalances = chunks[3];
                    lpDoughBalances = chunks[4];
                    return [2 /*return*/, Object.fromEntries(Array(addresses.length)
                            .fill('x')
                            .map(function (_, i) { return [
                            addresses[i],
                            parseFloat(formatUnits(doughv2BPT[0]
                                .mul(stakedDoughBalances[i][0])
                                .div(doughv2BptTotalSupply[0])
                                .add(doughv2BPT[0]
                                .mul(lpDoughBalances[i][0])
                                .div(doughv2BptTotalSupply[0]))
                                .add(doughv1Balances[i][0])
                                .add(doughv2Balances[i][0])
                                .add(eDOUGHBalances[i][0])
                                .toString(), options.decimals))
                        ]; }))];
            }
        });
    });
}

function strategy$r() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
        var addresses, options, snapshot, _a, coeff, receivingAddresses, charitableTransactions, scores, _loop_1, _b, addresses_1, address;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    addresses = args[3], options = args[4], snapshot = args[5];
                    _a = options.coeff, coeff = _a === void 0 ? 1 : _a, receivingAddresses = options.receivingAddresses;
                    return [4 /*yield*/, fetch$1('https://api.anyblock.tools/ethereum/ethereum/mainnet/es/tx/search/', {
                            method: 'POST',
                            body: JSON.stringify({
                                from: 0,
                                size: 10000,
                                query: {
                                    bool: {
                                        must: [
                                            {
                                                bool: {
                                                    should: __spreadArrays(addresses.map(function (a) { return ({
                                                        match: {
                                                            from: a
                                                        }
                                                    }); }))
                                                }
                                            },
                                            {
                                                bool: {
                                                    should: __spreadArrays(receivingAddresses.map(function (a) { return ({
                                                        match: {
                                                            to: a
                                                        }
                                                    }); }))
                                                }
                                            }
                                        ]
                                    }
                                }
                            }),
                            headers: {
                                Authorization: 'Bearer 8c8b3826-afd5-4535-a8be-540562624fbe',
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(function (r) { return r.json(); })
                            .catch(function (e) {
                            console.error('Eth-Received AnyBlock ElasticSearch Query Failed:');
                            throw e;
                        })];
                case 1:
                    charitableTransactions = _c.sent();
                    scores = {};
                    _loop_1 = function (address) {
                        scores[address] = charitableTransactions.hits.hits
                            .filter(function (tx) {
                            var validAddress = tx._source.from.toLowerCase() == address.toLowerCase();
                            return validAddress;
                        })
                            .reduce(function (prev, curr) {
                            return prev + curr._source.value.eth * coeff;
                        }, 0);
                    };
                    for (_b = 0, addresses_1 = addresses; _b < addresses_1.length; _b++) {
                        address = addresses_1[_b];
                        _loop_1(address);
                    }
                    return [2 /*return*/, scores];
            }
        });
    });
}

function strategy$s() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
        var provider, addresses, options, snapshot, _a, coeff, _b, dfuseApiKey, receivingAddresses, contractAddress, decimals, loadJWT, edges, _c, _d, _e, _f, _g, _h, _j, _k, _l, matchingLogs, txLogs, scores, _loop_1, _m, addresses_1, address;
        var _this = this;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    provider = args[2], addresses = args[3], options = args[4], snapshot = args[5];
                    _a = options.coeff, coeff = _a === void 0 ? 1 : _a, _b = options.dfuseApiKey, dfuseApiKey = _b === void 0 ? 'server_806bdc9bb370dad11ec5807e82e57fa0' : _b, receivingAddresses = options.receivingAddresses, contractAddress = options.contractAddress, decimals = options.decimals;
                    loadJWT = function (dfuseApiKey) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, fetch$1('https://auth.dfuse.io/v1/auth/issue', {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ api_key: dfuseApiKey })
                                })
                                    .then(function (r) { return r.json(); })
                                    .then(function (r) { return r.token; })];
                        });
                    }); };
                    _c = fetch$1;
                    _d = ['https://mainnet.eth.dfuse.io/graphql'];
                    _e = {
                        method: 'POST'
                    };
                    _f = {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    };
                    _g = "Bearer ";
                    return [4 /*yield*/, loadJWT(dfuseApiKey)];
                case 1:
                    _e.headers = (_f.Authorization = _g + (_o.sent()),
                        _f);
                    _j = (_h = JSON).stringify;
                    _k = {
                        query: /* GraphQL */ "\n        query(\n          $query: String!\n          $sort: SORT\n          $low: Int64\n          $high: Int64\n          $limit: Int64\n        ) {\n          searchTransactions(\n            indexName: LOGS\n            query: $query\n            sort: $sort\n            lowBlockNum: $low\n            highBlockNum: $high\n            limit: $limit\n          ) {\n            edges {\n              node {\n                matchingLogs {\n                  topics\n                  data\n                }\n              }\n            }\n          }\n        }\n      "
                    };
                    _l = {
                        query: "address: '" + contractAddress + "' topic.0:'Transfer(address,address,uint256)' (" + addresses
                            .map(function (a) { return "topic.1:'" + a + "'"; })
                            .join(' OR ') + ") (" + receivingAddresses
                            .map(function (a) { return "topic.2:'" + a + "'"; })
                            .join(' OR ') + ")",
                        sort: 'ASC',
                        limit: 0
                    };
                    return [4 /*yield*/, provider.getBlockNumber()];
                case 2: return [4 /*yield*/, _c.apply(void 0, _d.concat([(_e.body = _j.apply(_h, [(_k.variables = (_l.high = _o.sent(),
                                _l),
                                _k)]),
                            _e)]))
                        .then(function (r) { return __awaiter(_this, void 0, void 0, function () {
                        var json;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, r.json()];
                                case 1:
                                    json = _a.sent();
                                    if (json.errors)
                                        throw json.errors;
                                    return [2 /*return*/, json];
                            }
                        });
                    }); })
                        .catch(function (e) {
                        console.error(e);
                        throw new Error('Strategy ERC20-Received: Dfuse Query Failed');
                    })];
                case 3:
                    edges = (_o.sent()).data.searchTransactions.edges;
                    matchingLogs = edges.reduce(function (prev, edge) { return __spreadArrays(prev, edge.node.matchingLogs); }, []);
                    txLogs = matchingLogs.map(function (log) {
                        var _a = log.topics.map(function (t) {
                            return t.replace('0x000000000000000000000000', '0x');
                        }), from = _a[1], to = _a[2];
                        var amount = BigNumber.from(log.data);
                        return {
                            from: from,
                            to: to,
                            amount: amount
                        };
                    });
                    scores = {};
                    _loop_1 = function (address) {
                        var logsWithAddress = txLogs.filter(function (log) {
                            var validAddress = log.from.toLowerCase() == address.toLowerCase();
                            return validAddress;
                        });
                        // Sum of all transfers
                        scores[address] = logsWithAddress.reduce(function (prev, curr) {
                            return (prev +
                                parseFloat(formatUnits(curr.amount, BigNumber.from(decimals))) * coeff);
                        }, 0);
                    };
                    for (_m = 0, addresses_1 = addresses; _m < addresses_1.length; _m++) {
                        address = addresses_1[_m];
                        _loop_1(address);
                    }
                    return [2 /*return*/, scores];
            }
        });
    });
}

var ethCharities = [
    ['GiveDirectly', '0xc7464dbcA260A8faF033460622B23467Df5AEA42'],
    ['Unsung.org', '0x02a13ED1805624738Cc129370Fee358ea487B0C6'],
    ['Heifer.org', '0xD3F81260a44A1df7A7269CF66Abd9c7e4f8CdcD1'],
    ['GraceAid.org.uk', '0x236dAA98f115caa9991A3894ae387CDc13eaaD1B'],
    ['SENS.org', '0x542EFf118023cfF2821b24156a507a513Fe93539'],
    ['350.org', '0x50990F09d4f0cb864b8e046e7edC749dE410916b'],
    ['EFF.org', '0xb189f76323678E094D4996d182A792E52369c005'],
    ['WikiLeaks', '0xE96E2181F6166A37EA4C04F6E6E2bD672D72Acc1'],
    ['GiveWell.org', '0x7cF2eBb5Ca55A8bd671A020F8BDbAF07f60F26C1'],
    ['CoolEarth.org', '0x3c8cB169281196737c493AfFA8F49a9d823bB9c5'],
    ['Run2Rescue.org', '0xd17bcbFa6De9E3741aa43Ed32e64696F6a9FA996'],
    ['Archive.org', '0xFA8E3920daF271daB92Be9B87d9998DDd94FEF08']
];
function strategy$t() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
        var space, network, provider, addresses, options, snapshot, _a, coeff;
        return __generator(this, function (_b) {
            space = args[0], network = args[1], provider = args[2], addresses = args[3], options = args[4], snapshot = args[5];
            _a = options.coeff, coeff = _a === void 0 ? 100 : _a;
            return [2 /*return*/, strategy$r(space, network, provider, addresses, {
                    receivingAddresses: ethCharities.map(function (_a) {
                        var name = _a[0], address = _a[1];
                        return address;
                    }),
                    coeff: coeff
                }, snapshot)];
        });
    });
}

var ZERO = BigNumber.from(0);
var ONE = BigNumber.from(1);
var TWO = BigNumber.from(2);
var THREE = BigNumber.from(3);
var squareRoot = function (y) {
    var z = ZERO;
    if (y.gt(THREE)) {
        z = y;
        var x = y.div(TWO).add(ONE);
        while (x.lt(z)) {
            z = x;
            x = y.div(x).add(x).div(TWO);
        }
    }
    else if (!y.isZero()) {
        z = ONE;
    }
    return z;
};
var YEAR = BigNumber.from(31536000); // year in seconds
var ONE_ETHER = BigNumber.from('1000000000000000000');
var MAX_EMISSION_RATE = BigNumber.from('150000000000000000'); // 15%
var calculateEmission = function (deposit, timePassed, sigmoidParams, totalSupplyFactor, totalSupply, totalStaked) {
    var d = timePassed.sub(sigmoidParams.b);
    var personalEmissionRate = ZERO;
    if (d.gt(ZERO)) {
        personalEmissionRate = sigmoidParams.a
            .mul(d)
            .div(squareRoot(d.pow(TWO).add(sigmoidParams.c)));
    }
    var targetTotalStaked = totalSupply.mul(totalSupplyFactor).div(ONE_ETHER);
    var generalEmissionRate = MAX_EMISSION_RATE.div(TWO);
    if (totalStaked.lt(targetTotalStaked)) {
        generalEmissionRate = generalEmissionRate
            .mul(totalStaked)
            .div(targetTotalStaked);
    }
    if (personalEmissionRate.isZero()) {
        generalEmissionRate = ZERO;
    }
    var emissionRate = personalEmissionRate.add(generalEmissionRate);
    var emission = deposit
        .mul(emissionRate)
        .mul(timePassed)
        .div(YEAR.mul(ONE_ETHER));
    return emission;
};

var EASY_STAKING_SUBGRAPH_URL = {
    '1': 'https://api.thegraph.com/subgraphs/name/maxaleks/easy-staking'
};
var ercABI = [
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
function getEasyStakingDeposits(network, addresses, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var params, page, deposits, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {
                        deposits: {
                            __args: {
                                where: {
                                    user_in: addresses.map(function (address) { return address.toLowerCase(); }),
                                    amount_gt: 0
                                },
                                first: 1000,
                                skip: 0
                            },
                            user: true,
                            amount: true,
                            timestamp: true
                        }
                    };
                    if (snapshot !== 'latest') {
                        // @ts-ignore
                        params.deposits.__args.block = { number: snapshot };
                    }
                    page = 0;
                    deposits = [];
                    _a.label = 1;
                case 1:
                    params.deposits.__args.skip = page * 1000;
                    return [4 /*yield*/, subgraphRequest(EASY_STAKING_SUBGRAPH_URL[network], params)];
                case 2:
                    data = _a.sent();
                    deposits = deposits.concat(data.deposits);
                    page++;
                    if (data.deposits.length < 1000)
                        return [3 /*break*/, 3];
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, deposits.map(function (deposit) { return (__assign(__assign({}, deposit), { amount: BigNumber.from(deposit.amount), timestamp: BigNumber.from(deposit.timestamp) })); })];
            }
        });
    });
}
function getEasyStakingParams(network, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var params, commonData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {
                        commonData: {
                            __args: {
                                id: 'common'
                            },
                            sigmoidParamA: true,
                            sigmoidParamB: true,
                            sigmoidParamC: true,
                            totalSupplyFactor: true,
                            totalStaked: true
                        }
                    };
                    if (snapshot !== 'latest') {
                        // @ts-ignore
                        params.commonData.__args.block = { number: snapshot };
                    }
                    return [4 /*yield*/, subgraphRequest(EASY_STAKING_SUBGRAPH_URL[network], params)];
                case 1:
                    commonData = (_a.sent()).commonData;
                    return [2 /*return*/, {
                            sigmoidParameters: {
                                a: BigNumber.from(commonData.sigmoidParamA),
                                b: BigNumber.from(commonData.sigmoidParamB),
                                c: BigNumber.from(commonData.sigmoidParamC)
                            },
                            totalSupplyFactor: BigNumber.from(commonData.totalSupplyFactor),
                            totalStaked: BigNumber.from(commonData.totalStaked)
                        }];
            }
        });
    });
}
function strategy$u(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, easyStakingDeposits, _b, sigmoidParameters, totalSupplyFactor, totalStaked, erc20Score, block, totalSupply;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        getEasyStakingDeposits(network, addresses, snapshot),
                        getEasyStakingParams(network, snapshot),
                        strategy$3(space, network, provider, addresses, options, snapshot),
                        provider.getBlock(snapshot),
                        call(provider, ercABI, [options.address, 'totalSupply', []])
                    ])];
                case 1:
                    _a = _c.sent(), easyStakingDeposits = _a[0], _b = _a[1], sigmoidParameters = _b.sigmoidParameters, totalSupplyFactor = _b.totalSupplyFactor, totalStaked = _b.totalStaked, erc20Score = _a[2], block = _a[3], totalSupply = _a[4];
                    if (!easyStakingDeposits || easyStakingDeposits.length === 0) {
                        return [2 /*return*/, erc20Score];
                    }
                    return [2 /*return*/, Object.fromEntries(Object.entries(erc20Score).map(function (_a) {
                            var address = _a[0], balance = _a[1];
                            var totalBalance = balance;
                            var userDeposits = easyStakingDeposits.filter(function (deposit) { return deposit.user.toLowerCase() === address.toLowerCase(); });
                            userDeposits.forEach(function (deposit) {
                                var timePassed = BigNumber.from(block.timestamp).sub(deposit.timestamp);
                                var emission = calculateEmission(deposit.amount, timePassed, sigmoidParameters, totalSupplyFactor, totalSupply, totalStaked);
                                totalBalance += parseFloat(formatUnits(deposit.amount.add(emission).toString(), options.decimals));
                            });
                            return [address, totalBalance];
                        }))];
            }
        });
    });
}

function strategy$v(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var delegations, score;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDelegations(space, network, provider, addresses, options, snapshot)];
                case 1:
                    delegations = _a.sent();
                    if (Object.keys(delegations).length === 0)
                        return [2 /*return*/, {}];
                    console.debug('Delegations', delegations);
                    return [4 /*yield*/, strategy$u(space, network, provider, Object.values(delegations).reduce(function (a, b) {
                            return a.concat(b);
                        }), options, snapshot)];
                case 2:
                    score = _a.sent();
                    console.debug('Delegators score', score);
                    return [2 /*return*/, Object.fromEntries(addresses.map(function (address) {
                            var addressScore = delegations[address]
                                ? delegations[address].reduce(function (a, b) { return a + score[b]; }, 0)
                                : 0;
                            return [address, addressScore];
                        }))];
            }
        });
    });
}

var abi$b = [
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'earned',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'claimable_reward',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
function strategy$w(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, queries, farms, _loop_1, i, response, n, curveEarned;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    queries = [];
                    // curve farm needs special handling
                    addresses.forEach(function (voter) {
                        queries.push([options.farms.curve.farm, 'claimable_reward', [voter]]);
                    });
                    farms = Object.keys(options.farms).slice(1);
                    _loop_1 = function (i) {
                        var _a = options.farms[farms[i]], farm = _a.farm, lpToken = _a.lpToken;
                        queries.push([options.DFD, 'balanceOf', [lpToken]]);
                        queries.push([lpToken, 'totalSupply']);
                        addresses.forEach(function (voter) {
                            queries.push([farm, 'balanceOf', [voter]]);
                            queries.push([lpToken, 'balanceOf', [voter]]);
                            queries.push([farm, 'earned', [voter]]);
                        });
                    };
                    for (i = 0; i < farms.length; i++) {
                        _loop_1(i);
                    }
                    return [4 /*yield*/, multicall(network, provider, abi$b, queries, { blockTag: blockTag })];
                case 1:
                    response = _a.sent();
                    n = addresses.length;
                    curveEarned = response.slice(0, n).map(function (r) { return r[0]; });
                    response = response.slice(n);
                    return [2 /*return*/, Object.fromEntries(Array(addresses.length)
                            .fill('x')
                            .map(function (_, i) {
                            var score = curveEarned[i];
                            while (response.length) {
                                var res = response.slice(0, 2 + 3 * n).map(function (r) { return r[0]; }); // 2 + 3n queries for each farm
                                response = response.slice(2 + 3 * n);
                                /*
                                  lpTokenBalance = farm.balanceOf(user) + lpToken.balanceOf(user)
                                  staked = (dfd.balanceOf(lpToken) * lpTokenBalance) / lpToken.totalSupply()
                                  earned = farm.earned(user)
                                  score = staked + earned
                                */
                                var start = 2 + 3 * i;
                                var lpTokenBalance = res[start].add(res[start + 1]);
                                var staked = res[0].mul(lpTokenBalance).div(res[1]);
                                var earned = res[start + 2];
                                score = score.add(staked).add(earned);
                            }
                            return [
                                addresses[i],
                                parseFloat(formatUnits(score.toString(), 18 /* decimals */))
                            ];
                        }))];
            }
        });
    });
}

var tokenAbi$1 = [
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: '_account',
                type: 'address'
            }
        ],
        name: 'staked',
        outputs: [
            {
                internalType: 'uint256',
                name: 'ghst_',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'uniV2PoolTokens_',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
function strategy$x(_space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, res, totalSupply, tokenBalanceInUni, tokensPerUni, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, multicall(network, provider, tokenAbi$1, [
                            [options.uniswapAddress, 'totalSupply', []],
                            [options.tokenAddress, 'balanceOf', [options.uniswapAddress]]
                        ].concat(addresses.map(function (address) { return [
                            options.stakingAddress,
                            'staked',
                            [address]
                        ]; })), { blockTag: blockTag })];
                case 1:
                    res = _a.sent();
                    totalSupply = res[0];
                    tokenBalanceInUni = res[1];
                    tokensPerUni = tokenBalanceInUni / Math.pow(10, options.decimals) / (totalSupply / 1e18);
                    response = res.slice(2);
                    return [2 /*return*/, Object.fromEntries(response.map(function (values, i) { return [
                            addresses[i],
                            //ghst_, uniV2PoolTokens
                            values[0] / 1e18 + (values[1] / Math.pow(10, options.decimals)) * tokensPerUni
                        ]; }))];
            }
        });
    });
}

var abi$c = [
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    }
];
function strategy$y(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, response, misPerLP, lpBalances, stakedLpBalances, tokenBalances, boardroomBalances;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, multicall(network, provider, abi$c, __spreadArrays([
                            [options.token, 'balanceOf', [options.sushiswap]],
                            [options.sushiswap, 'totalSupply']
                        ], addresses.map(function (address) { return [
                            options.sushiswap,
                            'balanceOf',
                            [address]
                        ]; }), addresses.map(function (address) { return [
                            options.sharePool,
                            'balanceOf',
                            [address]
                        ]; }), addresses.map(function (address) { return [
                            options.token,
                            'balanceOf',
                            [address]
                        ]; }), addresses.map(function (address) { return [
                            options.boardroom,
                            'balanceOf',
                            [address]
                        ]; })), { blockTag: blockTag })];
                case 1:
                    response = _a.sent();
                    misPerLP = parseUnits(response[0][0].toString(), 18).div(response[1][0]);
                    lpBalances = response.slice(2, addresses.length + 2);
                    stakedLpBalances = response.slice(addresses.length + 2, addresses.length * 2 + 2);
                    tokenBalances = response.slice(addresses.length * 2 + 2, addresses.length * 3 + 2);
                    boardroomBalances = response.slice(addresses.length * 3 + 2, addresses.length * 4 + 2);
                    return [2 /*return*/, Object.fromEntries(Array(addresses.length)
                            .fill('')
                            .map(function (_, i) {
                            var lpBalance = lpBalances[i][0].add(stakedLpBalances[i][0]);
                            var misLpBalance = lpBalance.mul(misPerLP).div(parseUnits('1', 18));
                            return [
                                addresses[i],
                                parseFloat(formatUnits(misLpBalance
                                    .add(tokenBalances[i][0])
                                    .add(boardroomBalances[i][0]), options.decimals))
                            ];
                        }))];
            }
        });
    });
}

var Multicaller = /** @class */ (function () {
    function Multicaller(network, provider, abi, options) {
        this.options = {};
        this.calls = [];
        this.paths = [];
        this.network = network;
        this.provider = provider;
        this.abi = abi;
        this.options = options || {};
    }
    Multicaller.prototype.call = function (path, address, fn, params) {
        this.calls.push([address, fn, params]);
        this.paths.push(path);
        return this;
    };
    Multicaller.prototype.execute = function (from) {
        return __awaiter(this, void 0, void 0, function () {
            var obj, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        obj = from || {};
                        return [4 /*yield*/, multicall(this.network, this.provider, this.abi, this.calls, this.options)];
                    case 1:
                        result = _a.sent();
                        this.paths.forEach(function (path, i) { return set(obj, path, result[i][0]); });
                        this.calls = [];
                        this.paths = [];
                        return [2 /*return*/, obj];
                }
            });
        });
    };
    return Multicaller;
}());

var abi$d = [
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: 'addr',
                type: 'address'
            }
        ],
        name: 'totalStakedFor',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
function strategy$z(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, multi, result, dittoPerLP;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    multi = new Multicaller(network, provider, abi$d, { blockTag: blockTag });
                    multi.call('pancakeBalance', options.token, 'balanceOf', [options.pancake]);
                    multi.call('pancakeTotalSupply', options.pancake, 'totalSupply');
                    addresses.forEach(function (address) {
                        multi.call("scores." + address + ".totalStaked", options.sharePool, 'totalStakedFor', [address]);
                        multi.call("scores." + address + ".pancake", options.pancake, 'balanceOf', [
                            address
                        ]);
                        multi.call("scores." + address + ".balance", options.token, 'balanceOf', [
                            address
                        ]);
                    });
                    return [4 /*yield*/, multi.execute()];
                case 1:
                    result = _a.sent();
                    dittoPerLP = result.pancakeBalance;
                    return [2 /*return*/, Object.fromEntries(Array(addresses.length)
                            .fill('')
                            .map(function (_, i) {
                            var lpBalances = result.scores[addresses[i]].pancake;
                            var stakedLpBalances = result.scores[addresses[i]].totalStaked;
                            var tokenBalances = result.scores[addresses[i]].balance;
                            var lpBalance = lpBalances.add(stakedLpBalances);
                            var dittoLpBalance = lpBalance
                                .mul(dittoPerLP)
                                .div(parseUnits('1', 18));
                            return [
                                addresses[i],
                                parseFloat(formatUnits(dittoLpBalance.add(tokenBalances), options.decimals))
                            ];
                        }))];
            }
        });
    });
}

// Merged ABIs from below contracts:
// * BPool from Balancer-labs: https://github.com/balancer-labs/balancer-core/blob/master/contracts/BPool.sol
// * Unipool contract from @k06a: https://github.com/k06a/Unipool/blob/master/contracts/Unipool.sol
var contractAbi = [
    {
        constant: true,
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'earned',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'getBalance',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
function bn(num) {
    return BigNumber.from(num.toString());
}
function strategy$A(_space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, res, totalBPTsInBPool, totalTokensInBPool, tokensPerBPT, userTokensFromBPTList, userEarnedTokensList, sumList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, multicall(network, provider, contractAbi, __spreadArrays([
                            [options.bpoolAddress, 'totalSupply', []],
                            [options.bpoolAddress, 'getBalance', [options.tokenAddress]]
                        ], addresses.map(function (address) { return [
                            options.unipoolAddress,
                            'balanceOf',
                            [address]
                        ]; }), addresses.map(function (address) { return [
                            options.unipoolAddress,
                            'earned',
                            [address]
                        ]; })), { blockTag: blockTag })];
                case 1:
                    res = _a.sent();
                    totalBPTsInBPool = bn(res[0]);
                    totalTokensInBPool = bn(res[1]);
                    tokensPerBPT = totalTokensInBPool.div(totalBPTsInBPool);
                    res = res.slice(2);
                    userTokensFromBPTList = res.slice(0, addresses.length).map(function (num) {
                        var userBPTs = bn(num); // decimal: 18
                        return userBPTs.mul(tokensPerBPT); // decimal: options.decimal
                    });
                    userEarnedTokensList = res.slice(addresses.length).map(function (num) {
                        return bn(num); // decimal: options.decimal
                    });
                    sumList = userTokensFromBPTList.map(function (userTokensFromBPT, i) {
                        return userTokensFromBPT.add(userEarnedTokensList[i]);
                    });
                    return [2 /*return*/, Object.fromEntries(sumList.map(function (sum, i) {
                            var parsedSum = parseFloat(formatUnits(sum, options.decimal));
                            return [addresses[i], parsedSum];
                        }))];
            }
        });
    });
}

var SUSHISWAP_SUBGRAPH_URL = {
    '1': 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange'
};
function strategy$B(_space, network, _provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var params, tokenAddress, result, score;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {
                        users: {
                            __args: {
                                where: {
                                    id_in: addresses.map(function (address) { return address.toLowerCase(); })
                                },
                                first: 1000
                            },
                            id: true,
                            liquidityPositions: {
                                __args: {
                                    where: {
                                        liquidityTokenBalance_gt: 0
                                    }
                                },
                                liquidityTokenBalance: true,
                                pair: {
                                    id: true,
                                    token0: {
                                        id: true
                                    },
                                    reserve0: true,
                                    token1: {
                                        id: true
                                    },
                                    reserve1: true,
                                    totalSupply: true
                                }
                            }
                        }
                    };
                    if (snapshot !== 'latest') {
                        // @ts-ignore
                        params.users.liquidityPositions.__args.block = { number: snapshot };
                    }
                    tokenAddress = options.address.toLowerCase();
                    return [4 /*yield*/, subgraphRequest(SUSHISWAP_SUBGRAPH_URL[network], params)];
                case 1:
                    result = _a.sent();
                    score = {};
                    if (result && result.users) {
                        result.users.forEach(function (u) {
                            u.liquidityPositions
                                .filter(function (lp) {
                                return lp.pair.token0.id == tokenAddress ||
                                    lp.pair.token1.id == tokenAddress;
                            })
                                .forEach(function (lp) {
                                var token0perUni = lp.pair.reserve0 / lp.pair.totalSupply;
                                var token1perUni = lp.pair.reserve1 / lp.pair.totalSupply;
                                var userScore = lp.pair.token0.id == tokenAddress
                                    ? token0perUni * lp.liquidityTokenBalance
                                    : token1perUni * lp.liquidityTokenBalance;
                                var userAddress = getAddress(u.id);
                                if (!score[userAddress])
                                    score[userAddress] = 0;
                                score[userAddress] = score[userAddress] + userScore;
                            });
                        });
                    }
                    return [2 /*return*/, score || {}];
            }
        });
    });
}

var MASTERCHEF_SUBGRAPH_URL = {
    '1': 'https://api.thegraph.com/subgraphs/name/sushiswap/master-chef'
};
var SUSHISWAP_SUBGRAPH_URL$1 = {
    '1': 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange'
};
function strategy$C(_space, network, _provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenAddress, sushiPools0Params, sushiPools1Params, sushiPools0Result, sushiPools1Result, allSushiPools, pools, masterchefParams, masterchefResult, one_gwei, stakedBalances, score, pair_1, token0perUni_1, token1perUni_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tokenAddress = options.address.toLowerCase();
                    sushiPools0Params = {
                        pairs: {
                            __args: {
                                where: {
                                    token0: tokenAddress
                                },
                                first: 100
                            },
                            id: true,
                            token0: {
                                id: true
                            },
                            reserve0: true,
                            token1: {
                                id: true
                            },
                            reserve1: true,
                            totalSupply: true
                        }
                    };
                    sushiPools1Params = {
                        pairs: {
                            __args: {
                                where: {
                                    token1: tokenAddress
                                },
                                first: 100
                            },
                            id: true,
                            token0: {
                                id: true
                            },
                            reserve0: true,
                            token1: {
                                id: true
                            },
                            reserve1: true,
                            totalSupply: true
                        }
                    };
                    if (snapshot !== 'latest') {
                        // @ts-ignore
                        sushiPools0Params.pairs.__args.block = { number: snapshot };
                        // @ts-ignore
                        sushiPools1Params.pairs.__args.block = { number: snapshot };
                    }
                    return [4 /*yield*/, subgraphRequest(SUSHISWAP_SUBGRAPH_URL$1[network], sushiPools0Params)];
                case 1:
                    sushiPools0Result = _a.sent();
                    return [4 /*yield*/, subgraphRequest(SUSHISWAP_SUBGRAPH_URL$1[network], sushiPools1Params)];
                case 2:
                    sushiPools1Result = _a.sent();
                    if (!sushiPools0Result || !sushiPools1Result) {
                        return [2 /*return*/];
                    }
                    allSushiPools = sushiPools0Result.pairs.concat(sushiPools1Result.pairs);
                    pools = allSushiPools.map(function (_a) {
                        var id = _a.id;
                        return id.toLowerCase();
                    });
                    masterchefParams = {
                        pools: {
                            __args: {
                                where: {
                                    pair_in: pools
                                },
                                first: 100
                            },
                            id: true,
                            pair: true,
                            users: {
                                __args: {
                                    where: {
                                        amount_gt: 0,
                                        address_in: addresses.map(function (address) { return address.toLowerCase(); })
                                    }
                                },
                                address: true,
                                amount: true
                            }
                        }
                    };
                    if (snapshot !== 'latest') {
                        // @ts-ignore
                        masterchefParams.pools.__args.block = { number: snapshot };
                    }
                    return [4 /*yield*/, subgraphRequest(MASTERCHEF_SUBGRAPH_URL[network], masterchefParams)];
                case 3:
                    masterchefResult = _a.sent();
                    one_gwei = BigNumber.from(10).pow(9);
                    stakedBalances = [];
                    if (masterchefResult && masterchefResult.pools.length == 1) {
                        stakedBalances = masterchefResult.pools[0].users.map(function (u) {
                            return {
                                address: u.address,
                                amount: u.amount
                            };
                        });
                    }
                    score = {};
                    if (allSushiPools && allSushiPools.length > 0) {
                        pair_1 = allSushiPools.filter(function (_a) {
                            var id = _a.id;
                            return id == masterchefResult.pools[0].pair;
                        })[0];
                        console.log(pair_1);
                        token0perUni_1 = pair_1.reserve0 / pair_1.totalSupply;
                        token1perUni_1 = pair_1.reserve1 / pair_1.totalSupply;
                        stakedBalances.forEach(function (u) {
                            var userScore = (u.amount / one_gwei.toNumber()) *
                                (pair_1.token0.id == tokenAddress ? token0perUni_1 : token1perUni_1);
                            var userScoreInEther = userScore / one_gwei.toNumber();
                            var userAddress = getAddress(u.address);
                            if (!score[userAddress])
                                score[userAddress] = 0;
                            score[userAddress] = score[userAddress] + userScoreInEther;
                        });
                    }
                    return [2 /*return*/, score || {}];
            }
        });
    });
}

var abi$e = [
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            },
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'userInfo',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'rewardDebt',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'poolsInfo',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    }
];
function strategy$D(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, multi, result, parseRes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    multi = new Multicaller(network, provider, abi$e, { blockTag: blockTag });
                    addresses.forEach(function (address) {
                        multi.call("stax." + address, options.stax.address, 'balanceOf', [address]);
                        multi.call("stakingChef." + address, options.stakingchef.address, 'poolsInfo', [address]);
                        options.pools.forEach(function (pool) {
                            multi.call("masterChef." + address + ".pool_" + pool.poolId, options.masterchef.address, 'userInfo', [pool.poolId, address]);
                        });
                    });
                    return [4 /*yield*/, multi.execute()];
                case 1:
                    result = _a.sent();
                    parseRes = function (elem, decimals) {
                        return parseFloat(formatUnits(elem, decimals));
                    };
                    return [2 /*return*/, Object.fromEntries(addresses.map(function (address) { return [
                            address,
                            parseRes(result.stax[address], options.stax.decimals) * 1 +
                                parseRes(result.stakingChef[address], options.stakingchef.decimals) *
                                    options.stakingchef.weightage +
                                +options.pools.reduce(function (prev, pool, idx) {
                                    return prev +
                                        parseRes(result.masterChef[address]["pool_" + pool.poolId], options.masterchef.decimals) *
                                            pool.weightage;
                                }, 0)
                        ]; }))];
            }
        });
    });
}

var KEEP_SUBGRAPH_URL = {
    '1': 'https://api.thegraph.com/subgraphs/name/miracle2k/all-the-keeps'
};
function strategy$E(_space, network, _provider, addresses, _options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var params, result, score;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {
                        operators: {
                            __args: {
                                where: {
                                    owner_in: addresses.map(function (address) { return address.toLowerCase(); })
                                },
                                first: 1000
                            },
                            owner: true,
                            stakedAmount: true
                        }
                    };
                    if (snapshot !== 'latest') {
                        // @ts-ignore
                        params.operators.__args.block = { number: snapshot };
                    }
                    return [4 /*yield*/, subgraphRequest(KEEP_SUBGRAPH_URL[network], params)];
                case 1:
                    result = _a.sent();
                    score = {};
                    if (result && result.operators) {
                        result.operators.forEach(function (op) {
                            var userAddress = getAddress(op.owner);
                            if (!score[userAddress])
                                score[userAddress] = 0;
                            score[userAddress] = score[userAddress] + Number(op.stakedAmount);
                        });
                    }
                    return [2 /*return*/, score];
            }
        });
    });
}

var abi$f = [
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    }
];
function strategy$F(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, multi, result, phoonPerMicLP, phoonPerUsdtLP;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    multi = new Multicaller(network, provider, abi$f, { blockTag: blockTag });
                    multi.call('micLP.phoon', options.token, 'balanceOf', [options.micLP]);
                    multi.call('micLP.totalSupply', options.micLP, 'totalSupply');
                    multi.call('usdtLP.phoon', options.token, 'balanceOf', [options.usdtLP]);
                    multi.call('usdtLP.totalSupply', options.usdtLP, 'totalSupply');
                    addresses.forEach(function (address) {
                        multi.call("balance." + address, options.token, 'balanceOf', [address]);
                        multi.call("micLP." + address + ".balance", options.micLP, 'balanceOf', [
                            address
                        ]);
                        multi.call("micLP." + address + ".staked", options.micRewardPool, 'balanceOf', [
                            address
                        ]);
                        multi.call("usdtLP." + address + ".balance", options.usdtLP, 'balanceOf', [
                            address
                        ]);
                        multi.call("usdtLP." + address + ".staked", options.usdtRewardPool, 'balanceOf', [address]);
                    });
                    return [4 /*yield*/, multi.execute()];
                case 1:
                    result = _a.sent();
                    phoonPerMicLP = parseUnits(result.micLP.phoon.toString(), 18).div(result.micLP.totalSupply);
                    phoonPerUsdtLP = parseUnits(result.usdtLP.phoon.toString(), 18).div(result.usdtLP.totalSupply);
                    return [2 /*return*/, Object.fromEntries(Array(addresses.length)
                            .fill('')
                            .map(function (_, i) {
                            var micPhoon = result.micLP[addresses[i]].balance
                                .add(result.micLP[addresses[i]].staked)
                                .mul(phoonPerMicLP)
                                .div(parseUnits('1', 18));
                            var usdtPhoon = result.usdtLP[addresses[i]].balance
                                .add(result.usdtLP[addresses[i]].staked)
                                .mul(phoonPerUsdtLP)
                                .div(parseUnits('1', 18));
                            var score = result.balance[addresses[i]].add(micPhoon).add(usdtPhoon);
                            return [addresses[i], parseFloat(formatUnits(score, 18))];
                        }))];
            }
        });
    });
}

function strategy$G(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var delegations, scores;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDelegations(space, network, provider, addresses, options, snapshot)];
                case 1:
                    delegations = _a.sent();
                    if (Object.keys(delegations).length === 0)
                        return [2 /*return*/, {}];
                    return [4 /*yield*/, getScores(space, options.strategies, network, provider, Object.values(delegations).reduce(function (a, b) {
                            return a.concat(b);
                        }), snapshot)];
                case 2:
                    scores = _a.sent();
                    return [2 /*return*/, Object.fromEntries(addresses.map(function (address) {
                            var addressScore = delegations[address]
                                ? delegations[address].reduce(function (a, b) { return a + scores.reduce(function (x, y) { return x + y[b] || 0; }, 0); }, 0)
                                : 0;
                            return [address, addressScore];
                        }))];
            }
        });
    });
}

function strategy$H(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, Object.fromEntries(addresses.map(function (address) { return [address, 1]; }))];
        });
    });
}

var abi$g = [
    {
        inputs: [{ internalType: 'address', name: '_address', type: 'address' }],
        name: 'isWhitelisted',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'stakes',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    }
];
function strategy$I(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, multi, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    multi = new Multicaller(network, provider, abi$g, { blockTag: blockTag });
                    addresses.forEach(function (address) {
                        multi.call(address + ".isWhitelisted", options.whitelist, 'isWhitelisted', [
                            address
                        ]);
                        multi.call(address + ".stake", options.stake, 'stakes', [address]);
                    });
                    return [4 /*yield*/, multi.execute()];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, Object.fromEntries(addresses.map(function (address) {
                            var stake = parseFloat(formatUnits(result[address].stake.toString(), options.decimals));
                            return [
                                address,
                                result[address].isWhitelisted ? Math.sqrt(stake) + 1 : 0
                            ];
                        }))];
            }
        });
    });
}

function strategy$J(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var score;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, strategy$3(space, network, provider, addresses, options, snapshot)];
                case 1:
                    score = _a.sent();
                    return [2 /*return*/, Object.fromEntries(Object.entries(score).map(function (address) { return [
                            address[0],
                            address[1] > (options.min || 0) ? 1 : 0
                        ]; }))];
            }
        });
    });
}

var DECIMALS$1 = 18;
var abi$h = [
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
var chunk$2 = function (arr, size) {
    return Array.from({ length: Math.ceil(arr.length / size) }, function (v, i) {
        return arr.slice(i * size, i * size + size);
    });
};
function strategy$K(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, opiumQuery, wOpiumQuery, lp1inchOpiumEthQuery, farmingLp1inchOpiumEthQuery, response, opiumLp1inchOpiumEth, opiumLp1inchOpiumEthTotalSupply, responseClean, chunks, opiumBalances, wOpiumBalances, lp1inchOpiumEthBalances, farmingLp1inchOpiumEthBalances;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    opiumQuery = addresses.map(function (address) { return [
                        options.OPIUM,
                        'balanceOf',
                        [address]
                    ]; });
                    wOpiumQuery = addresses.map(function (address) { return [
                        options.wOPIUM,
                        'balanceOf',
                        [address]
                    ]; });
                    lp1inchOpiumEthQuery = addresses.map(function (address) { return [
                        options.LP_1INCH_OPIUM_ETH,
                        'balanceOf',
                        [address]
                    ]; });
                    farmingLp1inchOpiumEthQuery = addresses.map(function (address) { return [
                        options.FARMING_LP_1INCH_OPIUM_ETH,
                        'balanceOf',
                        [address]
                    ]; });
                    return [4 /*yield*/, multicall(network, provider, abi$h, __spreadArrays([
                            // Get 1inch LP OPIUM-ETH balance of OPIUM
                            [options.OPIUM, 'balanceOf', [options.LP_1INCH_OPIUM_ETH]],
                            // Get total supply of 1inch LP OPIUM-ETH
                            [options.LP_1INCH_OPIUM_ETH, 'totalSupply']
                        ], opiumQuery, wOpiumQuery, lp1inchOpiumEthQuery, farmingLp1inchOpiumEthQuery), { blockTag: blockTag })];
                case 1:
                    response = _a.sent();
                    opiumLp1inchOpiumEth = response[0];
                    opiumLp1inchOpiumEthTotalSupply = response[1];
                    responseClean = response.slice(2, response.length);
                    chunks = chunk$2(responseClean, addresses.length);
                    opiumBalances = chunks[0];
                    wOpiumBalances = chunks[1];
                    lp1inchOpiumEthBalances = chunks[2];
                    farmingLp1inchOpiumEthBalances = chunks[3];
                    return [2 /*return*/, Object.fromEntries(Array(addresses.length)
                            .fill('x')
                            .map(function (_, i) { return [
                            addresses[i],
                            parseFloat(formatUnits(
                            // OPIUM
                            opiumBalances[i][0]
                                // wOPIUM
                                .add(wOpiumBalances[i][0])
                                // LP 1inch OPIUM-ETH + farming
                                .add(opiumLp1inchOpiumEth[0]
                                .mul(lp1inchOpiumEthBalances[i][0].add(farmingLp1inchOpiumEthBalances[i][0]))
                                .div(opiumLp1inchOpiumEthTotalSupply[0]))
                                .toString(), DECIMALS$1))
                        ]; }))];
            }
        });
    });
}

var TOKEN_DISTRIBUTION_SUBGRAPH_URL = {
    '1': 'https://api.thegraph.com/subgraphs/name/graphprotocol/token-distribution',
    '4': 'https://api.thegraph.com/subgraphs/name/davekaj/token-distribution-rinkeby'
};
/*
  @dev  Takes all options from snapshot
        Queries the subgraph to find if an address owns any token lock wallets
  @returns  An object with the beneficiaries as keys and TLWs as values in an array
*/
function getTokenLockWallets(_space, network, _provider, addresses, _options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenLockParams, result, tokenLockWallets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tokenLockParams = {
                        tokenLockWallets: {
                            __args: {
                                where: {
                                    beneficiary_in: addresses
                                },
                                first: 1000
                            },
                            id: true,
                            beneficiary: true
                        }
                    };
                    if (snapshot !== 'latest') {
                        // @ts-ignore
                        tokenLockParams.graphAccounts.__args.block = { number: snapshot };
                    }
                    return [4 /*yield*/, subgraphRequest(TOKEN_DISTRIBUTION_SUBGRAPH_URL[network], tokenLockParams)];
                case 1:
                    result = _a.sent();
                    tokenLockWallets = {};
                    if (result && result.tokenLockWallets) {
                        result.tokenLockWallets.forEach(function (tw) {
                            if (tokenLockWallets[tw.beneficiary] == undefined)
                                tokenLockWallets[tw.beneficiary] = [];
                            tokenLockWallets[tw.beneficiary] = tokenLockWallets[tw.beneficiary].concat(tw.id);
                        });
                    }
                    return [2 /*return*/, tokenLockWallets || {}];
            }
        });
    });
}

var GRAPH_NETWORK_SUBGRAPH_URL = {
    '1': 'https://api.thegraph.com/subgraphs/name/graphprotocol/graph-network-mainnet',
    '4': 'https://api.thegraph.com/subgraphs/name/graphprotocol/graph-network-testnet'
};
var WEI = '1000000000000000000';
// Pass in a BigDecimal and BigNumber from a subgraph query, and return the multiplication of
// them as a BigNumber
function bdMulBn(bd, bn) {
    var splitDecimal = bd.split('.');
    var split;
    // Truncate the BD so it can be converted to a BN (no decimals) when multiplied by WEI
    if (splitDecimal.length > 1) {
        split = splitDecimal[0] + "." + splitDecimal[1].slice(0, 18);
    }
    // Convert it to BN
    var bdWithWEI = parseUnits(split, 18);
    // Multiple, then divide by WEI to have it back in BN
    return BigNumber.from(bn).mul(bdWithWEI).div(BigNumber.from(WEI));
}
function calcNonStakedTokens(totalSupply, totalTokensStaked, totalDelegatedTokens) {
    return BigNumber.from(totalSupply)
        .sub(BigNumber.from(totalTokensStaked))
        .sub(BigNumber.from(totalDelegatedTokens))
        .div(BigNumber.from(WEI))
        .toNumber();
}

function balanceStrategy(_space, network, _provider, addresses, _options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var balanceParams, result, score;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    balanceParams = {
                        graphAccounts: {
                            __args: {
                                where: {
                                    id_in: addresses
                                },
                                first: 1000
                            },
                            id: true,
                            balance: true
                        }
                    };
                    if (snapshot !== 'latest') {
                        // @ts-ignore
                        balanceParams.graphAccounts.__args.block = { number: snapshot };
                    }
                    return [4 /*yield*/, subgraphRequest(GRAPH_NETWORK_SUBGRAPH_URL[network], balanceParams)];
                case 1:
                    result = _a.sent();
                    score = {};
                    // console.log('Result: ', JSON.stringify(result, null, 2));
                    // No normalization factor for balances. 1 GRT in wallet is the baseline to compare
                    // Delegators and Indexers to.
                    if (result && result.graphAccounts) {
                        // Must iterate on addresses since the query can return nothing for a beneficiary that has
                        // only interacted through token lock wallets
                        addresses.forEach(function (a) {
                            var balanceScore = 0;
                            for (var i = 0; i < result.graphAccounts.length; i++) {
                                if (result.graphAccounts[i].id == a) {
                                    balanceScore = BigNumber.from(result.graphAccounts[i].balance)
                                        .div(BigNumber.from(WEI))
                                        .toNumber();
                                    break;
                                }
                            }
                            score[a] = balanceScore;
                        });
                    }
                    return [2 /*return*/, score || {}];
            }
        });
    });
}

function indexersStrategy(_space, network, _provider, addresses, _options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var indexersParams, result, score, normalizationFactor, nonStakedTokens;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    indexersParams = {
                        graphAccounts: {
                            __args: {
                                where: {
                                    id_in: addresses
                                },
                                first: 1000
                            },
                            id: true,
                            indexer: {
                                stakedTokens: true
                            }
                        },
                        graphNetworks: {
                            totalSupply: true,
                            totalDelegatedTokens: true,
                            totalTokensStaked: true
                        }
                    };
                    if (snapshot !== 'latest') {
                        // @ts-ignore
                        indexersParams.graphAccounts.__args.block = { number: snapshot };
                    }
                    return [4 /*yield*/, subgraphRequest(GRAPH_NETWORK_SUBGRAPH_URL[network], indexersParams)];
                case 1:
                    result = _a.sent();
                    score = {};
                    console.log('Result: ', JSON.stringify(result, null, 2));
                    normalizationFactor = 0;
                    if (result && result.graphNetworks) {
                        nonStakedTokens = calcNonStakedTokens(result.graphNetworks[0].totalSupply, result.graphNetworks[0].totalTokensStaked, result.graphNetworks[0].totalDelegatedTokens);
                        normalizationFactor =
                            nonStakedTokens /
                                BigNumber.from(result.graphNetworks[0].totalTokensStaked)
                                    .div(BigNumber.from(WEI))
                                    .toNumber();
                    }
                    console.log('Normalization Factor for Indexers: ', normalizationFactor);
                    if (result && result.graphAccounts) {
                        addresses.forEach(function (a) {
                            var indexerScore = 0;
                            for (var i = 0; i < result.graphAccounts.length; i++) {
                                if (result.graphAccounts[i].id == a) {
                                    if (result.graphAccounts[i].indexer != null) {
                                        var indexerTokens = BigNumber.from(result.graphAccounts[i].indexer.stakedTokens);
                                        indexerScore =
                                            indexerTokens.div(BigNumber.from(WEI)).toNumber() *
                                                normalizationFactor;
                                    }
                                    break;
                                }
                            }
                            score[a] = indexerScore;
                        });
                    }
                    return [2 /*return*/, score || {}];
            }
        });
    });
}

function delegatorsStrategy(_space, network, _provider, addresses, _options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var delegatorsParams, result, score, normalizationFactor, nonStakedTokens;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    delegatorsParams = {
                        graphAccounts: {
                            __args: {
                                where: {
                                    id_in: addresses
                                },
                                first: 1000
                            },
                            id: true,
                            delegator: {
                                stakes: {
                                    shareAmount: true,
                                    lockedTokens: true,
                                    indexer: {
                                        delegationExchangeRate: true
                                    }
                                }
                            }
                        },
                        graphNetworks: {
                            totalSupply: true,
                            totalDelegatedTokens: true,
                            totalTokensStaked: true
                        }
                    };
                    if (snapshot !== 'latest') {
                        // @ts-ignore
                        delegatorsParams.graphAccounts.__args.block = { number: snapshot };
                    }
                    return [4 /*yield*/, subgraphRequest(GRAPH_NETWORK_SUBGRAPH_URL[network], delegatorsParams)];
                case 1:
                    result = _a.sent();
                    score = {};
                    normalizationFactor = 0;
                    if (result && result.graphNetworks) {
                        nonStakedTokens = calcNonStakedTokens(result.graphNetworks[0].totalSupply, result.graphNetworks[0].totalTokensStaked, result.graphNetworks[0].totalDelegatedTokens);
                        normalizationFactor =
                            nonStakedTokens /
                                BigNumber.from(result.graphNetworks[0].totalDelegatedTokens)
                                    .div(BigNumber.from(WEI))
                                    .toNumber();
                    }
                    console.log('Normalization Factor for Delegators: ', normalizationFactor);
                    if (result && result.graphAccounts) {
                        addresses.forEach(function (a) {
                            var delegationScore = 0;
                            for (var i = 0; i < result.graphAccounts.length; i++) {
                                if (result.graphAccounts[i].id == a) {
                                    if (result.graphAccounts[i].delegator != null) {
                                        result.graphAccounts[i].delegator.stakes.forEach(function (s) {
                                            var delegatedTokens = bdMulBn(s.indexer.delegationExchangeRate, s.shareAmount);
                                            var lockedTokens = BigNumber.from(s.lockedTokens);
                                            delegationScore = delegatedTokens
                                                .add(lockedTokens)
                                                .div(BigNumber.from(WEI))
                                                .toNumber();
                                            delegationScore = delegationScore * normalizationFactor;
                                        });
                                    }
                                }
                            }
                            score[a] = delegationScore;
                        });
                    }
                    return [2 /*return*/, score || {}];
            }
        });
    });
}

function baseStrategy(_space, network, _provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenLockWallets, allAccounts, beneficiary, scores, combinedScores, _loop_1, _i, addresses_1, account;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    addresses = addresses.map(function (address) { return address.toLowerCase(); });
                    return [4 /*yield*/, getTokenLockWallets(_space, network, _provider, addresses, options, snapshot)];
                case 1:
                    tokenLockWallets = _a.sent();
                    allAccounts = __spreadArrays(addresses);
                    for (beneficiary in tokenLockWallets) {
                        tokenLockWallets[beneficiary].forEach(function (tw) {
                            allAccounts.push(tw);
                        });
                    }
                    scores = {};
                    if (!(options.strategyType == 'balance')) return [3 /*break*/, 3];
                    return [4 /*yield*/, balanceStrategy(_space, network, _provider, allAccounts, options, snapshot)];
                case 2:
                    scores = _a.sent();
                    return [3 /*break*/, 8];
                case 3:
                    if (!(options.strategyType == 'delegation')) return [3 /*break*/, 5];
                    return [4 /*yield*/, delegatorsStrategy(_space, network, _provider, allAccounts, options, snapshot)];
                case 4:
                    scores = _a.sent();
                    return [3 /*break*/, 8];
                case 5:
                    if (!(options.strategyType == 'indexing')) return [3 /*break*/, 7];
                    return [4 /*yield*/, indexersStrategy(_space, network, _provider, allAccounts, options, snapshot)];
                case 6:
                    scores = _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    console.error('ERROR: Strategy does not exist');
                    _a.label = 8;
                case 8:
                    console.log(options.strategyType + " SCORE: ", scores);
                    combinedScores = {};
                    _loop_1 = function (account) {
                        var accountScore = scores[account];
                        // It was found that this beneficiary has token lock wallets, lets add them
                        if (tokenLockWallets[account] != null) {
                            tokenLockWallets[account].forEach(function (tw) {
                                accountScore = accountScore + scores[tw];
                            });
                        }
                        combinedScores[account] = accountScore;
                    };
                    for (_i = 0, addresses_1 = addresses; _i < addresses_1.length; _i++) {
                        account = addresses_1[_i];
                        _loop_1(account);
                    }
                    return [2 /*return*/, combinedScores];
            }
        });
    });
}

function strategy$L(_space, network, _provider, addresses, _options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, baseStrategy(_space, network, _provider, addresses, _options, snapshot)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}

function strategy$M(_space, network, _provider, addresses, _options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, baseStrategy(_space, network, _provider, addresses, _options, snapshot)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}

function strategy$N(_space, network, _provider, addresses, _options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, baseStrategy(_space, network, _provider, addresses, _options, snapshot)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}

function strategy$O(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var whitelist;
        return __generator(this, function (_a) {
            whitelist = options === null || options === void 0 ? void 0 : options.addresses.map(function (address) { return address.toLowerCase(); });
            return [2 /*return*/, Object.fromEntries(addresses.map(function (address) { return [
                    address,
                    whitelist.includes(address.toLowerCase()) ? 1 : 0
                ]; }))];
        });
    });
}

var abi$i = [
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "users",
        "outputs": [
            {
                "internalType": "uint32",
                "name": "lastUpdateBlock",
                "type": "uint32"
            },
            {
                "internalType": "uint32",
                "name": "vestingBlock",
                "type": "uint32"
            },
            {
                "internalType": "uint96",
                "name": "pendedCvp",
                "type": "uint96"
            },
            {
                "internalType": "uint96",
                "name": "cvpAdjust",
                "type": "uint96"
            },
            {
                "internalType": "uint256",
                "name": "lptAmount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "signature": "0xb9d02df4"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "pools",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "lpToken",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "votesEnabled",
                "type": "bool"
            },
            {
                "internalType": "uint8",
                "name": "poolType",
                "type": "uint8"
            },
            {
                "internalType": "uint32",
                "name": "allocPoint",
                "type": "uint32"
            },
            {
                "internalType": "uint32",
                "name": "lastUpdateBlock",
                "type": "uint32"
            },
            {
                "internalType": "uint256",
                "name": "accCvpPerLpt",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "signature": "0xac4afa38"
    },
    {
        "inputs": [],
        "name": "poolLength",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "signature": "0x081e3eda"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "members",
        "outputs": [
            {
                "internalType": "bool",
                "name": "active",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "transferred",
                "type": "bool"
            },
            {
                "internalType": "uint96",
                "name": "alreadyClaimedVotes",
                "type": "uint96"
            },
            {
                "internalType": "uint96",
                "name": "alreadyClaimedTokens",
                "type": "uint96"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "signature": "0x08ae4b0c"
    },
    {
        "inputs": [],
        "name": "startV",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "signature": "0x5cfa7d02"
    },
    {
        "inputs": [],
        "name": "durationV",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "signature": "0x51771f40"
    },
    {
        "inputs": [],
        "name": "endT",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "signature": "0xa8b7d824"
    },
    {
        "inputs": [],
        "name": "amountPerMember",
        "outputs": [
            {
                "internalType": "uint96",
                "name": "",
                "type": "uint96"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "signature": "0x5e6a1dd8"
    },
];
function strategy$P(space, network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, _a, results;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(typeof snapshot === 'number')) return [3 /*break*/, 1];
                    _a = snapshot;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, getBlockNumber(provider)];
                case 2:
                    _a = _b.sent();
                    _b.label = 3;
                case 3:
                    blockTag = _a;
                    return [4 /*yield*/, Promise.all([
                            // @ts-ignore
                            cvpBalanceOf(network, provider, addresses, options, blockTag),
                            cvpMiningLP(network, provider, addresses, options, blockTag),
                            cvpVestingOf(network, provider, addresses, options, blockTag),
                        ])];
                case 4:
                    results = _b.sent();
                    return [2 /*return*/, results.reduce(function (balance, result) {
                            for (var _i = 0, _a = Object.entries(result); _i < _a.length; _i++) {
                                var _b = _a[_i], userAddress = _b[0], userBalance = _b[1];
                                balance[userAddress] = (balance[userAddress] || 0) + userBalance;
                            }
                            return balance;
                        }, {})];
            }
        });
    });
}
function cvpVestingOf(network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, _a, startV, durationV, endT, amountPerMember, amountPerSecond, block, currentVotesAmount, calls, members;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, multicall(network, provider, abi$i, [
                            [options.vesting, 'startV', []],
                            [options.vesting, 'durationV', []],
                            [options.vesting, 'endT', []],
                            [options.vesting, 'amountPerMember', []]
                        ], { blockTag: blockTag }).then(function (data) { return data.map(function (d) { return d.toString(); }); })];
                case 1:
                    _a = _b.sent(), startV = _a[0], durationV = _a[1], endT = _a[2], amountPerMember = _a[3];
                    startV = parseInt(startV);
                    durationV = parseInt(durationV);
                    endT = parseInt(endT);
                    amountPerMember = formatUnits(amountPerMember);
                    amountPerSecond = amountPerMember / durationV;
                    return [4 /*yield*/, provider.getBlock(snapshot)];
                case 2:
                    block = _b.sent();
                    currentVotesAmount = block.timestamp >= endT ? 0 : (block.timestamp - startV) * amountPerSecond;
                    calls = addresses.map(function (address) { return [
                        options.vesting,
                        'members',
                        [address]
                    ]; });
                    return [4 /*yield*/, multicall(network, provider, abi$i, calls, { blockTag: blockTag })];
                case 3:
                    members = _b.sent();
                    return [2 /*return*/, Object.fromEntries(addresses.map(function (address, i) { return [address, members[i].active ? currentVotesAmount : 0]; }))];
            }
        });
    });
}
function cvpBalanceOf(network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, calls, balances;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    calls = addresses.map(function (address) { return [
                        options.token,
                        'balanceOf',
                        [address]
                    ]; });
                    return [4 /*yield*/, multicall(network, provider, abi$i, calls, { blockTag: blockTag })];
                case 1:
                    balances = _a.sent();
                    return [2 /*return*/, Object.fromEntries(addresses.map(function (address, i) {
                            return [address, parseFloat(formatUnits(balances[i].toString()))];
                        }))];
            }
        });
    });
}
function cvpMiningLP(network, provider, addresses, options, snapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTag, poolLength, poolsCalls, i, pools, votesByAddress, votesPools, _loop_1, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
                    return [4 /*yield*/, call(provider, abi$i, [options.mining, 'poolLength', []]).then(function (l) { return parseInt(l.toString()); })];
                case 1:
                    poolLength = _a.sent();
                    poolsCalls = [];
                    for (i = 0; i < poolLength; i++) {
                        poolsCalls.push([options.mining, 'pools', [i]]);
                    }
                    return [4 /*yield*/, multicall(network, provider, abi$i, poolsCalls, { blockTag: blockTag })];
                case 2:
                    pools = _a.sent();
                    votesByAddress = {};
                    votesPools = pools.map(function (p, i) { return ({ pid: i, token: p.lpToken }); });
                    _loop_1 = function (i) {
                        var pool, response, cvpPerLP, lpBalances, stakedUserInfo;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    pool = votesPools[i];
                                    return [4 /*yield*/, multicall(network, provider, abi$i, __spreadArrays([
                                            [options.token, 'balanceOf', [pool.token]],
                                            [pool.token, 'totalSupply']
                                        ], addresses.map(function (address) { return [
                                            pool.token,
                                            'balanceOf',
                                            [address]
                                        ]; }), addresses.map(function (address) { return [
                                            options.mining,
                                            'users',
                                            [pool.pid, address]
                                        ]; })), { blockTag: blockTag })];
                                case 1:
                                    response = _a.sent();
                                    cvpPerLP = parseUnits(response[0][0].toString(), 18).div(response[1][0]);
                                    lpBalances = response.slice(2, addresses.length + 2);
                                    stakedUserInfo = response.slice(addresses.length + 2, addresses.length * 2 + 2);
                                    addresses.forEach(function (a, k) {
                                        var lpBalance = lpBalances[k][0].add(stakedUserInfo[k]['lptAmount']);
                                        var cvpLpBalance = lpBalance
                                            .mul(cvpPerLP)
                                            .div(parseUnits('1', 18));
                                        if (!votesByAddress[a]) {
                                            votesByAddress[a] = 0;
                                        }
                                        votesByAddress[a] += parseFloat(formatUnits(cvpLpBalance, 18));
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < votesPools.length)) return [3 /*break*/, 6];
                    return [5 /*yield**/, _loop_1(i)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/, votesByAddress];
            }
        });
    });
}

var strategies = {
    balancer: strategy,
    'erc20-received': strategy$s,
    'contract-call': strategy$1,
    'eth-received': strategy$r,
    'eth-philanthropy': strategy$t,
    'ens-domains-owned': strategy$2,
    'erc20-balance-of': strategy$3,
    'erc20-balance-of-fixed-total': strategy$5,
    'erc20-balance-of-cv': strategy$6,
    'erc20-balance-of-coeff': strategy$4,
    'erc20-with-balance': strategy$7,
    'erc20-balance-of-delegation': strategy$8,
    'balance-of-with-min': strategy$9,
    'balancer-delegation': strategy$a,
    'eth-balance': strategy$b,
    'eth-wallet-age': strategy$c,
    'maker-ds-chief': strategy$d,
    uni: strategy$e,
    'frax-finance': strategy$g,
    'yearn-vault': strategy$f,
    moloch: strategy$h,
    masterchef: strategy$C,
    sushiswap: strategy$B,
    uniswap: strategy$i,
    pancake: strategy$j,
    synthetix: strategy$k,
    ctoken: strategy$l,
    cream: strategy$m,
    'staked-uniswap': strategy$p,
    esd: strategy$n,
    'esd-delegation': strategy$o,
    piedao: strategy$q,
    'xdai-stake': strategy$u,
    'xdai-stake-delegation': strategy$v,
    defidollar: strategy$w,
    aavegotchi: strategy$x,
    mithcash: strategy$y,
    stablexswap: strategy$D,
    dittomoney: strategy$z,
    'staked-keep': strategy$E,
    'balancer-unipool': strategy$A,
    typhoon: strategy$F,
    delegation: strategy$G,
    ticket: strategy$H,
    work: strategy$I,
    'ticket-validity': strategy$J,
    opium: strategy$K,
    'the-graph-balance': strategy$L,
    'the-graph-delegation': strategy$M,
    'the-graph-indexing': strategy$N,
    whitelist: strategy$O,
    powerpool: strategy$P
};

var wanchain = {
	key: "wanchain",
	name: "Wanchain",
	chainId: 1,
	network: "mainnet",
	rpc: [
		"https://gwan-ssl.wandevs.org:56891"
	],
	ws: [
		"wss://api.wanchain.org:8443/ws/v3/ddd16770c68f30350a21114802d5418eafe039b722de52b488e7eee1ee2cd73f"
	],
	explorer: "https://www.wanscan.org"
};
var networks = {
	"1": {
	key: "1",
	name: "Ethereum Mainnet",
	chainId: 1,
	network: "homestead",
	rpc: [
		{
			url: "https://api-geth-archive.ankr.com",
			user: "balancer_user",
			password: "balancerAnkr20201015"
		},
		"https://eth-archival.gateway.pokt.network/v1/5f76124fb90218002e9ce985",
		"https://eth-mainnet.alchemyapi.io/v2/4bdDVB5QAaorY2UE-GBUbM2yQB3QJqzv",
		"https://cloudflare-eth.com"
	],
	ws: [
		"wss://eth-mainnet.ws.alchemyapi.io/v2/4bdDVB5QAaorY2UE-GBUbM2yQB3QJqzv"
	],
	explorer: "https://etherscan.io"
},
	"3": {
	key: "3",
	name: "Ethereum Testnet Ropsten",
	shortName: "Ropsten",
	chainId: 3,
	network: "ropsten",
	rpc: [
		"https://eth-ropsten.alchemyapi.io/v2/wbsH-Ihl4guFWnM4klEJxh5r64KRp3LV"
	],
	explorer: "https://ropsten.etherscan.io"
},
	"4": {
	key: "4",
	name: "Ethereum Testnet Rinkeby",
	shortName: "Rinkeby",
	chainId: 4,
	network: "rinkeby",
	rpc: [
		"https://eth-rinkeby.alchemyapi.io/v2/twReQE9Px03E-E_N_Fbb3OVF7YgHxoGq",
		"https://eth-rinkeby.gateway.pokt.network/v1/5f76124fb90218002e9ce985"
	],
	ws: [
		"wss://eth-rinkeby.ws.alchemyapi.io/v2/twReQE9Px03E-E_N_Fbb3OVF7YgHxoGq"
	],
	explorer: "https://rinkeby.etherscan.io"
},
	"5": {
	key: "5",
	name: "Ethereum Testnet Görli",
	shortName: "Görli",
	chainId: 5,
	network: "goerli",
	rpc: [
		"https://eth-goerli.alchemyapi.io/v2/gzMLSQ6EPmP6ZsTd0BOCQ7tPwAmgWpO9"
	],
	explorer: "https://goerli.etherscan.io"
},
	"7": {
	key: "7",
	name: "ThaiChain",
	chainId: 7,
	network: "mainnet",
	rpc: [
		"https://rpc.dome.cloud"
	],
	ws: [
		"wss://ws.dome.cloud"
	],
	explorer: "https://exp.tch.in.th"
},
	"17": {
	key: "17",
	name: "Docker localhost 8545",
	shortName: "dockerLocalhost",
	chainId: 17,
	network: "docker localhost",
	rpc: [
		"http://localhost:8545"
	]
},
	"42": {
	key: "42",
	name: "Ethereum Testnet Kovan",
	shortName: "Kovan",
	chainId: 42,
	network: "kovan",
	rpc: [
		"https://eth-kovan.alchemyapi.io/v2/QCsM2iU0bQ49eGDmZ7-Y--Wpu0lVWXSO",
		"https://poa-kovan.gateway.pokt.network/v1/5f76124fb90218002e9ce985"
	],
	ws: [
		"wss://eth-kovan.ws.alchemyapi.io/v2/QCsM2iU0bQ49eGDmZ7-Y--Wpu0lVWXSO"
	],
	explorer: "https://kovan.etherscan.io"
},
	"50": {
	key: "50",
	name: "XinFin MainNet",
	shortName: "XDC",
	chainId: 50,
	network: "mainnet",
	rpc: [
		"https://rpc.xinfin.network"
	],
	ws: [
		"wss://ws.xinfin.network"
	],
	explorer: "http://explorer.xinfin.network/"
},
	"56": {
	key: "56",
	name: "Binance Smart Chain Mainnet",
	shortName: "BSC",
	chainId: 56,
	network: "mainnet",
	rpc: [
		"https://bsc-private-dataseed1.nariox.org",
		"https://bsc-private-dataseed2.nariox.org",
		"https://bsc-dataseed1.ninicoin.io",
		"https://bsc-dataseed1.binance.org",
		"https://bsc-dataseed2.binance.org",
		"https://bsc-dataseed3.binance.org"
	],
	explorer: "https://bscscan.com"
},
	"61": {
	key: "61",
	name: "Ethereum Classic Mainnet",
	shortName: "Ethereum Classic",
	chainId: 61,
	network: "mainnet",
	rpc: [
		"https://ethereumclassic.network"
	],
	explorer: "https://blockscout.com/etc/mainnet"
},
	"82": {
	key: "82",
	name: "Meter Mainnet",
	shortName: "Meter",
	chainId: 82,
	network: "mainnet",
	rpc: [
		"https://rpc.meter.io"
	],
	explorer: "https://scan.meter.io"
},
	"97": {
	key: "97",
	name: "Binance Smart Chain Testnet",
	shortName: "BSC Testnet",
	chainId: 97,
	network: "testnet",
	rpc: [
		"https://data-seed-prebsc-1-s1.binance.org:8545"
	],
	explorer: "https://testnet.bscscan.com"
},
	"99": {
	key: "99",
	name: "POA Core",
	shortName: "POA",
	chainId: 99,
	network: "mainnet",
	rpc: [
		"https://core.poa.network"
	],
	explorer: "https://blockscout.com/poa/core/"
},
	"100": {
	key: "100",
	name: "xDAI Chain",
	shortName: "xDAI",
	chainId: 100,
	network: "mainnet",
	rpc: [
		"https://xdai-archive.blockscout.com",
		"https://poa-xdai.gateway.pokt.network/v1/5f76124fb90218002e9ce985"
	],
	ws: [
		"wss://rpc.xdaichain.com/wss"
	],
	explorer: "https://blockscout.com/poa/xdai"
},
	"108": {
	key: "108",
	name: "Thundercore Mainnet",
	chainId: 108,
	network: "mainnet",
	rpc: [
		"https://mainnet-rpc.thundercore.com"
	],
	explorer: "https://scan.thundercore.com"
},
	"128": {
	key: "128",
	name: "Huobi Eco Chain Mainnet",
	shortName: "heco",
	chainId: 128,
	network: "Mainnet",
	rpc: [
		"https://http-mainnet.hecochain.com"
	],
	ws: [
		"wss://ws-mainnet.hecochain.com"
	],
	explorer: "https://scan.hecochain.com"
},
	"137": {
	key: "137",
	name: "Matic Mainnet",
	shortName: "Matic",
	chainId: 137,
	network: "mainnet",
	rpc: [
		"https://rpc-mainnet.maticvigil.com"
	],
	ws: [
		"wss://ws-mainnet.matic.network"
	],
	explorer: ""
},
	"256": {
	key: "256",
	name: "Huobi Eco Chain Testnet",
	shortName: "heco",
	chainId: 256,
	network: "testnet",
	rpc: [
		"https://http-testnet.hecochain.com"
	],
	ws: [
		"wss://ws-testnet.hecochain.com"
	],
	explorer: "https://scan-testnet.hecochain.com"
},
	"420": {
	key: "420",
	name: "Optimistic Ethereum",
	chainId: 420,
	network: "mainnet",
	explorer: ""
},
	"1337": {
	key: "1337",
	name: "Localhost 8545",
	shortName: "localhost",
	chainId: 1337,
	network: "localhost",
	rpc: [
		"http://localhost:8545"
	]
},
	"32659": {
	key: "32659",
	name: "Fusion Mainnet",
	chainId: 32659,
	network: "mainnet",
	rpc: [
		"https://vote.anyswap.exchange/mainnet"
	],
	ws: [
		"wss://mainnetpublicgateway1.fusionnetwork.io:10001"
	],
	explorer: "https://fsnex.com"
},
	"80001": {
	key: "80001",
	name: "Matic Mumbai",
	chainId: 80001,
	network: "testnet",
	rpc: [
		"https://rpc-mumbai.matic.today"
	],
	ws: [
		"wss://ws-mumbai.matic.today"
	],
	explorer: ""
},
	wanchain: wanchain
};

var providers = {};
function getProvider(network) {
    var url = networks[network].rpc[0];
    if (!providers[network])
        providers[network] = new JsonRpcProvider(url);
    return providers[network];
}

var supportedCodecs = ['ipns-ns', 'ipfs-ns', 'swarm-ns', 'onion', 'onion3'];
var REGISTRAR_ABI = [
    {
        constant: true,
        inputs: [
            {
                name: 'node',
                type: 'bytes32'
            }
        ],
        name: 'resolver',
        outputs: [
            {
                name: 'resolverAddress',
                type: 'address'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
var REGISTRAR_ADDRESS = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
var RESOLVER_ABI = [
    {
        constant: true,
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32'
            }
        ],
        name: 'contenthash',
        outputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
function decodeContenthash(encoded) {
    var decoded, protocolType, error;
    if (encoded.error) {
        return { protocolType: null, decoded: encoded.error };
    }
    if (encoded) {
        try {
            decoded = contentHash.decode(encoded);
            var codec = contentHash.getCodec(encoded);
            if (codec === 'ipfs-ns') {
                // convert the ipfs from base58 to base32 (url host compatible)
                // if needed the hash can now be resolved through a secured origin gateway (<hash>.gateway.com)
                decoded = contentHash.helpers.cidV0ToV1Base32(decoded);
                protocolType = 'ipfs';
            }
            else if (codec === 'ipns-ns') {
                decoded = bs58.decode(decoded).slice(2).toString();
                protocolType = 'ipns';
            }
            else if (codec === 'swarm-ns') {
                protocolType = 'bzz';
            }
            else if (codec === 'onion') {
                protocolType = 'onion';
            }
            else if (codec === 'onion3') {
                protocolType = 'onion3';
            }
            else {
                decoded = encoded;
            }
        }
        catch (e) {
            error = e.message;
        }
    }
    return { protocolType: protocolType, decoded: decoded, error: error };
}
function validateContent(encoded) {
    return (contentHash.isHashOfType(encoded, contentHash.Types.ipfs) ||
        contentHash.isHashOfType(encoded, contentHash.Types.swarm));
}
function isValidContenthash(encoded) {
    try {
        var codec = contentHash.getCodec(encoded);
        return isHexString(encoded) && supportedCodecs.includes(codec);
    }
    catch (e) {
        console.log(e);
    }
}
function encodeContenthash(text) {
    var content, contentType;
    var encoded = false;
    if (text) {
        var matched = text.match(/^(ipfs|ipns|bzz|onion|onion3):\/\/(.*)/) ||
            text.match(/\/(ipfs)\/(.*)/) ||
            text.match(/\/(ipns)\/(.*)/);
        if (matched) {
            contentType = matched[1];
            content = matched[2];
        }
        try {
            if (contentType === 'ipfs') {
                if (content.length >= 4) {
                    encoded = '0x' + contentHash.encode('ipfs-ns', content);
                }
            }
            else if (contentType === 'ipns') {
                var bs58content = bs58.encode(Buffer.concat([
                    Buffer.from([0, content.length]),
                    Buffer.from(content)
                ]));
                encoded = '0x' + contentHash.encode('ipns-ns', bs58content);
            }
            else if (contentType === 'bzz') {
                if (content.length >= 4) {
                    encoded = '0x' + contentHash.fromSwarm(content);
                }
            }
            else if (contentType === 'onion') {
                if (content.length == 16) {
                    encoded = '0x' + contentHash.encode('onion', content);
                }
            }
            else if (contentType === 'onion3') {
                if (content.length == 56) {
                    encoded = '0x' + contentHash.encode('onion3', content);
                }
            }
            else {
                console.warn('Unsupported protocol or invalid value', {
                    contentType: contentType,
                    text: text
                });
            }
        }
        catch (err) {
            console.warn('Error encoding content hash', { text: text, encoded: encoded });
            //throw 'Error encoding content hash'
        }
    }
    return encoded;
}
/**
 * Fetches and decodes the result of an ENS contenthash lookup on mainnet to a URI
 * @param ensName to resolve
 * @param provider provider to use to fetch the data
 */
function resolveENSContentHash(ensName, provider) {
    return __awaiter(this, void 0, void 0, function () {
        var hash, resolverAddress;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hash = namehash(ensName);
                    return [4 /*yield*/, call(provider, REGISTRAR_ABI, [
                            REGISTRAR_ADDRESS,
                            'resolver',
                            [hash]
                        ])];
                case 1:
                    resolverAddress = _a.sent();
                    return [4 /*yield*/, call(provider, RESOLVER_ABI, [
                            resolverAddress,
                            'contenthash',
                            [hash]
                        ])];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function resolveContent(provider, name) {
    return __awaiter(this, void 0, void 0, function () {
        var contentHash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, resolveENSContentHash(name, provider)];
                case 1:
                    contentHash = _a.sent();
                    return [2 /*return*/, decodeContenthash(contentHash)];
            }
        });
    });
}

var MULTICALL = {
    '1': '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
    '3': '0x53c43764255c17bd724f74c4ef150724ac50a3ed',
    '4': '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821',
    '5': '0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e',
    '6': '0x53c43764255c17bd724f74c4ef150724ac50a3ed',
    '17': '0xB9cb900E526e7Ad32A2f26f1fF6Dee63350fcDc5',
    '42': '0x2cc8688c5f75e365aaeeb4ea8d6a480405a48d2a',
    '56': '0x1ee38d535d541c55c9dae27b12edf090c608e6fb',
    '82': '0x579De77CAEd0614e3b158cb738fcD5131B9719Ae',
    '97': '0x8b54247c6BAe96A6ccAFa468ebae96c4D7445e46',
    '100': '0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a',
    '128': '0x37ab26db3df780e7026f3e767f65efb739f48d8e',
    '137': '0xCBca837161be50EfA5925bB9Cc77406468e76751',
    '256': '0xC33994Eb943c61a8a59a918E2de65e03e4e385E0',
    '1337': '0x566131e85d46cc7BBd0ce5C6587E9912Dc27cDAc',
    wanchain: '0xba5934ab3056fca1fa458d30fbb3810c3eb5145f'
};
var SNAPSHOT_SUBGRAPH_URL = {
    '1': 'https://api.thegraph.com/subgraphs/name/snapshot-labs/snapshot',
    '4': 'https://api.thegraph.com/subgraphs/name/snapshot-labs/snapshot-rinkeby',
    '42': 'https://api.thegraph.com/subgraphs/name/snapshot-labs/snapshot-kovan'
};
function call(provider, abi, call, options) {
    return __awaiter(this, void 0, void 0, function () {
        var contract, params, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    contract = new Contract(call[0], abi, provider);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    params = call[2] || [];
                    return [4 /*yield*/, contract[call[1]].apply(contract, __spreadArrays(params, [options || {}]))];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    e_1 = _a.sent();
                    return [2 /*return*/, Promise.reject(e_1)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function multicall(network, provider, abi$1, calls, options) {
    return __awaiter(this, void 0, void 0, function () {
        var multi, itf, _a, res, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    multi = new Contract(MULTICALL[network], abi, provider);
                    itf = new Interface(abi$1);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, multi.aggregate(calls.map(function (call) { return [
                            call[0].toLowerCase(),
                            itf.encodeFunctionData(call[1], call[2])
                        ]; }), options || {})];
                case 2:
                    _a = _b.sent(), res = _a[1];
                    return [2 /*return*/, res.map(function (call, i) { return itf.decodeFunctionResult(calls[i][1], call); })];
                case 3:
                    e_2 = _b.sent();
                    return [2 /*return*/, Promise.reject(e_2)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function subgraphRequest(url, query, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var res, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url, {
                        method: 'POST',
                        headers: __assign({ Accept: 'application/json', 'Content-Type': 'application/json' }, options === null || options === void 0 ? void 0 : options.headers),
                        body: JSON.stringify({ query: jsonToGraphQLQuery({ query: query }) })
                    })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data || {}];
            }
        });
    });
}
function ipfsGet(gateway, ipfsHash, protocolType) {
    if (protocolType === void 0) { protocolType = 'ipfs'; }
    return __awaiter(this, void 0, void 0, function () {
        var url;
        return __generator(this, function (_a) {
            url = "https://" + gateway + "/" + protocolType + "/" + ipfsHash;
            return [2 /*return*/, fetch(url).then(function (res) { return res.json(); })];
        });
    });
}
function sendTransaction(web3, contractAddress, abi, action, params, overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var signer, contract, contractWithSigner;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    signer = web3.getSigner();
                    contract = new Contract(contractAddress, abi, web3);
                    contractWithSigner = contract.connect(signer);
                    return [4 /*yield*/, contractWithSigner[action].apply(contractWithSigner, __spreadArrays(params, [overrides]))];
                case 1: 
                // overrides.gasLimit = 12e6;
                return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getScores(space, strategies$1, network, provider, addresses, snapshot) {
    if (snapshot === void 0) { snapshot = 'latest'; }
    return __awaiter(this, void 0, void 0, function () {
        var e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Promise.all(strategies$1.map(function (strategy) {
                            var _a;
                            return snapshot !== 'latest' && ((_a = strategy.params) === null || _a === void 0 ? void 0 : _a.start) > snapshot
                                ? {}
                                : strategies[strategy.name](space, network, provider, addresses, strategy.params, snapshot);
                        }))];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    e_3 = _a.sent();
                    return [2 /*return*/, Promise.reject(e_3)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function validateSchema(schema, data) {
    var ajv = new Ajv();
    var validate = ajv.compile(schema);
    var valid = validate(data);
    return valid ? valid : validate.errors;
}
var utils = {
    call: call,
    multicall: multicall,
    subgraphRequest: subgraphRequest,
    ipfsGet: ipfsGet,
    sendTransaction: sendTransaction,
    getScores: getScores,
    validateSchema: validateSchema,
    getProvider: getProvider,
    decodeContenthash: decodeContenthash,
    validateContent: validateContent,
    isValidContenthash: isValidContenthash,
    encodeContenthash: encodeContenthash,
    resolveENSContentHash: resolveENSContentHash,
    resolveContent: resolveContent,
    signMessage: signMessage,
    getBlockNumber: getBlockNumber,
    Multicaller: Multicaller
};

var NO_TOKEN = "" + '0x'.padEnd(42, '0');
var ARAGON_SUBGRAPH_URL = {
    '1': 'https://api.thegraph.com/subgraphs/name/aragon/aragon-govern-mainnet',
    '4': 'https://api.thegraph.com/subgraphs/name/novaknole/aragon-govern-rinkeby'
};
var queueAbi = [
    {
        inputs: [
            {
                components: [
                    {
                        components: [
                            {
                                internalType: 'uint256',
                                name: 'nonce',
                                type: 'uint256'
                            },
                            {
                                internalType: 'uint256',
                                name: 'executionTime',
                                type: 'uint256'
                            },
                            {
                                internalType: 'address',
                                name: 'submitter',
                                type: 'address'
                            },
                            {
                                internalType: 'contract IERC3000Executor',
                                name: 'executor',
                                type: 'address'
                            },
                            {
                                components: [
                                    {
                                        internalType: 'address',
                                        name: 'to',
                                        type: 'address'
                                    },
                                    {
                                        internalType: 'uint256',
                                        name: 'value',
                                        type: 'uint256'
                                    },
                                    {
                                        internalType: 'bytes',
                                        name: 'data',
                                        type: 'bytes'
                                    }
                                ],
                                internalType: 'struct ERC3000Data.Action[]',
                                name: 'actions',
                                type: 'tuple[]'
                            },
                            {
                                internalType: 'bytes32',
                                name: 'allowFailuresMap',
                                type: 'bytes32'
                            },
                            {
                                internalType: 'bytes',
                                name: 'proof',
                                type: 'bytes'
                            }
                        ],
                        internalType: 'struct ERC3000Data.Payload',
                        name: 'payload',
                        type: 'tuple'
                    },
                    {
                        components: [
                            {
                                internalType: 'uint256',
                                name: 'executionDelay',
                                type: 'uint256'
                            },
                            {
                                components: [
                                    {
                                        internalType: 'address',
                                        name: 'token',
                                        type: 'address'
                                    },
                                    {
                                        internalType: 'uint256',
                                        name: 'amount',
                                        type: 'uint256'
                                    }
                                ],
                                internalType: 'struct ERC3000Data.Collateral',
                                name: 'scheduleDeposit',
                                type: 'tuple'
                            },
                            {
                                components: [
                                    {
                                        internalType: 'address',
                                        name: 'token',
                                        type: 'address'
                                    },
                                    {
                                        internalType: 'uint256',
                                        name: 'amount',
                                        type: 'uint256'
                                    }
                                ],
                                internalType: 'struct ERC3000Data.Collateral',
                                name: 'challengeDeposit',
                                type: 'tuple'
                            },
                            {
                                internalType: 'address',
                                name: 'resolver',
                                type: 'address'
                            },
                            {
                                internalType: 'bytes',
                                name: 'rules',
                                type: 'bytes'
                            }
                        ],
                        internalType: 'struct ERC3000Data.Config',
                        name: 'config',
                        type: 'tuple'
                    }
                ],
                internalType: 'struct ERC3000Data.Container',
                name: '_container',
                type: 'tuple'
            }
        ],
        name: 'schedule',
        outputs: [
            {
                internalType: 'bytes32',
                name: 'containerHash',
                type: 'bytes32'
            }
        ],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'nonce',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    }
];
var ercAbi = [
    {
        constant: false,
        inputs: [
            {
                name: '_spender',
                type: 'address'
            },
            {
                name: '_value',
                type: 'uint256'
            }
        ],
        name: 'approve',
        outputs: [
            {
                name: '',
                type: 'bool'
            }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: true,
        inputs: [
            {
                name: '_owner',
                type: 'address'
            },
            {
                name: '_spender',
                type: 'address'
            }
        ],
        name: 'allowance',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
var GQL_QUERY = {
    registryEntry: {
        __args: {
            id: undefined
        },
        executor: {
            address: true
        },
        queue: {
            address: true,
            config: {
                executionDelay: true,
                scheduleDeposit: {
                    token: true,
                    amount: true
                },
                challengeDeposit: {
                    token: true,
                    amount: true
                },
                resolver: true,
                rules: true
            }
        }
    }
};
var FAILURE_MAP = '0x0000000000000000000000000000000000000000000000000000000000000000';
var EMPTY_BYTES = '0x00';
/**
 * scheduleAction schedules an action into a GovernQueue.
 * Instead of sending the action to a disputable delay from aragonOS, we directly call this
 * contract.
 * the actionsFromAragonPlugin is an array of objects with the form { to, value, data }
 */
function scheduleAction(network, web3, daoName, account, proof, actionsFromAragonPlugin) {
    return __awaiter(this, void 0, void 0, function () {
        var query, result, config, nonce, bnNonce, newNonce, currentDate, allowance, resetTx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = GQL_QUERY;
                    query.registryEntry.__args.id = daoName;
                    return [4 /*yield*/, subgraphRequest(ARAGON_SUBGRAPH_URL[network], query)];
                case 1:
                    result = _a.sent();
                    config = result.registryEntry.queue.config;
                    return [4 /*yield*/, call(web3, queueAbi, [
                            result.registryEntry.queue.address,
                            'nonce'
                        ])];
                case 2:
                    nonce = _a.sent();
                    bnNonce = BigNumber.from(nonce);
                    newNonce = bnNonce.add(BigNumber.from(1));
                    currentDate = Math.round(Date.now() / 1000) + Number(config.executionDelay) + 60;
                    return [4 /*yield*/, call(web3, ercAbi, [
                            config.scheduleDeposit.token,
                            'allowance',
                            [account, result.registryEntry.queue.address]
                        ])];
                case 3:
                    allowance = _a.sent();
                    if (!(allowance.lt(config.scheduleDeposit.amount) &&
                        config.scheduleDeposit.token !== NO_TOKEN)) return [3 /*break*/, 8];
                    if (!!allowance.isZero()) return [3 /*break*/, 6];
                    return [4 /*yield*/, sendTransaction(web3, config.scheduleDeposit.token, ercAbi, 'approve', [result.registryEntry.queue.address, '0'])];
                case 4:
                    resetTx = _a.sent();
                    return [4 /*yield*/, resetTx.wait(1)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [4 /*yield*/, sendTransaction(web3, config.scheduleDeposit.token, ercAbi, 'approve', [result.registryEntry.queue.address, config.scheduleDeposit.amount])];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [4 /*yield*/, sendTransaction(web3, result.registryEntry.queue.address, queueAbi, 'schedule', [
                        {
                            payload: {
                                nonce: newNonce.toString(),
                                executionTime: currentDate,
                                submitter: account,
                                executor: result.registryEntry.executor.address,
                                actions: actionsFromAragonPlugin,
                                allowFailuresMap: FAILURE_MAP,
                                // proof in snapshot's case, could be the proposal's IPFS CID
                                proof: proof ? toUtf8Bytes(proof) : EMPTY_BYTES
                            },
                            config: {
                                executionDelay: config.executionDelay,
                                scheduleDeposit: {
                                    token: config.scheduleDeposit.token,
                                    amount: config.scheduleDeposit.amount
                                },
                                challengeDeposit: {
                                    token: config.challengeDeposit.token,
                                    amount: config.challengeDeposit.amount
                                },
                                resolver: config.resolver,
                                rules: config.rules
                            }
                        }
                    ], {
                        // This can probably be optimized
                        gasLimit: 500000
                    })];
                case 9: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
var Plugin = /** @class */ (function () {
    function Plugin() {
        this.author = 'Evalir';
        this.version = '0.1.3';
        this.name = 'Aragon Govern';
        this.website = 'https://aragon.org/blog/snapshot';
    }
    Plugin.prototype.action = function (network, web3, spaceOptions, proposalOptions, proposalId, winningChoice) {
        return __awaiter(this, void 0, void 0, function () {
            var account, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, web3.listAccounts()];
                    case 1:
                        account = (_a.sent())[0];
                        return [4 /*yield*/, scheduleAction(network, web3, spaceOptions.id, account, proposalId, proposalOptions["choice" + winningChoice].actions)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Plugin;
}());

var UNISWAP_V2_SUBGRAPH_URL = {
    '1': 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    '4': 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2-rinkeby',
    '100': 'https://api.thegraph.com/subgraphs/name/1hive/uniswap-v2'
};
var OMEN_SUBGRAPH_URL = {
    '1': 'https://api.thegraph.com/subgraphs/name/protofire/omen',
    '4': 'https://api.thegraph.com/subgraphs/name/protofire/omen-rinkeby',
    '100': 'https://api.thegraph.com/subgraphs/name/protofire/omen-xdai'
};
var WETH_ADDRESS = {
    '1': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    '4': '0xc778417e063141139fce010982780140aa0cd5ab',
    '100': '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1'
};
var OMEN_GQL_QUERY = {
    condition: {
        __args: {
            id: undefined
        },
        id: true,
        fixedProductMarketMakers: {
            id: true,
            collateralToken: true,
            outcomeTokenAmounts: true,
            outcomeTokenMarginalPrices: true
        }
    }
};
var UNISWAP_V2_GQL_QUERY = {
    pairsTokens: {
        __aliasFor: 'pairs',
        __args: {
            where: {
                token0: true,
                token1: true
            }
        },
        token0Price: true
    },
    pairsTokensInverted: {
        __aliasFor: 'pairs',
        __args: {
            where: {
                token0: true,
                token1: true
            }
        },
        token1Price: true
    },
    pairsTokens0: {
        __aliasFor: 'pairs',
        __args: {
            where: {
                token0: true,
                token1: true
            }
        },
        token0Price: true
    },
    pairsTokens1: {
        __aliasFor: 'pairs',
        __args: {
            where: {
                token0: true,
                token1: true
            }
        },
        token0Price: true
    }
};
var erc20Abi = [
    {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [{ name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: false,
        inputs: [{ name: '_upgradedAddress', type: 'address' }],
        name: 'deprecate',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            { name: '_spender', type: 'address' },
            { name: '_value', type: 'uint256' }
        ],
        name: 'approve',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'deprecated',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: false,
        inputs: [{ name: '_evilUser', type: 'address' }],
        name: 'addBlackList',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            { name: '_from', type: 'address' },
            { name: '_to', type: 'address' },
            { name: '_value', type: 'uint256' }
        ],
        name: 'transferFrom',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'upgradedAddress',
        outputs: [{ name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [{ name: '', type: 'address' }],
        name: 'balances',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'maximumFee',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: '_totalSupply',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: false,
        inputs: [],
        name: 'unpause',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: true,
        inputs: [{ name: '_maker', type: 'address' }],
        name: 'getBlackListStatus',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [
            { name: '', type: 'address' },
            { name: '', type: 'address' }
        ],
        name: 'allowed',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'paused',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [{ name: 'who', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: false,
        inputs: [],
        name: 'pause',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'getOwner',
        outputs: [{ name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'owner',
        outputs: [{ name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [{ name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            { name: '_to', type: 'address' },
            { name: '_value', type: 'uint256' }
        ],
        name: 'transfer',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            { name: 'newBasisPoints', type: 'uint256' },
            { name: 'newMaxFee', type: 'uint256' }
        ],
        name: 'setParams',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: false,
        inputs: [{ name: 'amount', type: 'uint256' }],
        name: 'issue',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: false,
        inputs: [{ name: 'amount', type: 'uint256' }],
        name: 'redeem',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: true,
        inputs: [
            { name: '_owner', type: 'address' },
            { name: '_spender', type: 'address' }
        ],
        name: 'allowance',
        outputs: [{ name: 'remaining', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'basisPointsRate',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [{ name: '', type: 'address' }],
        name: 'isBlackListed',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: false,
        inputs: [{ name: '_clearedUser', type: 'address' }],
        name: 'removeBlackList',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'MAX_UINT',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: false,
        inputs: [{ name: 'newOwner', type: 'address' }],
        name: 'transferOwnership',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: false,
        inputs: [{ name: '_blackListedUser', type: 'address' }],
        name: 'destroyBlackFunds',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { name: '_initialSupply', type: 'uint256' },
            { name: '_name', type: 'string' },
            { name: '_symbol', type: 'string' },
            { name: '_decimals', type: 'uint256' }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'constructor'
    },
    {
        anonymous: false,
        inputs: [{ indexed: false, name: 'amount', type: 'uint256' }],
        name: 'Issue',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [{ indexed: false, name: 'amount', type: 'uint256' }],
        name: 'Redeem',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [{ indexed: false, name: 'newAddress', type: 'address' }],
        name: 'Deprecate',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, name: 'feeBasisPoints', type: 'uint256' },
            { indexed: false, name: 'maxFee', type: 'uint256' }
        ],
        name: 'Params',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, name: '_blackListedUser', type: 'address' },
            { indexed: false, name: '_balance', type: 'uint256' }
        ],
        name: 'DestroyedBlackFunds',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [{ indexed: false, name: '_user', type: 'address' }],
        name: 'AddedBlackList',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [{ indexed: false, name: '_user', type: 'address' }],
        name: 'RemovedBlackList',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: 'owner', type: 'address' },
            { indexed: true, name: 'spender', type: 'address' },
            { indexed: false, name: 'value', type: 'uint256' }
        ],
        name: 'Approval',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: 'from', type: 'address' },
            { indexed: true, name: 'to', type: 'address' },
            { indexed: false, name: 'value', type: 'uint256' }
        ],
        name: 'Transfer',
        type: 'event'
    },
    { anonymous: false, inputs: [], name: 'Pause', type: 'event' },
    { anonymous: false, inputs: [], name: 'Unpause', type: 'event' }
];
/**
 * Returns the token `name` and `symbol` from a given ERC-20 contract address
 * @param web3
 * @param tokenAddress
 * @param method
 */
var getTokenInfo = function (web3, tokenAddress) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, multicall(web3._network.chainId.toString(), web3, erc20Abi, [
                    [tokenAddress, 'name'],
                    [tokenAddress, 'symbol']
                ])];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var Plugin$1 = /** @class */ (function () {
    function Plugin() {
        this.author = 'davidalbela';
        this.version = '0.0.1';
        this.name = 'Gnosis Impact';
        this.website = 'https://gnosis.io';
    }
    Plugin.prototype.getTokenInfo = function (web3, tokenAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenInfo, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, getTokenInfo(web3, tokenAddress)];
                    case 1:
                        tokenInfo = _a.sent();
                        return [2 /*return*/, {
                                address: tokenAddress,
                                checksumAddress: getAddress(tokenAddress),
                                name: tokenInfo[0][0],
                                symbol: tokenInfo[1][0]
                            }];
                    case 2:
                        e_1 = _a.sent();
                        throw new Error(e_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Plugin.prototype.getOmenCondition = function (network, conditionId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = OMEN_GQL_QUERY;
                        query.condition.__args.id = conditionId;
                        return [4 /*yield*/, subgraphRequest(OMEN_SUBGRAPH_URL[network], query)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_2 = _a.sent();
                        console.error(e_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Plugin.prototype.getUniswapPair = function (network, token0, token1) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = UNISWAP_V2_GQL_QUERY;
                        query.pairsTokens.__args.where = {
                            token0: token0.toLowerCase(),
                            token1: token1.toLowerCase()
                        };
                        query.pairsTokensInverted.__args.where = {
                            token0: token1.toLowerCase(),
                            token1: token0.toLowerCase()
                        };
                        query.pairsTokens0.__args.where = {
                            token0: token0.toLowerCase(),
                            token1: WETH_ADDRESS[network]
                        };
                        query.pairsTokens1.__args.where = {
                            token0: token1.toLowerCase(),
                            token1: WETH_ADDRESS[network]
                        };
                        return [4 /*yield*/, subgraphRequest(UNISWAP_V2_SUBGRAPH_URL[network], query)];
                    case 1:
                        result = _a.sent();
                        if (result.pairsTokens.length > 0) {
                            return [2 /*return*/, result.pairsTokens[0]];
                        }
                        else if (result.pairsTokensInverted.length > 0) {
                            return [2 /*return*/, {
                                    token0Price: result.pairsTokensInverted[0].token1Price
                                }];
                        }
                        else if (result.pairsTokens0.length > 0 &&
                            result.pairsTokens1.length > 0) {
                            return [2 /*return*/, {
                                    token0Price: (parseFloat(result.pairsTokens0[0].token0Price) /
                                        parseFloat(result.pairsTokens1[0].token0Price)).toString()
                                }];
                        }
                        throw new Error("Does not exist market pairs for " + token0 + " and " + token1 + ".");
                    case 2:
                        e_3 = _a.sent();
                        console.error(e_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Plugin;
}());

var plugins = {
    aragon: Plugin,
    gnosis: Plugin$1
};

var $schema = "http://json-schema.org/draft-07/schema#";
var $ref = "#/definitions/Space";
var definitions = {
	Space: {
		title: "Space",
		type: "object",
		properties: {
			name: {
				type: "string",
				title: "name",
				minLength: 1,
				maxLength: 32
			},
			network: {
				type: "string",
				title: "network",
				minLength: 1,
				maxLength: 32
			},
			symbol: {
				type: "string",
				title: "symbol",
				minLength: 1,
				maxLength: 12
			},
			skin: {
				type: "string",
				title: "skin",
				maxLength: 32
			},
			domain: {
				type: "string",
				title: "domain",
				maxLength: 64
			},
			strategies: {
				type: "array",
				minItems: 1,
				maxItems: 3,
				items: {
					type: "object",
					properties: {
						name: {
							type: "string",
							maxLength: 64,
							title: "name"
						},
						params: {
							type: "object",
							title: "params"
						}
					},
					required: [
						"name"
					],
					additionalProperties: false
				},
				title: "strategies"
			},
			members: {
				type: "array",
				items: {
					type: "string",
					maxLength: 64
				},
				title: "members"
			},
			filters: {
				type: "object",
				properties: {
					defaultTab: {
						type: "string"
					},
					minScore: {
						type: "number",
						minimum: 0
					},
					onlyMembers: {
						type: "boolean"
					},
					invalids: {
						type: "array",
						items: {
							type: "string",
							maxLength: 64
						},
						title: "invalids"
					}
				},
				additionalProperties: false
			},
			plugins: {
				type: "object"
			}
		},
		required: [
			"name",
			"network",
			"symbol",
			"strategies"
		],
		additionalProperties: false
	}
};
var space = {
	$schema: $schema,
	$ref: $ref,
	definitions: definitions
};

var schemas = {
    space: space.definitions.Space
};

var index = {
    plugins: plugins,
    strategies: strategies,
    schemas: schemas,
    utils: utils
};

export default index;
