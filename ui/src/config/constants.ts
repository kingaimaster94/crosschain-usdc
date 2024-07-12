import * as testnetConstants from "./testnetConstants";
import * as mainnetConstants from "./mainnetConstants";

const env = process.env.NEXT_PUBLIC_ENVIRONMENT;

const config = env === "testnet" ? testnetConstants : mainnetConstants ;

export default config;

