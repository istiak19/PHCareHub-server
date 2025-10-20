import Stripe from "stripe";
import config from "../../config";

export const stripe = new Stripe(config.stripe.STRIPE_SECRET_KEY as string);