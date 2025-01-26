// User permissions
{
  "users": {
    "select": {
      "filter": {
        "id": { "_eq": "X-Hasura-User-Id" }
      }
    },
    "update": {
      "filter": {
        "id": { "_eq": "X-Hasura-User-Id" }
      }
    }
  },
  "videos": {
    "select": {
      "filter": {
        "user_id": { "_eq": "X-Hasura-User-Id" }
      }
    },
    "insert": {
      "check": {
        "user_id": { "_eq": "X-Hasura-User-Id" }
      }
    },
    "update": {
      "filter": {
        "user_id": { "_eq": "X-Hasura-User-Id" }
      }
    },
    "delete": {
      "filter": {
        "user_id": { "_eq": "X-Hasura-User-Id" }
      }
    }
  },
  "summaries": {
    "select": {
      "filter": {
        "video": {
          "user_id": { "_eq": "X-Hasura-User-Id" }
        }
      }
    }
  }
} 