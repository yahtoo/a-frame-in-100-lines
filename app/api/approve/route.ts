import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData, parseEther } from 'viem';
import { mainnet } from 'viem/chains';
import UniswapAbi from '../../_contracts/UniswapRouterABI';
import { UNISWAP_CONTRACT_ADDR } from '../../config';
import type { FrameTransactionResponse } from '@coinbase/onchainkit/frame';

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  const body: FrameRequest = await req.json();
  // Remember to replace 'NEYNAR_ONCHAIN_KIT' with your own Neynar API key
  const { isValid } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  const data = encodeFunctionData({
    abi: UniswapAbi,
    functionName: 'execute',
    args: [
      '0x0b000604',
      [
        '0x0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000016345785d8a0000',
        '0x0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000016345785d8a00000000000000000000000000000000000000000000000000000000000016c8cf4a00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002bc02aaa39b223fe8d0a0e5c4f27ead9083c756cc20001f4a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000',
        '0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800000000000000000000000027213e28d7fda5c57fe9e5dd923818dbccf71c470000000000000000000000000000000000000000000000000000000000000019',
        '0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000016c8cf4a',
      ],
      0x66542423n,
    ],
  });

  const txData: FrameTransactionResponse = {
    chainId: `eip155:${mainnet.id}`,
    method: 'eth_sendTransaction',
    params: {
      abi: [],
      data,
      to: UNISWAP_CONTRACT_ADDR,
      value: parseEther('0.1').toString(), // 0.1 ETH
    },
  };
  return NextResponse.json(txData);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
