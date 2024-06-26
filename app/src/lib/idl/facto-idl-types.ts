export type Hackathon = {
  "version": "0.1.0",
  "name": "hackathon",
  "instructions": [
    {
      "name": "createBorrower",
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
          "name": "borrower",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "borrower"
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
          "name": "borrowerTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "borrower_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Borrower",
                "path": "borrower"
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
      "name": "editBorrower",
      "accounts": [
        {
          "name": "borrower",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "borrower"
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
          "name": "borrower",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "borrower"
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
          "isMut": true,
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
          "name": "vaultStableTokenAccount",
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
          "name": "investorStableTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_stable_token_account"
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
                "kind": "arg",
                "type": "string",
                "path": "offer_id"
              }
            ]
          }
        },
        {
          "name": "offerToken",
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
          "name": "investment",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investment"
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
          "name": "offerId",
          "type": "string"
        },
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
          "name": "vaultStableTokenAccount",
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
          "name": "borrowerTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "borrower_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Borrower",
                "path": "borrower"
              }
            ]
          }
        },
        {
          "name": "borrower",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "borrower"
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
                "path": "offer_id"
              }
            ]
          }
        },
        {
          "name": "stableToken",
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
          "name": "offerId",
          "type": "string"
        }
      ]
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
                "kind": "arg",
                "type": "string",
                "path": "offer_id"
              }
            ]
          }
        },
        {
          "name": "stableToken",
          "isMut": true,
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
                "value": "vault_payment_token_account"
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
          "name": "borrowerTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "borrower_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Borrower",
                "path": "borrower"
              }
            ]
          }
        },
        {
          "name": "borrower",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "borrower"
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
      "args": [
        {
          "name": "offerId",
          "type": "string"
        }
      ]
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
          "name": "caller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "investment",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investment"
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
          "name": "investorStableTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_stable_token_account"
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
                "value": "vault_payment_token_account"
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
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offerToken",
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
                "path": "offer_id"
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
      "args": [
        {
          "name": "offerId",
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
          "name": "investorStableTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_stable_token_account"
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
          "name": "investorStableTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_stable_token_account"
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
          "name": "investorStableTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_stable_token_account"
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
    },
    {
      "name": "withdrawBorrowerTokens",
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
          "name": "borrower",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "borrower"
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
          "name": "borrowerTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "borrower_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Borrower",
                "path": "borrower"
              }
            ]
          }
        },
        {
          "name": "stableToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toTokenAccount",
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
      "name": "borrower",
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
    },
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
      "name": "investment",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "offer",
            "type": "publicKey"
          },
          {
            "name": "investor",
            "type": "publicKey"
          },
          {
            "name": "installmentsReceived",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "totalInvested",
            "type": "u64"
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
            "name": "borrower",
            "type": "publicKey"
          },
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
            "name": "installmentsCount",
            "type": "u8"
          },
          {
            "name": "installmentsTotalAmount",
            "type": "u64"
          },
          {
            "name": "totalInstallmentsPaid",
            "type": {
              "option": "u8"
            }
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
    }
  ],
  "types": [
    {
      "name": "OfferStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "StartingSoon"
          },
          {
            "name": "Failed"
          },
          {
            "name": "Canceled"
          },
          {
            "name": "Open"
          },
          {
            "name": "Funded"
          },
          {
            "name": "OnTrack"
          },
          {
            "name": "Delinquent"
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
      "name": "InsufficientBalance",
      "msg": "Insufficient Balance"
    },
    {
      "code": 6001,
      "name": "TransferFailedUnknown",
      "msg": "Transfer failed with an unknown error."
    },
    {
      "code": 6002,
      "name": "MaxNameLengthExceeded",
      "msg": "Max name length exceeded. Maximum length is 30"
    },
    {
      "code": 6003,
      "name": "MaxDescriptionLengthExceeded",
      "msg": "Max description length exceeded. Maximum length is 500"
    },
    {
      "code": 6004,
      "name": "MaxTokenSlugLengthExceeded",
      "msg": "Max token slug length exceeded. Maximum length is 30"
    }
  ]
};

