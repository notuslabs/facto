export type Hackathon = {
  "version": "0.1.0",
  "name": "hackathon",
  "instructions": [
    {
      "name": "createOriginator",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "caller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "originator",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "originator"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "caller"
              }
            ]
          }
        },
        {
          "name": "originatorTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "originator_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Originator",
                "path": "originator"
              }
            ]
          }
        },
        {
          "name": "stableCoin",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "tokenSlug",
          "type": "string"
        }
      ]
    },
    {
      "name": "createOffer",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "caller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "originator",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "originator"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "caller"
              }
            ]
          }
        },
        {
          "name": "offer",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "offer"
              },
              {
                "kind": "arg",
                "type": "string",
                "path": "id"
              }
            ]
          }
        },
        {
          "name": "token",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "offer_token"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Offer",
                "path": "offer"
              }
            ]
          }
        },
        {
          "name": "stableToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "offer_vault"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Offer",
                "path": "offer"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "deadlineDate",
          "type": "i64"
        },
        {
          "name": "goalAmount",
          "type": "u64"
        },
        {
          "name": "startDate",
          "type": "i64"
        },
        {
          "name": "minAmountInvest",
          "type": "u64"
        },
        {
          "name": "installmentsCount",
          "type": "u8"
        },
        {
          "name": "installmentsTotalAmount",
          "type": "u64"
        },
        {
          "name": "installmentsNextPaymentDate",
          "type": "i64"
        }
      ]
    },
    {
      "name": "invest",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "caller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "investorOfferTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_offer_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Investor",
                "path": "investor"
              }
            ]
          }
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "offer_vault"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Offer",
                "path": "offer"
              }
            ]
          }
        },
        {
          "name": "investorTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Investor",
                "path": "investor"
              }
            ]
          }
        },
        {
          "name": "offer",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "offer"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Offer",
                "path": "offer.id"
              }
            ]
          }
        },
        {
          "name": "offerToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "investor",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "caller"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawInvestments",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "caller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "offer_vault"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Offer",
                "path": "offer"
              }
            ]
          }
        },
        {
          "name": "originatorTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "originator_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Originator",
                "path": "originator"
              }
            ]
          }
        },
        {
          "name": "originator",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "originator"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "caller"
              }
            ]
          }
        },
        {
          "name": "offer",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "offer"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Offer",
                "path": "offer.id"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "payInstallment",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "caller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "offer",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "offer"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Offer",
                "path": "offer.id"
              }
            ]
          }
        },
        {
          "name": "stableToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultPaymentTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "offer_payment_vault"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Offer",
                "path": "offer"
              }
            ]
          }
        },
        {
          "name": "originatorTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "originator_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Originator",
                "path": "originator"
              }
            ]
          }
        },
        {
          "name": "originator",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "originator"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "caller"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "withdrawInstallment",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "investorInstallment",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_installment"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Offer",
                "path": "offer"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Investor",
                "path": "investor"
              }
            ]
          }
        },
        {
          "name": "ownerInvestor",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "investor",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "owner_investor"
              }
            ]
          }
        },
        {
          "name": "investorOfferTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_offer_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Investor",
                "path": "investor"
              }
            ]
          }
        },
        {
          "name": "investorTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Investor",
                "path": "investor"
              }
            ]
          }
        },
        {
          "name": "vaultPaymentTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "offer_payment_vault"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Offer",
                "path": "offer"
              }
            ]
          }
        },
        {
          "name": "offerToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offer",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "offer"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Offer",
                "path": "offer.id"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "editOriginator",
      "accounts": [
        {
          "name": "originator",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "originator"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "caller"
              }
            ]
          }
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "caller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        }
      ]
    },
    {
      "name": "createInvestor",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "caller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "investor",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "caller"
              }
            ]
          }
        },
        {
          "name": "investorTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Investor",
                "path": "investor"
              }
            ]
          }
        },
        {
          "name": "stableCoin",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "editInvestor",
      "accounts": [
        {
          "name": "investor",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "depositTokens",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "caller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "investor",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "caller"
              }
            ]
          }
        },
        {
          "name": "investorTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Investor",
                "path": "investor"
              }
            ]
          }
        },
        {
          "name": "stableCoin",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawTokens",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "caller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "investor",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "caller"
              }
            ]
          }
        },
        {
          "name": "investorTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Investor",
                "path": "investor"
              }
            ]
          }
        },
        {
          "name": "toTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stableCoin",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "investor",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "tokenAccountBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "investorInstallments",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "countReceived",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "offer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "discriminator",
            "type": "u32"
          },
          {
            "name": "interestRatePercent",
            "type": "f32"
          },
          {
            "name": "goalAmount",
            "type": "u64"
          },
          {
            "name": "deadlineDate",
            "type": "i64"
          },
          {
            "name": "acquiredAmount",
            "type": "u64"
          },
          {
            "name": "originator",
            "type": "publicKey"
          },
          {
            "name": "installmentsCount",
            "type": "u8"
          },
          {
            "name": "installmentsTotalAmount",
            "type": "u64"
          },
          {
            "name": "totalInstallmentsPaid",
            "type": "u8"
          },
          {
            "name": "installmentsNextPaymentDate",
            "type": "i64"
          },
          {
            "name": "minAmountInvest",
            "type": "u64"
          },
          {
            "name": "startDate",
            "type": "i64"
          },
          {
            "name": "creditScore",
            "type": "u16"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "tokenBump",
            "type": "u8"
          },
          {
            "name": "vaultBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "originator",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "totalOffers",
            "type": "u32"
          },
          {
            "name": "tokenSlug",
            "type": "string"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "tokenAccountBump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "OfferStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Open"
          },
          {
            "name": "Failed"
          },
          {
            "name": "Funded"
          },
          {
            "name": "OnTrack"
          },
          {
            "name": "Finished"
          }
        ]
      }
    },
    {
      "name": "CreditScore",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "AAA"
          },
          {
            "name": "AA"
          },
          {
            "name": "A"
          },
          {
            "name": "BBB"
          },
          {
            "name": "BB"
          },
          {
            "name": "B"
          },
          {
            "name": "CCC"
          },
          {
            "name": "CC"
          },
          {
            "name": "C"
          },
          {
            "name": "DDD"
          },
          {
            "name": "DD"
          },
          {
            "name": "D"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "MaxNameLengthExceeded",
      "msg": "Max name length exceeded. Maximum length is 30"
    },
    {
      "code": 6001,
      "name": "AmountMustBeEqualToOrGreaterThanOne",
      "msg": "Amount must be equal to or greater than 1"
    },
    {
      "code": 6002,
      "name": "InsufficientBalance",
      "msg": "Insufficient balance"
    }
  ]
};

