'use strict';
const { STRIPE_SECRET_KEY } = require('../../../secrets');
const stripe = require('stripe')(STRIPE_SECRET_KEY);

/**
 * Orders.js controller
 *
 * @description: A set of functions called "actions" for managing `Orders`.
 */

module.exports = {

  /**
   * Retrieve orders records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.orders.search(ctx.query);
    } else {
      return strapi.services.orders.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a orders record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.orders.fetch(ctx.params);
  },

  /**
   * Count orders records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.orders.count(ctx.query);
  },

  /**
   * Create a/an orders record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    const { address, amount, brews, postalCode, token, city } = ctx.request.body;

    // Send charge to Stripe
    const charge = await stripe.charges.create({
      amount: Math.floor(amount * 100),
      currency: 'usd',
      description: `Order ${new Date(Date.now())} - User ${ctx.state.user._id}`,
      source: token
    });

    // Create order in database
    const order = await strapi.services.orders.add({
      user: ctx.state.user._id,
      address,
      amount,
      brews,
      postalCode,
      city
    });

    return order;

    // Previously:
    // return strapi.services.orders.add(ctx.request.body);
  },

  /**
   * Update a/an orders record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.orders.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an orders record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.orders.remove(ctx.params);
  }
};