export const IDL: Hackathon = {
  "version": "0.1.0",
  "name": "hackathon",
  "instructions": [
    {
      "name": "createBorrower",
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
          "name": "borrower",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "borrower"
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
          "name": "borrowerTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "borrower_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Borrower",
                "path": "borrower"
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
      "name": "editBorrower",
      "accounts": [
        {
          "name": "borrower",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "borrower"
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
          "name": "borrower",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "borrower"
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
          "isMut": true,
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
          "name": "vaultStableTokenAccount",
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
          "name": "investorStableTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_stable_token_account"
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
                "kind": "arg",
                "type": "string",
                "path": "offer_id"
              }
            ]
          }
        },
        {
          "name": "offerToken",
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
          "name": "investment",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investment"
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
          "name": "offerId",
          "type": "string"
        },
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
          "name": "vaultStableTokenAccount",
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
          "name": "borrowerTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "borrower_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Borrower",
                "path": "borrower"
              }
            ]
          }
        },
        {
          "name": "borrower",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "borrower"
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
                "path": "offer_id"
              }
            ]
          }
        },
        {
          "name": "stableToken",
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
          "name": "offerId",
          "type": "string"
        }
      ]
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
                "kind": "arg",
                "type": "string",
                "path": "offer_id"
              }
            ]
          }
        },
        {
          "name": "stableToken",
          "isMut": true,
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
                "value": "vault_payment_token_account"
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
          "name": "borrowerTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "borrower_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Borrower",
                "path": "borrower"
              }
            ]
          }
        },
        {
          "name": "borrower",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "borrower"
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
      "args": [
        {
          "name": "offerId",
          "type": "string"
        }
      ]
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
          "name": "caller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "investment",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investment"
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
          "name": "investorStableTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_stable_token_account"
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
                "value": "vault_payment_token_account"
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
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offerToken",
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
                "path": "offer_id"
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
      "args": [
        {
          "name": "offerId",
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
          "name": "investorStableTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_stable_token_account"
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
          "name": "investorStableTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_stable_token_account"
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
          "name": "investorStableTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "investor_stable_token_account"
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
    },
    {
      "name": "withdrawBorrowerTokens",
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
          "name": "borrower",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "borrower"
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
          "name": "borrowerTokenAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "borrower_token_account"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Borrower",
                "path": "borrower"
              }
            ]
          }
        },
        {
          "name": "stableToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toTokenAccount",
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
      "name": "borrower",
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
    },
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
      "name": "investment",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "offer",
            "type": "publicKey"
          },
          {
            "name": "investor",
            "type": "publicKey"
          },
          {
            "name": "installmentsReceived",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "totalInvested",
            "type": "u64"
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
            "name": "borrower",
            "type": "publicKey"
          },
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
            "name": "installmentsCount",
            "type": "u8"
          },
          {
            "name": "installmentsTotalAmount",
            "type": "u64"
          },
          {
            "name": "totalInstallmentsPaid",
            "type": {
              "option": "u8"
            }
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
    }
  ],
  "types": [
    {
      "name": "OfferStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "StartingSoon"
          },
          {
            "name": "Failed"
          },
          {
            "name": "Canceled"
          },
          {
            "name": "Open"
          },
          {
            "name": "Funded"
          },
          {
            "name": "OnTrack"
          },
          {
            "name": "Delinquent"
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
      "name": "InsufficientBalance",
      "msg": "Insufficient Balance"
    },
    {
      "code": 6001,
      "name": "TransferFailedUnknown",
      "msg": "Transfer failed with an unknown error."
    },
    {
      "code": 6002,
      "name": "MaxNameLengthExceeded",
      "msg": "Max name length exceeded. Maximum length is 30"
    },
    {
      "code": 6003,
      "name": "MaxDescriptionLengthExceeded",
      "msg": "Max description length exceeded. Maximum length is 500"
    },
    {
      "code": 6004,
      "name": "MaxTokenSlugLengthExceeded",
      "msg": "Max token slug length exceeded. Maximum length is 30"
    }
  ]
};