export const IDL: Hackathon = {
  "version": "0.1.0",
  "name": "hackathon",
  "instructions": [
    {
      "name": "createOriginator",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "caller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "originator",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "originator"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "caller"
              }
            ]
          }
        },
        {
          "name": "originatorTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "originator_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Originator",
                "path": "originator"
              }
            ]
          }
        },
        {
          "name": "stableCoin",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "tokenSlug",
          "type": "string"
        }
      ]
    },
    {
      "name": "createOffer",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "caller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "originator",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "originator"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "caller"
              }
            ]
          }
        },
        {
          "name": "offer",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "offer"
              },
              {
                "kind": "arg",
                "type": "string",
                "path": "id"
              }
            ]
          }
        },
        {
          "name": "token",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "offer_token"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Offer",
                "path": "offer"
              }
            ]
          }
        },
        {
          "name": "stableToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "offer_vault"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Offer",
                "path": "offer"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "deadlineDate",
          "type": "i64"
        },
        {
          "name": "goalAmount",
          "type": "u64"
        },
        {
          "name": "startDate",
          "type": "i64"
        },
        {
          "name": "minAmountInvest",
          "type": "u64"
        },
        {
          "name": "installmentsCount",
          "type": "u8"
        },
        {
          "name": "installmentsTotalAmount",
          "type": "u64"
        },
        {
          "name": "installmentsNextPaymentDate",
          "type": "i64"
        }
      ]
    },
    {
      "name": "invest",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "caller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "investorOfferTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_offer_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Investor",
                "path": "investor"
              }
            ]
          }
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "offer_vault"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Offer",
                "path": "offer"
              }
            ]
          }
        },
        {
          "name": "investorTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Investor",
                "path": "investor"
              }
            ]
          }
        },
        {
          "name": "offer",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "offer"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Offer",
                "path": "offer.id"
              }
            ]
          }
        },
        {
          "name": "offerToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "investor",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "caller"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawInvestments",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "caller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "offer_vault"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Offer",
                "path": "offer"
              }
            ]
          }
        },
        {
          "name": "originatorTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "originator_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Originator",
                "path": "originator"
              }
            ]
          }
        },
        {
          "name": "originator",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "originator"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "caller"
              }
            ]
          }
        },
        {
          "name": "offer",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "offer"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Offer",
                "path": "offer.id"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "payInstallment",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "caller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "offer",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "offer"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Offer",
                "path": "offer.id"
              }
            ]
          }
        },
        {
          "name": "stableToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultPaymentTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "offer_payment_vault"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Offer",
                "path": "offer"
              }
            ]
          }
        },
        {
          "name": "originatorTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "originator_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Originator",
                "path": "originator"
              }
            ]
          }
        },
        {
          "name": "originator",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "originator"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "caller"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "withdrawInstallment",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "investorInstallment",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_installment"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Offer",
                "path": "offer"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Investor",
                "path": "investor"
              }
            ]
          }
        },
        {
          "name": "ownerInvestor",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "investor",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "owner_investor"
              }
            ]
          }
        },
        {
          "name": "investorOfferTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_offer_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Investor",
                "path": "investor"
              }
            ]
          }
        },
        {
          "name": "investorTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Investor",
                "path": "investor"
              }
            ]
          }
        },
        {
          "name": "vaultPaymentTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "offer_payment_vault"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Offer",
                "path": "offer"
              }
            ]
          }
        },
        {
          "name": "offerToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offer",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "offer"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Offer",
                "path": "offer.id"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "editOriginator",
      "accounts": [
        {
          "name": "originator",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "originator"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "caller"
              }
            ]
          }
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "caller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        }
      ]
    },
    {
      "name": "createInvestor",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "caller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "investor",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "caller"
              }
            ]
          }
        },
        {
          "name": "investorTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Investor",
                "path": "investor"
              }
            ]
          }
        },
        {
          "name": "stableCoin",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "editInvestor",
      "accounts": [
        {
          "name": "investor",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "depositTokens",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "caller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "investor",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "caller"
              }
            ]
          }
        },
        {
          "name": "investorTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Investor",
                "path": "investor"
              }
            ]
          }
        },
        {
          "name": "stableCoin",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawTokens",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "caller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "investor",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "caller"
              }
            ]
          }
        },
        {
          "name": "investorTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Investor",
                "path": "investor"
              }
            ]
          }
        },
        {
          "name": "toTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stableCoin",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "investor",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "tokenAccountBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "investorInstallments",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "countReceived",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "offer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "discriminator",
            "type": "u32"
          },
          {
            "name": "interestRatePercent",
            "type": "f32"
          },
          {
            "name": "goalAmount",
            "type": "u64"
          },
          {
            "name": "deadlineDate",
            "type": "i64"
          },
          {
            "name": "acquiredAmount",
            "type": "u64"
          },
          {
            "name": "originator",
            "type": "publicKey"
          },
          {
            "name": "installmentsCount",
            "type": "u8"
          },
          {
            "name": "installmentsTotalAmount",
            "type": "u64"
          },
          {
            "name": "totalInstallmentsPaid",
            "type": "u8"
          },
          {
            "name": "installmentsNextPaymentDate",
            "type": "i64"
          },
          {
            "name": "minAmountInvest",
            "type": "u64"
          },
          {
            "name": "startDate",
            "type": "i64"
          },
          {
            "name": "creditScore",
            "type": "u16"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "tokenBump",
            "type": "u8"
          },
          {
            "name": "vaultBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "originator",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "totalOffers",
            "type": "u32"
          },
          {
            "name": "tokenSlug",
            "type": "string"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "tokenAccountBump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "OfferStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Open"
          },
          {
            "name": "Failed"
          },
          {
            "name": "Funded"
          },
          {
            "name": "OnTrack"
          },
          {
            "name": "Finished"
          }
        ]
      }
    },
    {
      "name": "CreditScore",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "AAA"
          },
          {
            "name": "AA"
          },
          {
            "name": "A"
          },
          {
            "name": "BBB"
          },
          {
            "name": "BB"
          },
          {
            "name": "B"
          },
          {
            "name": "CCC"
          },
          {
            "name": "CC"
          },
          {
            "name": "C"
          },
          {
            "name": "DDD"
          },
          {
            "name": "DD"
          },
          {
            "name": "D"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "MaxNameLengthExceeded",
      "msg": "Max name length exceeded. Maximum length is 30"
    },
    {
      "code": 6001,
      "name": "AmountMustBeEqualToOrGreaterThanOne",
      "msg": "Amount must be equal to or greater than 1"
    },
    {
      "code": 6002,
      "name": "InsufficientBalance",
      "msg": "Insufficient balance"
    }
  ]
};
