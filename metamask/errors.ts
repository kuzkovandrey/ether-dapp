export type MetamaskError = {
  code: number;
  message: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getMetamastError = (error: any): MetamaskError => {
  const { code, message } = error?.error || error?.info?.error || {};

  if (typeof code === 'number' && typeof message === 'string') {
    return { code, message: errorMessages[code] || UNKNOWN_ERROR };
  }

  return {
    code: 0,
    message: 'unknown error',
  };
};

const errorMessages: { [key: string]: string } = {
  '4001': 'User rejected the request.',
  '4100': 'The requested account and/or method has not been authorized by the user.',
  '4200': 'The requested method is not supported by this Ethereum provider.',
  '4900': 'The provider is disconnected from all chains.',
  '4901': 'The provider is disconnected from the specified chain.',
  '-32700': 'Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.',
  '-32600': 'The JSON sent is not a valid Request object.',
  '-32601': 'The method does not exist / is not available.',
  '-32602': 'Invalid method parameter(s).',
  '-32603': 'Internal JSON-RPC error.',
  '-32000': 'Invalid input.',
  '-32001': 'Resource not found.',
  '-32002': 'Resource unavailable.',
  '-32003': 'Transaction rejected.',
  '-32004': 'Method not supported.',
  '-32005': 'Request limit exceeded.',
};

const UNKNOWN_ERROR = 'Unknown error';
