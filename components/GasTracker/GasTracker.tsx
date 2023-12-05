"use client";

import { getProvider, type GasProrityFee } from "@/api";
import { useGasTracker } from "@/hooks";
import { Card, Flex, Text } from "@radix-ui/themes";
import { useEffect, useRef } from "react";

function GasTracker() {
  const { gasPriorityFee, isLoading, update } = useGasTracker();

  useEffect(() => {
    const provider = getProvider();

    provider.on("block", update);

    return () => {
      provider.off("block", update);
    };
  }, []);

  return (
    <Flex position="relative" direction="column" gap="1">
      <Flex
        direction={{ initial: "column", sm: "row" }}
        width="100%"
        justify="between"
        gap="4"
      >
        {Object.entries(gasPriorityFee.priorityFees).map(
          ([priority, priorityFee], key) => (
            <Fee
              key={key}
              priority={priority}
              priorityFee={priorityFee}
              baseFeePerGas={gasPriorityFee.baseFeePerGas}
            />
          )
        )}
      </Flex>
      {isLoading && (
        <Text
          style={{ position: "absolute", bottom: "-1.5rem", left: 0 }}
          size="2"
          color="indigo"
        >
          Updating...
        </Text>
      )}
    </Flex>
  );
}

type FeeProps = {
  baseFeePerGas: GasProrityFee["baseFeePerGas"];
  priorityFee: string;
  priority: string;
};

function Fee({ baseFeePerGas, priorityFee, priority }: FeeProps) {
  const totalFee = Number(baseFeePerGas) + Number(priorityFee);

  return (
    <Card style={{ padding: "0.5rem", width: "100%" }}>
      <Flex align="center" direction="column" gap="2">
        <Text
          weight="bold"
          style={{ textTransform: "capitalize", whiteSpace: "nowrap" }}
          size="4"
        >
          {priority}
        </Text>
        <Text
          style={{ whiteSpace: "nowrap" }}
          weight="bold"
          color="green"
          size="8"
        >
          {totalFee} gwei
        </Text>
        <Text color="gray" size="3">
          Base: {baseFeePerGas} | Priority: {priorityFee}
        </Text>
      </Flex>
    </Card>
  );
}

export default GasTracker;
