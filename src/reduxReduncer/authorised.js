


export function authorised(authorised = [], action) {
    switch (action.type) {
      case "AUTHORISED_LOGIN":
        return action.payload;
      case "AUTHORISED_LOGOUT":
        return (authorised = "");
      default:
        return authorised;
    }
  };
  