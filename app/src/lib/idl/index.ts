export type Hackathon = {
  version: "0.1.0";
  name: "hackathon";
  instructions: [
    {
      name: "createOriginator";
      accounts: [
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "caller";
          isMut: true;
          isSigner: true;
        },
        {
          name: "originator";
          isMut: true;
          isSigner: false;
        },
        {
          name: "originatorTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stableCoin";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "name";
          type: "string";
        },
        {
          name: "description";
          type: "string";
        },
        {
          name: "tokenSlug";
          type: "string";
        },
      ];
    },
    {
      name: "editOriginator";
      accounts: [
        {
          name: "originator";
          isMut: true;
          isSigner: false;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "caller";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "name";
          type: "string";
        },
        {
          name: "description";
          type: "string";
        },
      ];
    },
    {
      name: "createOffer";
      accounts: [
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "caller";
          isMut: true;
          isSigner: true;
        },
        {
          name: "originator";
          isMut: true;
          isSigner: false;
        },
        {
          name: "offer";
          isMut: true;
          isSigner: false;
        },
        {
          name: "token";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stableToken";
          isMut: false;
          isSigner: false;
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "id";
          type: "string";
        },
        {
          name: "description";
          type: "string";
        },
        {
          name: "deadlineDate";
          type: "i64";
        },
        {
          name: "goalAmount";
          type: "u64";
        },
        {
          name: "startDate";
          type: {
            option: "i64";
          };
        },
        {
          name: "minAmountInvest";
          type: "u64";
        },
        {
          name: "interestRatePercent";
          type: "f32";
        },
        {
          name: "installmentsTotal";
          type: "u8";
        },
        {
          name: "installmentsStartDate";
          type: {
            option: "i64";
          };
        },
      ];
    },
    {
      name: "invest";
      accounts: [
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "caller";
          isMut: true;
          isSigner: true;
        },
        {
          name: "investorOfferTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "vaultTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "investorTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "offer";
          isMut: true;
          isSigner: false;
        },
        {
          name: "offerToken";
          isMut: true;
          isSigner: false;
        },
        {
          name: "investor";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
      ];
    },
    {
      name: "withdrawInvestments";
      accounts: [
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: "createInvestor";
      accounts: [
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "caller";
          isMut: true;
          isSigner: true;
        },
        {
          name: "investor";
          isMut: true;
          isSigner: false;
        },
        {
          name: "investorTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stableCoin";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "name";
          type: "string";
        },
      ];
    },
    {
      name: "editInvestor";
      accounts: [
        {
          name: "investor";
          isMut: true;
          isSigner: false;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "name";
          type: "string";
        },
      ];
    },
    {
      name: "depositTokens";
      accounts: [
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "caller";
          isMut: true;
          isSigner: true;
        },
        {
          name: "investor";
          isMut: true;
          isSigner: false;
        },
        {
          name: "investorTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stableCoin";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
      ];
    },
    {
      name: "withdrawTokens";
      accounts: [
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "caller";
          isMut: true;
          isSigner: true;
        },
        {
          name: "investor";
          isMut: true;
          isSigner: false;
        },
        {
          name: "investorTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "toTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stableCoin";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
      ];
    },
  ];
  accounts: [
    {
      name: "investor";
      type: {
        kind: "struct";
        fields: [
          {
            name: "name";
            type: "string";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "tokenAccountBump";
            type: "u8";
          },
        ];
      };
    },
    {
      name: "offer";
      type: {
        kind: "struct";
        fields: [
          {
            name: "id";
            type: "string";
          },
          {
            name: "description";
            type: "string";
          },
          {
            name: "discriminator";
            type: "u32";
          },
          {
            name: "interestRatePercent";
            type: "f32";
          },
          {
            name: "goalAmount";
            type: "u64";
          },
          {
            name: "deadlineDate";
            type: "i64";
          },
          {
            name: "acquiredAmount";
            type: "u64";
          },
          {
            name: "originator";
            type: "publicKey";
          },
          {
            name: "installmentsTotal";
            type: "u8";
          },
          {
            name: "installmentsStartDate";
            type: {
              option: "i64";
            };
          },
          {
            name: "minAmountInvest";
            type: "u64";
          },
          {
            name: "startDate";
            type: {
              option: "i64";
            };
          },
          {
            name: "creditScore";
            type: "u16";
          },
          {
            name: "createdAt";
            type: "i64";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "tokenBump";
            type: "u8";
          },
          {
            name: "vaultBump";
            type: "u8";
          },
        ];
      };
    },
    {
      name: "originator";
      type: {
        kind: "struct";
        fields: [
          {
            name: "name";
            type: "string";
          },
          {
            name: "description";
            type: "string";
          },
          {
            name: "totalOffers";
            type: "u32";
          },
          {
            name: "tokenSlug";
            type: "string";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "tokenAccountBump";
            type: "u8";
          },
        ];
      };
    },
  ];
  types: [
    {
      name: "OfferStatus";
      type: {
        kind: "enum";
        variants: [
          {
            name: "Open";
          },
          {
            name: "Failed";
          },
          {
            name: "Funded";
          },
          {
            name: "OnTrack";
          },
          {
            name: "Finished";
          },
        ];
      };
    },
    {
      name: "CreditScore";
      type: {
        kind: "enum";
        variants: [
          {
            name: "AAA";
          },
          {
            name: "AA";
          },
          {
            name: "A";
          },
          {
            name: "BBB";
          },
          {
            name: "BB";
          },
          {
            name: "B";
          },
          {
            name: "CCC";
          },
          {
            name: "CC";
          },
          {
            name: "C";
          },
          {
            name: "DDD";
          },
          {
            name: "DD";
          },
          {
            name: "D";
          },
        ];
      };
    },
  ];
  errors: [
    {
      code: 6000;
      name: "MinAmountRequired";
      msg: "Min amount required";
    },
    {
      code: 6001;
      name: "GoalAmountExceeded";
      msg: "Goal amount exceeded";
    },
    {
      code: 6002;
      name: "OfferIsNotOpen";
      msg: "The Offer is not open";
    },
  ];
};

