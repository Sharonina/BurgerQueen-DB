const detailedOrderAggregation = [
  {
    $lookup: {
      from: "products",
      as: "products",
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
      ],
      let: { products: "$products" },
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
      localField: "restaurant",
      foreignField: "_id",
      as: "restaurant",
    },
  },
  { $unwind: "$restaurant" },
  //populate waiter
  {
    $lookup: {
      from: "users",
      as: "waiter",
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$_id", "$$waiter"],
            },
          },
        },
      ],
      localField: "waiter",
      foreignField: "_id",
      as: "waiter",
    },
  },
  { $unwind: "$waiter" },
];

module.exports = { detailedOrderAggregation };
