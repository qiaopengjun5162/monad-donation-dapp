// src/app/api/actions/donate-mon/route.ts

import { ActionGetResponse, ActionPostResponse } from "@solana/actions";
import { serialize } from "wagmi";
import { parseEther } from "viem";

// CAIP-2 format for Monad
const blockchain = `eip155:10143`;

// Create headers with CAIP blockchain ID
const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers":
        "Content-Type, x-blockchain-ids, x-action-version",
    "Content-Type": "application/json",
    "x-blockchain-ids": blockchain,
    "x-action-version": "2.0",
};

// OPTIONS endpoint is required for CORS preflight requests
// Your Blink won't render if you don't add this
export const OPTIONS = async () => {
    return new Response(null, { headers });
};



// GET endpoint returns the Blink metadata (JSON) and UI configuration
export const GET = async (req: Request) => {
    // This JSON is used to render the Blink UI
    const response: ActionGetResponse = {
        type: "action",
        icon: `${new URL("/donate-mon.png", req.url).toString()}`,
        label: "1 MON",
        title: "Donate MON",
        description:
            "This Blink demonstrates how to donate MON on the Monad blockchain. It is a part of the official Blink Starter Guides by Dialect Labs.  \n\nLearn how to build this Blink: https://dialect.to/docs/guides/donate-mon",
        // Links is used if you have multiple actions or if you need more than one params
        links: {
            actions: [
                {
                    // Defines this as a blockchain transaction
                    type: "transaction",
                    label: "0.01 MON",
                    // This is the endpoint for the POST request
                    href: `/api/actions/donate-mon?amount=0.01`,
                },
                {
                    type: "transaction",
                    label: "0.05 MON",
                    href: `/api/actions/donate-mon?amount=0.05`,
                },
                {
                    type: "transaction",
                    label: "0.1 MON",
                    href: `/api/actions/donate-mon?amount=0.1`,
                },
                {
                    // Example for a custom input field
                    type: "transaction",
                    href: `/api/actions/donate-mon?amount={amount}`,
                    label: "Donate",
                    parameters: [
                        {
                            name: "amount",
                            label: "Enter a custom MON amount",
                            type: "number",
                        },
                    ],
                },
            ],
        },
    };

    // Return the response with proper headers
    return new Response(JSON.stringify(response), {
        status: 200,
        headers,
    });
};

// Wallet address that will receive the donations
// const donationWallet = `0x750Ea21c1e98CcED0d4557196B6f4a5974CCB6f5`;
const donationWallet = process.env.NEXT_PUBLIC_DONATION_WALLET!;

// POST endpoint handles the actual transaction creation
export const POST = async (req: Request) => {
    try {
        // Extract amount from URL
        const url = new URL(req.url);
        const amount = url.searchParams.get("amount");

        if (!amount) {
            throw new Error("Amount is required");
        }

        // Build the transaction
        const transaction = {
            to: donationWallet,
            value: parseEther(amount).toString(),
            chainId: 10143,
        };

        const transactionJson = serialize(transaction);

        // Build ActionPostResponse
        const response: ActionPostResponse = {
            type: "transaction",
            transaction: transactionJson,
            message: "Donate MON",
        };

        // Return the response with proper headers
        return new Response(JSON.stringify(response), {
            status: 200,
            headers,
        });

    } catch (error) {
        // Log and return an error response
        console.error("Error processing request:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers,
        });
    }
};