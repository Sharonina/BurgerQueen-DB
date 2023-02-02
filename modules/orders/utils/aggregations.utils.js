const detailedOrderAggregation = [
  {
    $lookup: {
      from: "products",
      as: "products",
      let: { products: "$products" },
      pipeline: [
        {
          $match: {
            $expr: {
              $in: ["$_id", "$$products"],
            },
          },
        },
        {
          $addFields: {
            quantity: {
              $sum: {
                $map: {
                  input: "$$products",
                  as: "product",
                  in: {
                    $cond: [{ $eq: ["$$product", "$_id"] }, 1, 0],
                  },
                },
              },
            },
          },
        },
        {
          $project: {
            __v: 0,
          },
        },
      ],
    },
  },
  {
    $addFields: {
      quantity: { $size: "$products" },
      total: {
        $sum: {
          $map: {
            input: "$products",
            as: "product",
            in: { $multiply: ["$$product.price", "$$product.quantity"] },
          },
        },
      },
    },
  },
  //populate restaurant
  {
    $lookup: {
      from: "restaurants",
      as: "restaurant",
      let: { restaurant: "$restaurant" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$_id", "$$restaurant"],
            },
          },
        },
        {
          $project: {
            __v: 0,
          },
        },
      ],
    },
  },
  { $unwind: "$restaurant" },
  //populate waiter
  {
    $lookup: {
      from: "users",
      as: "waiter",
      let: { waiter: "$waiter" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$_id", "$$waiter"],
            },
          },
        },
        {
          $project: {
            password: 0,
            __v: 0,
            admin: 0,
            email: 0,
            restaurant: 0,
          },
        },
      ],
    },
  },
  { $unwind: "$waiter" },
  {
    $project: {
      __v: 0,
    },
  },
];

module.exports = { detailedOrderAggregation };
