export type Hackathon = {
  version: "0.1.0";
  name: "hackathon";
  instructions: [
    {
      name: "createOriginator";
      accounts: [
        {
          name: "originator";
          isMut: true;
          isSigner: true;
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
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "offer";
          isMut: true;
          isSigner: true;
        },
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
      args: [
        {
          name: "title";
          type: "string";
        },
      ];
    },
    {
      name: "createInvestor";
      accounts: [
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
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "mint";
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
          name: "investor";
          isMut: false;
          isSigner: false;
        },
        {
          name: "investorTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
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
            name: "owner";
            type: "publicKey";
          },
        ];
      };
    },
    {
      name: "empty";
      type: {
        kind: "struct";
        fields: [];
      };
    },
    {
      name: "offer";
      type: {
        kind: "struct";
        fields: [
          {
            name: "title";
            type: "string";
          },
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "bump";
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
        ];
      };
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
          name: "originator",
          isMut: true,
          isSigner: true,
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
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "offer",
          isMut: true,
          isSigner: true,
        },
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
      args: [
        {
          name: "title",
          type: "string",
        },
      ],
    },
    {
      name: "createInvestor",
      accounts: [
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
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "mint",
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
          name: "investor",
          isMut: false,
          isSigner: false,
        },
        {
          name: "investorTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
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
            name: "owner",
            type: "publicKey",
          },
        ],
      },
    },
    {
      name: "empty",
      type: {
        kind: "struct",
        fields: [],
      },
    },
    {
      name: "offer",
      type: {
        kind: "struct",
        fields: [
          {
            name: "title",
            type: "string",
          },
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "bump",
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
        ],
      },
    },
  ],
};