export const IDL: Hackathon = {
  version: "0.1.0",
  name: "hackathon",
  instructions: [
    {
      name: "createOriginator",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "caller",
          isMut: true,
          isSigner: true,
        },
        {
          name: "originator",
          isMut: true,
          isSigner: false,
        },
        {
          name: "originatorTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stableCoin",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "description",
          type: "string",
        },
        {
          name: "tokenSlug",
          type: "string",
        },
      ],
    },
    {
      name: "editOriginator",
      accounts: [
        {
          name: "originator",
          isMut: true,
          isSigner: false,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "caller",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "description",
          type: "string",
        },
      ],
    },
    {
      name: "createOffer",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "caller",
          isMut: true,
          isSigner: true,
        },
        {
          name: "originator",
          isMut: true,
          isSigner: false,
        },
        {
          name: "offer",
          isMut: true,
          isSigner: false,
        },
        {
          name: "token",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stableToken",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "id",
          type: "string",
        },
        {
          name: "description",
          type: "string",
        },
        {
          name: "deadlineDate",
          type: "i64",
        },
        {
          name: "goalAmount",
          type: "u64",
        },
        {
          name: "startDate",
          type: {
            option: "i64",
          },
        },
        {
          name: "minAmountInvest",
          type: "u64",
        },
        {
          name: "interestRatePercent",
          type: "f32",
        },
        {
          name: "installmentsTotal",
          type: "u8",
        },
        {
          name: "installmentsStartDate",
          type: {
            option: "i64",
          },
        },
      ],
    },
    {
      name: "invest",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "caller",
          isMut: true,
          isSigner: true,
        },
        {
          name: "investorOfferTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vaultTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "investorTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "offer",
          isMut: true,
          isSigner: false,
        },
        {
          name: "offerToken",
          isMut: true,
          isSigner: false,
        },
        {
          name: "investor",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "withdrawInvestments",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "createInvestor",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "caller",
          isMut: true,
          isSigner: true,
        },
        {
          name: "investor",
          isMut: true,
          isSigner: false,
        },
        {
          name: "investorTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stableCoin",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "name",
          type: "string",
        },
      ],
    },
    {
      name: "editInvestor",
      accounts: [
        {
          name: "investor",
          isMut: true,
          isSigner: false,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "name",
          type: "string",
        },
      ],
    },
    {
      name: "depositTokens",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "caller",
          isMut: true,
          isSigner: true,
        },
        {
          name: "investor",
          isMut: true,
          isSigner: false,
        },
        {
          name: "investorTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stableCoin",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "withdrawTokens",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "caller",
          isMut: true,
          isSigner: true,
        },
        {
          name: "investor",
          isMut: true,
          isSigner: false,
        },
        {
          name: "investorTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "toTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stableCoin",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "investor",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "tokenAccountBump",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "offer",
      type: {
        kind: "struct",
        fields: [
          {
            name: "id",
            type: "string",
          },
          {
            name: "description",
            type: "string",
          },
          {
            name: "discriminator",
            type: "u32",
          },
          {
            name: "interestRatePercent",
            type: "f32",
          },
          {
            name: "goalAmount",
            type: "u64",
          },
          {
            name: "deadlineDate",
            type: "i64",
          },
          {
            name: "acquiredAmount",
            type: "u64",
          },
          {
            name: "originator",
            type: "publicKey",
          },
          {
            name: "installmentsTotal",
            type: "u8",
          },
          {
            name: "installmentsStartDate",
            type: {
              option: "i64",
            },
          },
          {
            name: "minAmountInvest",
            type: "u64",
          },
          {
            name: "startDate",
            type: {
              option: "i64",
            },
          },
          {
            name: "creditScore",
            type: "u16",
          },
          {
            name: "createdAt",
            type: "i64",
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "tokenBump",
            type: "u8",
          },
          {
            name: "vaultBump",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "originator",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "description",
            type: "string",
          },
          {
            name: "totalOffers",
            type: "u32",
          },
          {
            name: "tokenSlug",
            type: "string",
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "tokenAccountBump",
            type: "u8",
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "OfferStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Open",
          },
          {
            name: "Failed",
          },
          {
            name: "Funded",
          },
          {
            name: "OnTrack",
          },
          {
            name: "Finished",
          },
        ],
      },
    },
    {
      name: "CreditScore",
      type: {
        kind: "enum",
        variants: [
          {
            name: "AAA",
          },
          {
            name: "AA",
          },
          {
            name: "A",
          },
          {
            name: "BBB",
          },
          {
            name: "BB",
          },
          {
            name: "B",
          },
          {
            name: "CCC",
          },
          {
            name: "CC",
          },
          {
            name: "C",
          },
          {
            name: "DDD",
          },
          {
            name: "DD",
          },
          {
            name: "D",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "MinAmountRequired",
      msg: "Min amount required",
    },
    {
      code: 6001,
      name: "GoalAmountExceeded",
      msg: "Goal amount exceeded",
    },
    {
      code: 6002,
      name: "OfferIsNotOpen",
      msg: "The Offer is not open",
    },
  ],
};
