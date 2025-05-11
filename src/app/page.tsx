// src/app/page.tsx

"use client";

import {
  Blink,
  useBlink,
  useActionsRegistryInterval,
} from "@dialectlabs/blinks";

import "@dialectlabs/blinks/index.css";

import { useEvmWagmiAdapter } from "@dialectlabs/blinks/hooks/evm";

import { ConnectKitButton, useModal } from "connectkit";
import { useAccount, useBalance } from "wagmi";
import { monadTestnet } from "wagmi/chains";
import { useState, useEffect, useRef } from "react";
import { formatUnits } from "viem";

const DONATION_WALLET =
  process.env.NEXT_PUBLIC_DONATION_WALLET || "你的捐赠钱包地址";

export default function Home() {
  // Actions registry interval
  useActionsRegistryInterval();

  // ConnectKit modal
  const { setOpen } = useModal();

  // Wagmi adapter, used to connect to the wallet
  const { adapter } = useEvmWagmiAdapter({
    onConnectWalletRequest: async () => {
      setOpen(true);
    },
  });

  // Action we want to execute in the Blink
  const { blink, isLoading } = useBlink({
    url: "evm-action:http://localhost:3000/api/actions/donate-mon",
  });

  const { address, isConnected } = useAccount();
  const { data: balance, isLoading: isBalanceLoading } = useBalance(
    address
      ? {
          address,
          chainId: monadTestnet.id,
        }
      : { address: undefined }
  );

  const [showModal, setShowModal] = useState(false);
  const [prevBalance, setPrevBalance] = useState<string | undefined>();
  const [lastDonation, setLastDonation] = useState<{
    from?: string;
    to?: string;
    prevBalance?: string;
    postBalance?: string;
    time?: string;
  } | null>(null);
  const lastAmountRef = useRef<string | undefined>(undefined);

  // 拦截 Blink 按钮点击，记录 prevBalance 到 pendingDonation
  useEffect(() => {
    if (!blink) return;
    const container = document.querySelector(".dialect-blink");
    if (!container) return;
    const handler = (e: Event) => {
      let target = e.target as HTMLElement;
      while (target && target.tagName !== "BUTTON" && target !== container) {
        target = target.parentElement as HTMLElement;
      }
      if (target && target.tagName === "BUTTON") {
        // 记录"待确认捐赠"，只存 prevBalance
        if (balance?.value) {
          const pending = {
            from: address,
            to: DONATION_WALLET,
            prevBalance: balance.value.toString(),
            time: new Date().toLocaleString(),
          };
          localStorage.setItem("pendingDonation", JSON.stringify(pending));
        }
      }
    };
    container.addEventListener("click", handler);
    return () => container.removeEventListener("click", handler);
  }, [blink, address, balance?.value]);

  // 页面加载时读取最近一条捐赠记录
  useEffect(() => {
    const record = localStorage.getItem("lastDonation");
    if (record) {
      setLastDonation(JSON.parse(record));
    }
  }, []);

  useEffect(() => {
    if (
      prevBalance &&
      balance?.value &&
      prevBalance !== balance.value.toString()
    ) {
      // 读取"待确认捐赠"
      const pending = localStorage.getItem("pendingDonation");
      let record;
      if (pending) {
        record = JSON.parse(pending);
        // 清理 pending
        localStorage.removeItem("pendingDonation");
        // 存 postBalance
        record.postBalance = balance.value.toString();
      } else {
        // 兜底
        record = {
          from: address,
          to: DONATION_WALLET,
          prevBalance,
          postBalance: balance.value.toString(),
          time: new Date().toLocaleString(),
        };
      }
      setLastDonation(record);
      setShowModal(true);
      // 保存到 localStorage
      localStorage.setItem("lastDonation", JSON.stringify(record));
    }
    if (balance?.value) {
      setPrevBalance(balance.value.toString());
    }
  }, [balance?.value]);

  return (
    <main className="flex flex-col items-center justify-center">
      {showModal && lastDonation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg text-center">
            <div className="text-2xl font-bold mb-2">感谢您的捐赠！</div>
            <div className="text-left text-gray-700 text-sm">
              <div>时间：{lastDonation.time}</div>
              <div>捐赠人：{lastDonation.from}</div>
              <div>接收人：{lastDonation.to}</div>
              <div>
                余额变化：
                {balance && lastDonation.prevBalance
                  ? Number(
                      formatUnits(
                        BigInt(lastDonation.prevBalance),
                        balance.decimals
                      )
                    ).toFixed(4)
                  : "--"}
                {" → "}
                {balance && lastDonation.postBalance
                  ? Number(
                      formatUnits(
                        BigInt(lastDonation.postBalance),
                        balance.decimals
                      )
                    ).toFixed(4)
                  : "--"}{" "}
                MON
              </div>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setShowModal(false)}
            >
              关闭
            </button>
          </div>
        </div>
      )}
      <ConnectKitButton />
      {isConnected && (
        <div className="my-4 p-4 bg-white rounded-lg shadow text-center w-full max-w-md">
          <div className="text-gray-500 text-sm mb-1">钱包余额</div>
          <div className="text-2xl font-bold text-blue-600">
            {isBalanceLoading
              ? "加载中..."
              : balance?.value
              ? `${Number(formatUnits(balance.value, balance.decimals)).toFixed(
                  4
                )} MON`
              : "-- MON"}
          </div>
          {/* 最近一条捐赠记录 */}
          {lastDonation && (
            <div className="my-4 p-3 bg-gray-50 rounded shadow text-sm text-gray-700">
              <div className="font-bold mb-1">最近一条捐赠记录</div>
              <div>时间：{lastDonation.time}</div>
              <div>捐赠人：{lastDonation.from}</div>
              <div>接收人：{lastDonation.to}</div>
              <div>
                余额变化：
                {balance && lastDonation.prevBalance
                  ? Number(
                      formatUnits(
                        BigInt(lastDonation.prevBalance),
                        balance.decimals
                      )
                    ).toFixed(4)
                  : "--"}
                {" → "}
                {balance && lastDonation.postBalance
                  ? Number(
                      formatUnits(
                        BigInt(lastDonation.postBalance),
                        balance.decimals
                      )
                    ).toFixed(4)
                  : "--"}{" "}
                MON
              </div>
            </div>
          )}
        </div>
      )}
      <div className="w-1/2 lg:px-4 lg:p-8">
        {isLoading || !blink ? (
          <span>Loading</span>
        ) : (
          // Blink component, used to execute the action
          <Blink blink={blink} adapter={adapter} securityLevel="all" />
        )}
      </div>
    </main>
  );
}
