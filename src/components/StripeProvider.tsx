"use client";

import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { STRIPE_CONFIG } from "@/lib/stripe-config";

// Initialize Stripe with your publishable key
let stripePromise: Promise<Stripe | null> | null = null;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);
  }
  return stripePromise;
};

interface StripeProviderProps {
  children: React.ReactNode;
  clientSecret?: string;
  appearance?: {
    theme?: "stripe" | "night" | "flat";
    variables?: Record<string, string>;
  };
}

/**
 * Stripe Provider Component
 * Wraps components that need Stripe Elements
 * @param children - Child components
 * @param clientSecret - Payment intent client secret
 * @param appearance - Stripe Elements appearance customization
 */
const StripeProvider: React.FC<StripeProviderProps> = ({
  children,
  clientSecret,
  appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#2563eb",
      colorBackground: "#ffffff",
      colorText: "#1f2937",
      colorDanger: "#ef4444",
      fontFamily: "system-ui, sans-serif",
      spacingUnit: "4px",
      borderRadius: "8px",
    },
  },
}) => {
  const stripe = getStripe();

  // If no client secret, render children without Elements wrapper
  if (!clientSecret) {
    return <>{children}</>;
  }

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Elements stripe={stripe} options={options}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
