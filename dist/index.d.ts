declare const _default: {
    plugins: {
        aragon: typeof import("./plugins/aragon").default;
        gnosis: typeof import("./plugins/gnosis").default;
    };
    strategies: {
        balancer: typeof import("./strategies/balancer").strategy;
        'erc20-received': typeof import("./strategies/erc20-received").strategy;
        'contract-call': typeof import("./strategies/contract-call").strategy;
        'eth-received': typeof import("./strategies/eth-received").strategy;
        'eth-philanthropy': typeof import("./strategies/eth-philanthropy").strategy;
        'ens-domains-owned': typeof import("./strategies/ens-domains-owned").strategy;
        'erc20-balance-of': typeof import("./strategies/erc20-balance-of").strategy;
        'erc20-balance-of-fixed-total': typeof import("./strategies/erc20-balance-of-fixed-total").strategy;
        'erc20-balance-of-cv': typeof import("./strategies/erc20-balance-of-cv").strategy;
        'erc20-balance-of-coeff': typeof import("./strategies/erc20-balance-of-coeff").strategy;
        'erc20-with-balance': typeof import("./strategies/erc20-with-balance").strategy;
        'erc20-balance-of-delegation': typeof import("./strategies/erc20-balance-of-delegation").strategy;
        'balance-of-with-min': typeof import("./strategies/balance-of-with-min").strategy;
        'balancer-delegation': typeof import("./strategies/balancer-delegation").strategy;
        'eth-balance': typeof import("./strategies/eth-balance").strategy;
        'eth-wallet-age': typeof import("./strategies/eth-wallet-age").strategy;
        'maker-ds-chief': typeof import("./strategies/maker-ds-chief").strategy;
        uni: typeof import("./strategies/uni").strategy;
        'frax-finance': typeof import("./strategies/frax-finance").strategy;
        'yearn-vault': typeof import("./strategies/yearn-vault").strategy;
        moloch: typeof import("./strategies/moloch").strategy;
        masterchef: typeof import("./strategies/masterchef").strategy;
        sushiswap: typeof import("./strategies/sushiswap").strategy;
        uniswap: typeof import("./strategies/uniswap").strategy;
        pancake: typeof import("./strategies/pancake").strategy;
        synthetix: typeof import("./strategies/synthetix").strategy;
        ctoken: typeof import("./strategies/ctoken").strategy;
        cream: typeof import("./strategies/cream").strategy;
        'staked-uniswap': typeof import("./strategies/staked-uniswap").strategy;
        esd: typeof import("./strategies/esd").strategy;
        'esd-delegation': typeof import("./strategies/esd-delegation").strategy;
        piedao: typeof import("./strategies/piedao").strategy;
        'xdai-stake': typeof import("./strategies/xdai-stake").strategy;
        'xdai-stake-delegation': typeof import("./strategies/xdai-stake-delegation").strategy;
        defidollar: typeof import("./strategies/defidollar").strategy;
        aavegotchi: typeof import("./strategies/aavegotchi").strategy;
        mithcash: typeof import("./strategies/mithcash").strategy;
        stablexswap: typeof import("./strategies/stablexswap").strategy;
        dittomoney: typeof import("./strategies/dittomoney").strategy;
        'staked-keep': typeof import("./strategies/staked-keep").strategy;
        'balancer-unipool': typeof import("./strategies/balancer-unipool").strategy;
        typhoon: typeof import("./strategies/typhoon").strategy;
        delegation: typeof import("./strategies/delegation").strategy;
        ticket: typeof import("./strategies/ticket").strategy;
        work: typeof import("./strategies/work").strategy;
        'ticket-validity': typeof import("./strategies/ticket-validity").strategy;
        opium: typeof import("./strategies/opium").strategy;
        'the-graph-balance': typeof import("./strategies/the-graph-balance").strategy;
        'the-graph-delegation': typeof import("./strategies/the-graph-delegation").strategy;
        'the-graph-indexing': typeof import("./strategies/the-graph-indexing").strategy;
        whitelist: typeof import("./strategies/whitelist").strategy;
        powerpool: typeof import("./strategies/powerpool").strategy;
    };
    schemas: {
        space: {
            title: string;
            type: string;
            properties: {
                name: {
                    type: string;
                    title: string;
                    minLength: number;
                    maxLength: number;
                };
                network: {
                    type: string;
                    title: string;
                    minLength: number;
                    maxLength: number;
                };
                symbol: {
                    type: string;
                    title: string;
                    minLength: number;
                    maxLength: number;
                };
                skin: {
                    type: string;
                    title: string;
                    maxLength: number;
                };
                domain: {
                    type: string;
                    title: string;
                    maxLength: number;
                };
                strategies: {
                    type: string;
                    minItems: number;
                    maxItems: number;
                    items: {
                        type: string;
                        properties: {
                            name: {
                                type: string;
                                maxLength: number;
                                title: string;
                            };
                            params: {
                                type: string;
                                title: string;
                            };
                        };
                        required: string[];
                        additionalProperties: boolean;
                    };
                    title: string;
                };
                members: {
                    type: string;
                    items: {
                        type: string;
                        maxLength: number;
                    };
                    title: string;
                };
                filters: {
                    type: string;
                    properties: {
                        defaultTab: {
                            type: string;
                        };
                        minScore: {
                            type: string;
                            minimum: number;
                        };
                        onlyMembers: {
                            type: string;
                        };
                        invalids: {
                            type: string;
                            items: {
                                type: string;
                                maxLength: number;
                            };
                            title: string;
                        };
                    };
                    additionalProperties: boolean;
                };
                plugins: {
                    type: string;
                };
            };
            required: string[];
            additionalProperties: boolean;
        };
    };
    utils: {
        call: typeof import("./utils").call;
        multicall: typeof import("./utils").multicall;
        subgraphRequest: typeof import("./utils").subgraphRequest;
        ipfsGet: typeof import("./utils").ipfsGet;
        sendTransaction: typeof import("./utils").sendTransaction;
        getScores: typeof import("./utils").getScores;
        validateSchema: typeof import("./utils").validateSchema;
        getProvider: typeof import("./utils/provider").default;
        decodeContenthash: typeof import("./utils/contentHash").decodeContenthash;
        validateContent: typeof import("./utils/contentHash").validateContent;
        isValidContenthash: typeof import("./utils/contentHash").isValidContenthash;
        encodeContenthash: typeof import("./utils/contentHash").encodeContenthash;
        resolveENSContentHash: typeof import("./utils/contentHash").resolveENSContentHash;
        resolveContent: typeof import("./utils/contentHash").resolveContent;
        signMessage: typeof import("./utils/web3").signMessage;
        getBlockNumber: typeof import("./utils/web3").getBlockNumber;
        Multicaller: typeof import("./utils/multicaller").default;
    };
};
export default _default;
