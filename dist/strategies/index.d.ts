import { strategy as balancer } from './balancer';
import { strategy as contractCall } from './contract-call';
import { strategy as ensDomainsOwned } from './ens-domains-owned';
import { strategy as erc20BalanceOf } from './erc20-balance-of';
import { strategy as erc20BalanceOfCoeff } from './erc20-balance-of-coeff';
import { strategy as erc20BalanceOfFixedTotal } from './erc20-balance-of-fixed-total';
import { strategy as erc20BalanceOfCv } from './erc20-balance-of-cv';
import { strategy as erc20WithBalance } from './erc20-with-balance';
import { strategy as erc20BalanceOfDelegation } from './erc20-balance-of-delegation';
import { strategy as balanceOfWithMin } from './balance-of-with-min';
import { strategy as balancerDelegation } from './balancer-delegation';
import { strategy as ethBalance } from './eth-balance';
import { strategy as ethWalletAge } from './eth-wallet-age';
import { strategy as makerDsChief } from './maker-ds-chief';
import { strategy as uni } from './uni';
import { strategy as yearnVault } from './yearn-vault';
import { strategy as fraxFinance } from './frax-finance';
import { strategy as moloch } from './moloch';
import { strategy as uniswap } from './uniswap';
import { strategy as pancake } from './pancake';
import { strategy as synthetix } from './synthetix';
import { strategy as ctoken } from './ctoken';
import { strategy as cream } from './cream';
import { strategy as esd } from './esd';
import { strategy as esdDelegation } from './esd-delegation';
import { strategy as stakedUniswap } from './staked-uniswap';
import { strategy as piedao } from './piedao';
import { strategy as ethReceived } from './eth-received';
import { strategy as erc20Received } from './erc20-received';
import { strategy as ethPhilanthropy } from './eth-philanthropy';
import { strategy as xDaiStake } from './xdai-stake';
import { strategy as xDaiStakeDelegation } from './xdai-stake-delegation';
import { strategy as defidollar } from './defidollar';
import { strategy as aavegotchi } from './aavegotchi';
import { strategy as mithcash } from './mithcash';
import { strategy as dittomoney } from './dittomoney';
import { strategy as balancerUnipool } from './balancer-unipool';
import { strategy as sushiswap } from './sushiswap';
import { strategy as masterchef } from './masterchef';
import { strategy as stablexswap } from './stablexswap';
import { strategy as stakedKeep } from './staked-keep';
import { strategy as typhoon } from './typhoon';
import { strategy as delegation } from './delegation';
import { strategy as ticket } from './ticket';
import { strategy as work } from './work';
import { strategy as ticketValidity } from './ticket-validity';
import { strategy as opium } from './opium';
import { strategy as theGraphBalance } from './the-graph-balance';
import { strategy as theGraphDelegation } from './the-graph-delegation';
import { strategy as theGraphIndexing } from './the-graph-indexing';
import { strategy as whitelist } from './whitelist';
import { strategy as powerpool } from './powerpool';
declare const _default: {
    balancer: typeof balancer;
    'erc20-received': typeof erc20Received;
    'contract-call': typeof contractCall;
    'eth-received': typeof ethReceived;
    'eth-philanthropy': typeof ethPhilanthropy;
    'ens-domains-owned': typeof ensDomainsOwned;
    'erc20-balance-of': typeof erc20BalanceOf;
    'erc20-balance-of-fixed-total': typeof erc20BalanceOfFixedTotal;
    'erc20-balance-of-cv': typeof erc20BalanceOfCv;
    'erc20-balance-of-coeff': typeof erc20BalanceOfCoeff;
    'erc20-with-balance': typeof erc20WithBalance;
    'erc20-balance-of-delegation': typeof erc20BalanceOfDelegation;
    'balance-of-with-min': typeof balanceOfWithMin;
    'balancer-delegation': typeof balancerDelegation;
    'eth-balance': typeof ethBalance;
    'eth-wallet-age': typeof ethWalletAge;
    'maker-ds-chief': typeof makerDsChief;
    uni: typeof uni;
    'frax-finance': typeof fraxFinance;
    'yearn-vault': typeof yearnVault;
    moloch: typeof moloch;
    masterchef: typeof masterchef;
    sushiswap: typeof sushiswap;
    uniswap: typeof uniswap;
    pancake: typeof pancake;
    synthetix: typeof synthetix;
    ctoken: typeof ctoken;
    cream: typeof cream;
    'staked-uniswap': typeof stakedUniswap;
    esd: typeof esd;
    'esd-delegation': typeof esdDelegation;
    piedao: typeof piedao;
    'xdai-stake': typeof xDaiStake;
    'xdai-stake-delegation': typeof xDaiStakeDelegation;
    defidollar: typeof defidollar;
    aavegotchi: typeof aavegotchi;
    mithcash: typeof mithcash;
    stablexswap: typeof stablexswap;
    dittomoney: typeof dittomoney;
    'staked-keep': typeof stakedKeep;
    'balancer-unipool': typeof balancerUnipool;
    typhoon: typeof typhoon;
    delegation: typeof delegation;
    ticket: typeof ticket;
    work: typeof work;
    'ticket-validity': typeof ticketValidity;
    opium: typeof opium;
    'the-graph-balance': typeof theGraphBalance;
    'the-graph-delegation': typeof theGraphDelegation;
    'the-graph-indexing': typeof theGraphIndexing;
    whitelist: typeof whitelist;
    powerpool: typeof powerpool;
};
export default _default;
