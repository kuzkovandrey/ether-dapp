import { Contract } from 'ethers';
import { useEffect, useRef, useState } from 'react';

import { useMetamaskProvider } from '../providers';

const erc20Abi = ['event Transfer(address indexed src, address indexed dst, uint val)'];

type SubscribeParams = {
  from?: string;
  to?: string;
  address: string;
};

type TokenEvent = {
  from: string;
  to: string;
  value: string;
  eventData: unknown;
};

function useTokenEvents() {
  const { provider, isSupported } = useMetamaskProvider();
  const contractRef = useRef<Contract | null>(null);
  const [events, setEvents] = useState<Array<TokenEvent>>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const subscribe = ({ address, to: _to, from: _from }: SubscribeParams) => {
    if (isSupported) {
      contractRef.current = new Contract(address, erc20Abi, provider);

      contractRef.current.filters.Transfer(_from, _to);
      contractRef.current.on('Transfer', (from: string, to: string, value: string, eventData: unknown) => {
        setEvents((e) => [...e, { from, to, value, eventData }]);
      });
      setIsSubscribed(true);
    }
  };

  const unsubscribe = () => {
    contractRef.current?.off('Transfer');
    contractRef.current = null;
    setEvents([]);
    setIsSubscribed(false);
  };

  useEffect(() => {
    if (provider) {
      unsubscribe();
    }
  }, [provider]);

  return {
    subscribe,
    unsubscribe,
    events,
    isSubscribed,
  };
}

export default useTokenEvents;
