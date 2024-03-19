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
