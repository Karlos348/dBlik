export type Dblik = {
  "version": "0.1.0",
  "name": "dblik",
  "instructions": [
    {
      "name": "initTransaction",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "requestPayment",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "transaction",
          "isMut": true,
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
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "message",
          "type": "string"
        }
      ]
    },
    {
      "name": "confirmTransaction",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "store",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "cancelTransaction",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "store",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setTimeout",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "store",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "closeTransactionAccount",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "transaction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "customer",
            "type": "publicKey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "state",
            "type": {
              "defined": "TransactionState"
            }
          },
          {
            "name": "store",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "message",
            "type": "string"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "CloseTransactionAccountErrors",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NoSignerKey"
          },
          {
            "name": "NotAuthenticated"
          },
          {
            "name": "InvalidTransactionState"
          }
        ]
      }
    },
    {
      "name": "ConfirmTransactionErrors",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NotAuthenticated"
          },
          {
            "name": "StoreKeyConflict"
          },
          {
            "name": "InsufficientBalance"
          },
          {
            "name": "InvalidTransactionState"
          }
        ]
      }
    },
    {
      "name": "InitializeTransactionErrors",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "ImproperlyCreatedAccount"
          },
          {
            "name": "TransactionAlreadyInitialized"
          },
          {
            "name": "NoCustomerKey"
          }
        ]
      }
    },
    {
      "name": "RequestPaymentErrors",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NoStoreKey"
          }
        ]
      }
    },
    {
      "name": "SetTimeoutErrors",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NoSignerKey"
          },
          {
            "name": "NotAuthenticated"
          },
          {
            "name": "InvalidTransactionState"
          },
          {
            "name": "StoreKeyConflict"
          }
        ]
      }
    },
    {
      "name": "TransactionState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Initialized"
          },
          {
            "name": "Pending"
          },
          {
            "name": "Succeed"
          },
          {
            "name": "Timeout"
          },
          {
            "name": "Canceled"
          }
        ]
      }
    },
    {
      "name": "TransactionErrors",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "InvalidTransactionState"
          },
          {
            "name": "TransactionExpired"
          },
          {
            "name": "TimeoutRequestedTooEarly"
          },
          {
            "name": "AccountsConflict"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NoSignerKey",
      "msg": "No signer key"
    },
    {
      "code": 6001,
      "name": "NotAuthenticated",
      "msg": "Not authenticated"
    },
    {
      "code": 6002,
      "name": "InvalidTransactionState",
      "msg": "Invalid transaction state"
    },
    {
      "code": 6003,
      "name": "StoreKeyConflict",
      "msg": "Store key conflict"
    }
  ]
};

export const IDL: Dblik = {
  "version": "0.1.0",
  "name": "dblik",
  "instructions": [
    {
      "name": "initTransaction",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "requestPayment",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "transaction",
          "isMut": true,
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
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "message",
          "type": "string"
        }
      ]
    },
    {
      "name": "confirmTransaction",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "store",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "cancelTransaction",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "store",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setTimeout",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "store",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "closeTransactionAccount",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "transaction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "transaction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "customer",
            "type": "publicKey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "state",
            "type": {
              "defined": "TransactionState"
            }
          },
          {
            "name": "store",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "message",
            "type": "string"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "CloseTransactionAccountErrors",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NoSignerKey"
          },
          {
            "name": "NotAuthenticated"
          },
          {
            "name": "InvalidTransactionState"
          }
        ]
      }
    },
    {
      "name": "ConfirmTransactionErrors",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NotAuthenticated"
          },
          {
            "name": "StoreKeyConflict"
          },
          {
            "name": "InsufficientBalance"
          },
          {
            "name": "InvalidTransactionState"
          }
        ]
      }
    },
    {
      "name": "InitializeTransactionErrors",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "ImproperlyCreatedAccount"
          },
          {
            "name": "TransactionAlreadyInitialized"
          },
          {
            "name": "NoCustomerKey"
          }
        ]
      }
    },
    {
      "name": "RequestPaymentErrors",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NoStoreKey"
          }
        ]
      }
    },
    {
      "name": "SetTimeoutErrors",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NoSignerKey"
          },
          {
            "name": "NotAuthenticated"
          },
          {
            "name": "InvalidTransactionState"
          },
          {
            "name": "StoreKeyConflict"
          }
        ]
      }
    },
    {
      "name": "TransactionState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Initialized"
          },
          {
            "name": "Pending"
          },
          {
            "name": "Succeed"
          },
          {
            "name": "Timeout"
          },
          {
            "name": "Canceled"
          }
        ]
      }
    },
    {
      "name": "TransactionErrors",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "InvalidTransactionState"
          },
          {
            "name": "TransactionExpired"
          },
          {
            "name": "TimeoutRequestedTooEarly"
          },
          {
            "name": "AccountsConflict"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NoSignerKey",
      "msg": "No signer key"
    },
    {
      "code": 6001,
      "name": "NotAuthenticated",
      "msg": "Not authenticated"
    },
    {
      "code": 6002,
      "name": "InvalidTransactionState",
      "msg": "Invalid transaction state"
    },
    {
      "code": 6003,
      "name": "StoreKeyConflict",
      "msg": "Store key conflict"
    }
  ]
};
