export type MetamaskError = {
  code: 'ACTION_REJECTED'; // TODO: add error codes;
  info: {
    error: {
      code: number;
      message: string;
    };
  };
};
